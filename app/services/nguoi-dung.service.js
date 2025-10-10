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
    // 1. Lấy thông tin người dùng hiện tại từ CSDL để có giá trị cũ
    const [currentUserRows] = await pool.execute(
      "SELECT * FROM nguoi_dung WHERE id = ?",
      [id]
    );

    // Nếu không tìm thấy người dùng, trả về null để controller báo lỗi 404
    if (currentUserRows.length === 0) {
      return null;
    }
    const currentUser = currentUserRows[0];

    // 2. Tạo một object dữ liệu mới, ưu tiên giá trị từ payload, nếu không có thì dùng giá trị cũ
    const updatedUser = {
      ho_ten:
        payload.ho_ten !== undefined ? payload.ho_ten : currentUser.ho_ten,
      so_dien_thoai:
        payload.so_dien_thoai !== undefined
          ? payload.so_dien_thoai
          : currentUser.so_dien_thoai,
      vai_tro:
        payload.vai_tro !== undefined ? payload.vai_tro : currentUser.vai_tro,
    };

    // 3. Thực thi câu lệnh UPDATE với dữ liệu đã được chuẩn hóa
    const sql =
      "UPDATE nguoi_dung SET ho_ten = ?, so_dien_thoai = ?, vai_tro = ? WHERE id = ?";
    await pool.execute(sql, [
      updatedUser.ho_ten,
      updatedUser.so_dien_thoai,
      updatedUser.vai_tro,
      id,
    ]);

    // 4. Trả về thông tin người dùng mới nhất (không có mật khẩu)
    return this.findById(id);
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

  async updateProfile(id, payload) {
    // Chỉ cho phép người dùng cập nhật họ tên và số điện thoại
    const { ho_ten, so_dien_thoai } = payload;

    // Lấy thông tin cũ để điền vào những trường không được cập nhật
    const [currentUserRows] = await pool.execute(
      "SELECT * FROM nguoi_dung WHERE id = ?",
      [id]
    );
    if (currentUserRows.length === 0) return null;
    const currentUser = currentUserRows[0];

    const sql =
      "UPDATE nguoi_dung SET ho_ten = ?, so_dien_thoai = ? WHERE id = ?";

    await pool.execute(sql, [
      ho_ten !== undefined ? ho_ten : currentUser.ho_ten, // Nếu có ho_ten mới thì dùng, không thì dùng cái cũ
      so_dien_thoai !== undefined ? so_dien_thoai : currentUser.so_dien_thoai, // Tương tự cho sđt
      id,
    ]);

    return this.findById(id);
  }
}

module.exports = new NguoiDungService();
