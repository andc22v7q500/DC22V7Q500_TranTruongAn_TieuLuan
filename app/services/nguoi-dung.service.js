// app/services/nguoi-dung.service.js

const pool = require("../config/mysql.config");

class NguoiDungService {
  // Hàm tạo mới người dùng
  async create(payload) {
    const ho_ten = payload.ho_ten;
    const email = payload.email;
    const mat_khau = payload.mat_khau;
    const so_dien_thoai = payload.so_dien_thoai || null;
    const vai_tro = payload.vai_tro || "khach_hang";

    const sql = `
            INSERT INTO nguoi_dung (ho_ten, email, mat_khau, so_dien_thoai, vai_tro) 
            VALUES (?, ?, ?, ?, ?)
        `;
    const [result] = await pool.execute(sql, [
      ho_ten,
      email,
      mat_khau,
      so_dien_thoai,
      vai_tro,
    ]);
    return { id: result.insertId, ...payload };
  }

  // Hàm tìm người dùng theo ID không lấy mật khẩu
  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, ho_ten, email, so_dien_thoai, vai_tro FROM nguoi_dung WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Hàm tìm người dùng theo email
  async findByEmail(email) {
    const [rows] = await pool.execute(
      "SELECT * FROM nguoi_dung WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  /**
   * Lấy tất cả người dùng.
   * Dùng cho trang Admin.
   * Không trả về mật khẩu cho lý do bảo mật.
   */
  async findAll() {
    const [rows] = await pool.execute(
      "SELECT id, ho_ten, email, so_dien_thoai, vai_tro FROM nguoi_dung"
    );
    return rows;
  }

  /**
   * Cập nhật thông tin người dùng.
   * Admin có thể cập nhật mọi thứ, người dùng chỉ nên cập nhật thông tin cá nhân.
   * Hàm này sẽ không cho phép cập nhật mật khẩu.
   */
  async update(id, payload) {
    // Chỉ cho phép cập nhật các trường này
    const { ho_ten, so_dien_thoai, vai_tro } = payload;
    const sql =
      "UPDATE nguoi_dung SET ho_ten = ?, so_dien_thoai = ?, vai_tro = ? WHERE id = ?";
    await pool.execute(sql, [ho_ten, so_dien_thoai, vai_tro, id]);
    return this.findById(id); // Trả về thông tin mới nhất (không có mật khẩu)
  }

  /**
   * Xóa một người dùng.
   * Đây là hành động nguy hiểm, cần cẩn thận.
   */
  async delete(id) {
    const [result] = await pool.execute("DELETE FROM nguoi_dung WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = new NguoiDungService();
