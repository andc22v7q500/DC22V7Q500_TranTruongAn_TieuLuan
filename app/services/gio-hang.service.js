// app/services/gio-hang.service.js
const pool = require("../config/mysql.config");

class GioHangService {
  /**
   * Tìm hoặc Tạo giỏ hàng cho một người dùng.
   * Mỗi người dùng chỉ có 1 giỏ hàng.
   */
  async findOrCreateCart(userId) {
    // Thử tìm giỏ hàng trước
    let [cartRows] = await pool.execute(
      "SELECT * FROM gio_hang WHERE ma_nguoi_dung = ?",
      [userId]
    );

    if (cartRows.length > 0) {
      return cartRows[0]; // Trả về giỏ hàng đã có
    } else {
      // Nếu chưa có, tạo mới
      const [result] = await pool.execute(
        "INSERT INTO gio_hang (ma_nguoi_dung) VALUES (?)",
        [userId]
      );
      return { id: result.insertId, ma_nguoi_dung: userId };
    }
  }

  /**
   * Thêm một sản phẩm vào giỏ hàng hoặc cập nhật số lượng nếu đã tồn tại.
   */
  async addItem(cartId, variantId, quantity) {
    // Kiểm tra xem sản phẩm đã có trong chi_tiet_gio_hang chưa
    const [existingItem] = await pool.execute(
      "SELECT * FROM chi_tiet_gio_hang WHERE ma_gio_hang = ? AND ma_bien_the = ?",
      [cartId, variantId]
    );

    if (existingItem.length > 0) {
      // Nếu đã có, cập nhật số lượng
      const newQuantity = existingItem[0].so_luong + quantity;
      await pool.execute(
        "UPDATE chi_tiet_gio_hang SET so_luong = ? WHERE id = ?",
        [newQuantity, existingItem[0].id]
      );
    } else {
      // Nếu chưa có, thêm mới
      await pool.execute(
        "INSERT INTO chi_tiet_gio_hang (ma_gio_hang, ma_bien_the, so_luong) VALUES (?, ?, ?)",
        [cartId, variantId, quantity]
      );
    }
    return this.getCartDetails(cartId); // Trả về toàn bộ giỏ hàng sau khi cập nhật
  }

  /**
   * Lấy toàn bộ thông tin chi tiết của một giỏ hàng.
   * Dùng JOIN để lấy cả thông tin sản phẩm và biến thể.
   */
  async getCartDetails(cartId) {
    const sql = `
            SELECT 
                ctgh.id,
                ctgh.so_luong,
                btsp.id AS ma_bien_the,
                btsp.ten_bien_the,
                btsp.gia_ban,
                sp.ten_san_pham,
                sp.hinh_anh_dai_dien
            FROM chi_tiet_gio_hang AS ctgh
            JOIN bien_the_san_pham AS btsp ON ctgh.ma_bien_the = btsp.id
            JOIN san_pham AS sp ON btsp.ma_san_pham = sp.id
            WHERE ctgh.ma_gio_hang = ?
        `;
    const [items] = await pool.execute(sql, [cartId]);
    return items;
  }

  /**
   * Cập nhật số lượng của một item trong giỏ hàng.
   * `cartItemId` là id của bảng `chi_tiet_gio_hang`.
   */
  async updateItemQuantity(cartItemId, quantity) {
    await pool.execute(
      "UPDATE chi_tiet_gio_hang SET so_luong = ? WHERE id = ?",
      [quantity, cartItemId]
    );
  }

  /**
   * Xóa một item khỏi giỏ hàng.
   * `cartItemId` là id của bảng `chi_tiet_gio_hang`.
   */
  async removeItem(cartItemId) {
    const [result] = await pool.execute(
      "DELETE FROM chi_tiet_gio_hang WHERE id = ?",
      [cartItemId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new GioHangService();
