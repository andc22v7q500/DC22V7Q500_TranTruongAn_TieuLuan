// app/services/don-hang.service.js
const pool = require("../config/mysql.config");
const GioHangService = require("./gio-hang.service"); // Import service giỏ hàng
const DiaChiService = require("./dia-chi.service"); // Import service địa chỉ

class DonHangService {
  async createOrder(userId, payload) {
    const connection = await pool.getConnection(); // Lấy một kết nối từ pool để quản lý transaction
    try {
      // 1. BẮT ĐẦU TRANSACTION
      await connection.beginTransaction();

      // 2. Lấy thông tin giỏ hàng của người dùng
      const cart = await GioHangService.findOrCreateCart(userId);
      const cartItems = await GioHangService.getCartDetails(cart.id);

      if (cartItems.length === 0) {
        throw new Error("Giỏ hàng của bạn đang trống");
      }

      // 3. Lấy thông tin địa chỉ giao hàng
      // (Cần tạo hàm findById trong dia-chi.service.js)
      const address = await DiaChiService.findById(payload.ma_dia_chi, userId);
      if (!address) {
        throw new Error("Địa chỉ giao hàng không hợp lệ");
      }
      const fullAddressString = `${address.dia_chi_cu_the}, ${address.phuong_xa}, ${address.quan_huyen}, ${address.tinh_thanh}`;

      // 4. Tính tổng tiền
      let tong_tien = 0;
      for (const item of cartItems) {
        // (Thêm logic kiểm tra tồn kho ở đây nếu cần)
        tong_tien += item.gia_ban * item.so_luong;
      }
      // (Thêm logic tính phí ship, mã giảm giá ở đây nếu có)

      // 5. Tạo đơn hàng trong bảng `don_hang`
      const [orderResult] = await connection.execute(
        "INSERT INTO don_hang (ma_nguoi_dung, tong_tien, dia_chi_giao_hang) VALUES (?, ?, ?)",
        [userId, tong_tien, fullAddressString]
      );
      const newOrderId = orderResult.insertId;

      // 6. Lặp qua các sản phẩm trong giỏ và xử lý
      for (const item of cartItems) {
        // a. Lấy thông tin biến thể để kiểm tra tồn kho
        const [variantRows] = await connection.execute(
          "SELECT so_luong_ton FROM bien_the_san_pham WHERE id = ?",
          [item.ma_bien_the] // Giả sử getCartDetails trả về ma_bien_the
        );

        if (
          variantRows.length === 0 ||
          variantRows[0].so_luong_ton < item.so_luong
        ) {
          // Nếu hết hàng -> Hủy bỏ tất cả
          throw new Error(
            `Sản phẩm "${item.ten_san_pham}" không đủ số lượng tồn kho.`
          );
        }

        // b. Thêm vào bảng `chi_tiet_don_hang`
        await connection.execute(
          "INSERT INTO chi_tiet_don_hang (ma_don_hang, ma_bien_the, so_luong, don_gia) VALUES (?, ?, ?, ?)",
          [newOrderId, item.ma_bien_the, item.so_luong, item.gia_ban]
        );

        // c. TRỪ KHO (Cực kỳ quan trọng)
        await connection.execute(
          "UPDATE bien_the_san_pham SET so_luong_ton = so_luong_ton - ? WHERE id = ?",
          [item.so_luong, item.ma_bien_the]
        );
      }

      // 7. Xóa các sản phẩm trong giỏ hàng cũ
      await connection.execute(
        "DELETE FROM chi_tiet_gio_hang WHERE ma_gio_hang = ?",
        [cart.id]
      );

      // 8. Nếu mọi thứ thành công -> LƯU TRANSACTION
      await connection.commit();

      // Trả về ID của đơn hàng vừa tạo
      return { orderId: newOrderId };
    } catch (error) {
      // 9. Nếu có bất kỳ lỗi nào xảy ra -> HỦY BỎ TẤT CẢ
      await connection.rollback();
      // Ném lỗi ra để controller bắt được
      throw error;
    } finally {
      // Luôn luôn trả kết nối về cho pool sau khi xong
      connection.release();
    }
  }

  // (Các hàm khác như lấy lịch sử đơn hàng...)
}
module.exports = new DonHangService();
