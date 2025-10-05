const pool = require("../config/mysql.config");

class BienTheSanPhamService {
  // Hàm tạo mới một biến thể cho một sản phẩm
  // Cần truyền vào `ma_san_pham` từ URL và `payload` từ body
  async create(ma_san_pham, payload) {
    const sql = `
            INSERT INTO bien_the_san_pham 
            (ma_san_pham, ten_bien_the, gia_ban, so_luong_ton) 
            VALUES (?, ?, ?, ?)
        `;
    const [result] = await pool.execute(sql, [
      ma_san_pham,
      payload.ten_bien_the,
      payload.gia_ban,
      payload.so_luong_ton,
    ]);
    return { id: result.insertId, ma_san_pham, ...payload };
  }

  // Hàm tìm một biến thể theo ID (để dùng cho update/delete)
  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM bien_the_san_pham WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Hàm cập nhật một biến thể
  async update(id, payload) {
    const sql = `
            UPDATE bien_the_san_pham 
            SET ten_bien_the = ?, gia_ban = ?, so_luong_ton = ? 
            WHERE id = ?
        `;
    await pool.execute(sql, [
      payload.ten_bien_the,
      payload.gia_ban,
      payload.so_luong_ton,
      id,
    ]);
    return this.findById(id);
  }

  // Hàm xóa một biến thể
  async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM bien_the_san_pham WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new BienTheSanPhamService();
