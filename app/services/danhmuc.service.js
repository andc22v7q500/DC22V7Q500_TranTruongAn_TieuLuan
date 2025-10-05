// app/services/danhmuc.service.js

const pool = require("../config/mysql.config"); // Import pool kết nối

class DanhMucService {
  // Hàm tạo mới một danh mục
  async create(payload) {
    const sql = "INSERT INTO danh_muc (ten_danh_muc) VALUES (?)";
    const [result] = await pool.execute(sql, [payload.ten_danh_muc]);
    return { id: result.insertId, ...payload };
  }

  // Hàm lấy tất cả danh mục
  async findAll() {
    const [rows] = await pool.execute("SELECT * FROM danh_muc");
    return rows;
  }

  // Hàm tìm một danh mục theo ID
  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM danh_muc WHERE id = ?", [
      id,
    ]);
    return rows[0]; // Trả về object đầu tiên trong mảng kết quả
  }

  // Hàm cập nhật một danh mục
  async update(id, payload) {
    const sql = "UPDATE danh_muc SET ten_danh_muc = ? WHERE id = ?";
    await pool.execute(sql, [payload.ten_danh_muc, id]);
    // Trả về dữ liệu đã được cập nhật
    return this.findById(id);
  }

  // Hàm xóa một danh mục
  async delete(id) {
    const [result] = await pool.execute("DELETE FROM danh_muc WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0; // Trả về true nếu xóa thành công, false nếu không
  }
}

module.exports = new DanhMucService();
