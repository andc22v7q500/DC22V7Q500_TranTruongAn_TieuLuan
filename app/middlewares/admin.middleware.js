// app/middlewares/admin.middleware.js
const ApiError = require("../api-error");

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.vai_tro === "quan_tri_vien") {
    // Nếu vai trò là 'quan_tri_vien', cho phép đi tiếp
    next();
  } else {
    // Nếu không, chặn lại với lỗi 403 Forbidden (Cấm truy cập)
    return next(
      new ApiError(403, "Hành động bị từ chối. Yêu cầu quyền Quản trị viên.")
    );
  }
};

module.exports = adminMiddleware;
