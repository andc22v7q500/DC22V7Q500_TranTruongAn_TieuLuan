const jwt = require("jsonwebtoken");
const ApiError = require("../api-error");

const authMiddleware = (req, res, next) => {
  // 1. Lấy token từ header
  // Token thường được gửi theo dạng: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Nếu không có token -> Chặn
  if (token == null) {
    return next(new ApiError(401, "Authentication token required")); // 401 Unauthorized
  }

  // 3. Xác thực token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new ApiError(403, "Invalid token")); // 403 Forbidden
    }

    // 4. Nếu token hợp lệ, lưu thông tin user vào request để các hàm sau có thể dùng
    req.user = user;
    next(); // Cho phép đi tiếp
  });
};

module.exports = authMiddleware;
