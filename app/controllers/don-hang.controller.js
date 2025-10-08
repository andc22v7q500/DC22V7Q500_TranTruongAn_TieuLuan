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

// Hàm cho Admin lấy tất cả đơn hàng
exports.findAllOrders = async (req, res, next) => {
  try {
    const documents = await DonHangService.findAll();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách đơn hàng"));
  }
};

// Hàm cho Admin cập nhật trạng thái
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { trang_thai } = req.body;
    if (!trang_thai) {
      return next(new ApiError(400, "Trạng thái mới là bắt buộc"));
    }
    const updated = await DonHangService.updateStatus(
      req.params.id,
      trang_thai
    );
    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy đơn hàng"));
    }
    return res.send({ message: "Trạng thái đơn hàng đã được cập nhật" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật trạng thái đơn hàng"));
  }
};

// Lấy lịch sử đơn hàng của người dùng đang đăng nhập
exports.findAllForUser = async (req, res, next) => {
  try {
    const documents = await DonHangService.findAllByUserId(req.user.id);
    return res.send(documents);
  } catch (error) {
    console.error("FIND ALL ORDERS FOR USER ERROR:", error);
    return next(new ApiError(500, "Có lỗi xảy ra khi lấy lịch sử đơn hàng"));
  }
};

// Lấy chi tiết một đơn hàng của người dùng đang đăng nhập
exports.findOneForUser = async (req, res, next) => {
  try {
    const document = await DonHangService.findOneByUserId(
      req.params.id,
      req.user.id
    );
    if (!document) {
      return next(
        new ApiError(
          404,
          "Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập"
        )
      );
    }
    return res.send(document);
  } catch (error) {
    console.error("FIND ONE ORDER FOR USER ERROR:", error);
    return next(
      new ApiError(500, `Lỗi khi lấy chi tiết đơn hàng với id=${req.params.id}`)
    );
  }
};
