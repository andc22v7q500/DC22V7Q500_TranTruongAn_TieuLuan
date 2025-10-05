// app/controllers/nguoi-dung.controller.js
const NguoiDungService = require("../services/nguoi-dung.service");
const ApiError = require("../api-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hàm Đăng ký
exports.signUp = async (req, res, next) => {
  try {
    // 1. Validate input
    if (!req.body?.email || !req.body?.mat_khau || !req.body?.ho_ten) {
      return next(new ApiError(400, "Họ tên, email và mật khẩu là bắt buộc"));
    }

    // 2. Kiểm tra email đã tồn tại chưa
    const existingUser = await NguoiDungService.findByEmail(req.body.email);
    if (existingUser) {
      return next(new ApiError(409, "Email đã được sử dụng"));
    }

    // 3. Băm mật khẩu
    const hashedPassword = await bcrypt.hash(req.body.mat_khau, 10); // 10 là salt rounds

    // 4. Tạo người dùng mới trong CSDL
    const newUser = await NguoiDungService.create({
      ...req.body,
      mat_khau: hashedPassword, // Lưu mật khẩu đã băm
    });

    // Không trả về mật khẩu
    delete newUser.mat_khau;

    return res.status(201).send(newUser);
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return next(new ApiError(500, "Có lỗi xảy ra khi đăng ký tài khoản"));
  }
};

// Hàm Đăng nhập
exports.signIn = async (req, res, next) => {
  try {
    // 1. Validate input
    if (!req.body?.email || !req.body?.mat_khau) {
      return next(new ApiError(400, "Email và mật khẩu là bắt buộc"));
    }

    // 2. Tìm người dùng bằng email
    const user = await NguoiDungService.findByEmail(req.body.email);
    if (!user) {
      return next(new ApiError(401, "Sai thông tin đăng nhập")); // Lỗi 401: Unauthorized
    }

    // 3. So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(
      req.body.mat_khau,
      user.mat_khau
    );
    if (!isPasswordValid) {
      return next(new ApiError(401, "Sai thông tin đăng nhập"));
    }

    // 4. Tạo JWT token
    const token = jwt.sign(
      { id: user.id, vai_tro: user.vai_tro }, // payload chứa thông tin người dùng
      "YOUR_SECRET_KEY", // Khóa bí mật (nên đặt trong file .env)
      { expiresIn: "24h" } // Token hết hạn sau 24 giờ
    );

    // 5. Trả về thông tin người dùng và token
    return res.send({
      id: user.id,
      email: user.email,
      ho_ten: user.ho_ten,
      accessToken: token,
    });
  } catch (error) {
    console.error("SIGNIN ERROR:", error);
    return next(new ApiError(500, "Có lỗi xảy ra khi đăng nhập"));
  }
};
