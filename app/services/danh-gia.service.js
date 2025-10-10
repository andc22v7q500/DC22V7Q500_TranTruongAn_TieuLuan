// app/services/danh-gia.service.js
const pool = require("../config/mysql.config");

class DanhGiaService {
  /**
   * Kiểm tra xem một người dùng đã mua và nhận thành công một sản phẩm hay chưa.
   * @param {number} userId - ID của người dùng
   * @param {number} productId - ID của sản phẩm (bảng san_pham)
   * @returns {boolean} - Trả về true nếu đã mua, false nếu chưa.
   */
  async checkPurchaseHistory(userId, productId) {
    const sql = `
            SELECT COUNT(dh.id) AS purchase_count
            FROM don_hang AS dh
            JOIN chi_tiet_don_hang AS ctdh ON dh.id = ctdh.ma_don_hang
            JOIN bien_the_san_pham AS btsp ON ctdh.ma_bien_the = btsp.id
            WHERE dh.ma_nguoi_dung = ? 
              AND btsp.ma_san_pham = ? 
              AND dh.trang_thai = 'hoan_thanh'
        `;
    const [rows] = await pool.execute(sql, [userId, productId]);
    return rows[0].purchase_count > 0;
  }

  /**
   * Tạo một đánh giá mới.
   */
  async create(userId, productId, payload) {
    const { so_sao, binh_luan } = payload;
    const sql = `
            INSERT INTO danh_gia_san_pham (ma_nguoi_dung, ma_san_pham, so_sao, binh_luan) 
            VALUES (?, ?, ?, ?)
        `;
    const [result] = await pool.execute(sql, [
      userId,
      productId,
      so_sao,
      binh_luan,
    ]);
    return {
      id: result.insertId,
      ma_nguoi_dung: userId,
      ma_san_pham: productId,
      ...payload,
    };
  }

  /**
   * Lấy tất cả đánh giá của một sản phẩm.
   */
  async findAllByProductId(productId) {
    const sql = `
            SELECT 
                dg.id, dg.so_sao, dg.binh_luan, dg.ngay_tao,
                nd.ho_ten AS ten_nguoi_danh_gia
            FROM danh_gia_san_pham AS dg
            JOIN nguoi_dung AS nd ON dg.ma_nguoi_dung = nd.id
            WHERE dg.ma_san_pham = ?
            ORDER BY dg.ngay_tao DESC
        `;
    const [rows] = await pool.execute(sql, [productId]);
    return rows;
  }

  async findAllForAdmin() {
    const sql = `
        SELECT 
            dg.id, dg.so_sao, dg.binh_luan, dg.ngay_tao,
            nd.id AS ma_nguoi_dung, nd.email AS email_nguoi_dung,
            sp.id AS ma_san_pham, sp.ten_san_pham
        FROM danh_gia_san_pham AS dg
        JOIN nguoi_dung AS nd ON dg.ma_nguoi_dung = nd.id
        JOIN san_pham AS sp ON dg.ma_san_pham = sp.id
        ORDER BY dg.ngay_tao DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
  }

  async deleteForAdmin(id) {
    const [result] = await pool.execute(
      "DELETE FROM danh_gia_san_pham WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new DanhGiaService();
