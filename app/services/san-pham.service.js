const pool = require("../config/mysql.config");

class SanPhamService {
  // Hàm tạo mới một sản phẩm (thông tin chung)
  async create(payload) {
    const sql = `
            INSERT INTO san_pham 
            (ten_san_pham, mo_ta, hinh_anh_dai_dien, ma_danh_muc, ma_thuong_hieu) 
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(sql, [
      payload.ten_san_pham,
      payload.mo_ta,
      payload.hinh_anh_dai_dien,
      payload.ma_danh_muc,
      payload.ma_thuong_hieu,
    ]);
    // Trả về sản phẩm vừa tạo với id
    return { id: result.insertId, ...payload };
  }

  // Hàm lấy tất cả sản phẩm (bao gồm tên danh mục và thương hiệu)
  async findAll() {
    const sql = `
            SELECT 
                sp.*, 
                dm.ten_danh_muc, 
                th.ten_thuong_hieu 
            FROM san_pham AS sp
            JOIN danh_muc AS dm ON sp.ma_danh_muc = dm.id
            JOIN thuong_hieu AS th ON sp.ma_thuong_hieu = th.id
        `;
    const [rows] = await pool.execute(sql);
    return rows;
  }

  // Hàm tìm một sản phẩm theo ID (bao gồm cả các biến thể)
  async findById(id) {
    // 1. Lấy thông tin sản phẩm gốc (join để có tên danh mục, thương hiệu)
    const [productRows] = await pool.execute(
      `SELECT sp.*, dm.ten_danh_muc, th.ten_thuong_hieu 
             FROM san_pham AS sp
             JOIN danh_muc AS dm ON sp.ma_danh_muc = dm.id
             JOIN thuong_hieu AS th ON sp.ma_thuong_hieu = th.id
             WHERE sp.id = ?`,
      [id]
    );

    if (productRows.length === 0) {
      return null; // Không tìm thấy sản phẩm
    }
    const product = productRows[0];

    // 2. Lấy danh sách các biến thể của sản phẩm đó
    const [variantRows] = await pool.execute(
      "SELECT * FROM bien_the_san_pham WHERE ma_san_pham = ?",
      [id]
    );

    // 3. Gộp kết quả lại
    product.bien_the = variantRows;

    return product;
  }

  // Hàm cập nhật thông tin chung của sản phẩm
  async update(id, payload) {
    const sql = `
            UPDATE san_pham 
            SET ten_san_pham = ?, mo_ta = ?, hinh_anh_dai_dien = ?, 
                ma_danh_muc = ?, ma_thuong_hieu = ? 
            WHERE id = ?
        `;
    await pool.execute(sql, [
      payload.ten_san_pham,
      payload.mo_ta,
      payload.hinh_anh_dai_dien,
      payload.ma_danh_muc,
      payload.ma_thuong_hieu,
      id,
    ]);
    return this.findById(id);
  }

  // Hàm xóa một sản phẩm (Lưu ý: Cần xử lý các biến thể liên quan)
  async delete(id) {
    // Để đảm bảo toàn vẹn dữ liệu, ta nên xóa các biến thể trước
    await pool.execute("DELETE FROM bien_the_san_pham WHERE ma_san_pham = ?", [
      id,
    ]);
    // Sau đó mới xóa sản phẩm gốc
    const [result] = await pool.execute("DELETE FROM san_pham WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = new SanPhamService();
