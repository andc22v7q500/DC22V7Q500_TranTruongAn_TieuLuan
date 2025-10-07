// app/services/dia-chi.service.js
const pool = require("../config/mysql.config");

class DiaChiService {
  // Hàm tạo mới một địa chỉ cho người dùng
  async create(userId, payload) {
    const { dia_chi_cu_the, phuong_xa, quan_huyen, tinh_thanh, la_mac_dinh } =
      payload;
    const sql = `
            INSERT INTO dia_chi (ma_nguoi_dung, dia_chi_cu_the, phuong_xa, quan_huyen, tinh_thanh, la_mac_dinh) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(sql, [
      userId,
      dia_chi_cu_the,
      phuong_xa,
      quan_huyen,
      tinh_thanh,
      la_mac_dinh || 0,
    ]);
    return { id: result.insertId, ma_nguoi_dung: userId, ...payload };
  }

  // Hàm lấy tất cả địa chỉ của một người dùng
  async findAllByUserId(userId) {
    const sql = "SELECT * FROM dia_chi WHERE ma_nguoi_dung = ?";
    const [rows] = await pool.execute(sql, [userId]);
    return rows;
  }

  // Hàm tìm một địa chỉ cụ thể theo ID, đảm bảo nó thuộc về đúng người dùng
  async findById(id, userId) {
    const sql = "SELECT * FROM dia_chi WHERE id = ? AND ma_nguoi_dung = ?";
    const [rows] = await pool.execute(sql, [id, userId]);
    return rows[0];
  }

  // Hàm cập nhật một địa chỉ
  async update(id, userId, payload) {
    const { dia_chi_cu_the, phuong_xa, quan_huyen, tinh_thanh, la_mac_dinh } =
      payload;
    const sql = `
            UPDATE dia_chi SET dia_chi_cu_the = ?, phuong_xa = ?, quan_huyen = ?, tinh_thanh = ?, la_mac_dinh = ? 
            WHERE id = ? AND ma_nguoi_dung = ?
        `;
    const [result] = await pool.execute(sql, [
      dia_chi_cu_the,
      phuong_xa,
      quan_huyen,
      tinh_thanh,
      la_mac_dinh,
      id,
      userId,
    ]);
    return result.affectedRows > 0;
  }

  // Hàm xóa một địa chỉ
  async delete(id, userId) {
    const sql = "DELETE FROM dia_chi WHERE id = ? AND ma_nguoi_dung = ?";
    const [result] = await pool.execute(sql, [id, userId]);
    return result.affectedRows > 0;
  }
}

module.exports = new DiaChiService();
