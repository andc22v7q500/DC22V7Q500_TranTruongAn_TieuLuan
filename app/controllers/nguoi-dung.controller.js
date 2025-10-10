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
      process.env.JWT_SECRET,
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

exports.getProfile = async (req, res, next) => {
  try {
    // authMiddleware đã xác thực và lưu user vào req.user
    // Chúng ta chỉ cần lấy id từ đó và gọi service
    const userId = req.user.id;
    const userProfile = await NguoiDungService.findById(userId);

    if (!userProfile) {
      return next(new ApiError(404, "Không tìm thấy người dùng"));
    }

    // Service findById đã được thiết kế để không trả về mật khẩu, rất an toàn
    return res.send(userProfile);
  } catch (error) {
    return next(
      new ApiError(500, "Có lỗi xảy ra khi lấy thông tin người dùng")
    );
  }
};

exports.updateProfile = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }
  try {
    const userId = req.user.id; // Lấy id của chính người đang đăng nhập
    const document = await NguoiDungService.updateProfile(userId, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy người dùng"));
    }
    return res.send({
      message: "Thông tin cá nhân đã được cập nhật",
      data: document,
    });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật thông tin cá nhân"));
  }
};

// [ADMIN] Lấy danh sách tất cả người dùng
exports.findAll = async (req, res, next) => {
  try {
    const documents = await NguoiDungService.findAll();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách người dùng"));
  }
};

// [ADMIN] Lấy chi tiết một người dùng
exports.findOne = async (req, res, next) => {
  try {
    const document = await NguoiDungService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy người dùng"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Lỗi khi lấy thông tin người dùng với id=${req.params.id}`
      )
    );
  }
};

// [ADMIN] Cập nhật một người dùng (ví dụ: đổi vai trò, họ tên, sđt)
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }
  try {
    const document = await NguoiDungService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy người dùng"));
    }
    return res.send({
      message: "Người dùng đã được cập nhật thành công",
      data: document,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật người dùng với id=${req.params.id}`)
    );
  }
};

// [ADMIN] Xóa một người dùng
exports.delete = async (req, res, next) => {
  try {
    const deleted = await NguoiDungService.delete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy người dùng"));
    }
    return res.send({ message: "Người dùng đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa người dùng với id=${req.params.id}`)
    );
  }
};
