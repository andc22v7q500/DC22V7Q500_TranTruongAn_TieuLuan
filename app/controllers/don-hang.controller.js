// app/controllers/don-hang.controller.js
const DonHangService = require("../services/don-hang.service");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const userId = req.user.id; // Lấy từ authMiddleware
    const result = await DonHangService.createOrder(userId, req.body);
    return res.send(result);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    // Phân loại lỗi để trả về thông báo thân thiện hơn
    if (error.message.includes("tồn kho") || error.message.includes("trống")) {
      return next(new ApiError(400, error.message)); // Lỗi từ phía người dùng
    }
    return next(new ApiError(500, "Có lỗi xảy ra khi tạo đơn hàng"));
  }
};
