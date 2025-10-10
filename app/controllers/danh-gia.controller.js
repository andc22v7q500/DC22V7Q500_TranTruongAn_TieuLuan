// app/controllers/danh-gia.controller.js
const DanhGiaService = require("../services/danh-gia.service");
const ApiError = require("../api-error");

// Tạo một đánh giá mới cho sản phẩm
exports.create = async (req, res, next) => {
  try {
    const userId = req.user.id; // Lấy từ authMiddleware
    const productId = req.params.productId;
    const payload = req.body;

    // 1. Kiểm tra xem người dùng đã mua sản phẩm này chưa
    const hasPurchased = await DanhGiaService.checkPurchaseHistory(
      userId,
      productId
    );
    if (!hasPurchased) {
      return next(
        new ApiError(
          403,
          "Bạn chỉ có thể đánh giá sản phẩm đã mua và đã nhận thành công."
        )
      );
    }

    // 2. Nếu đã mua, tiến hành tạo đánh giá
    const document = await DanhGiaService.create(userId, productId, payload);
    return res.send(document);
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    return next(new ApiError(500, "Có lỗi xảy ra khi tạo đánh giá"));
  }
};

// Lấy tất cả đánh giá của một sản phẩm
exports.findAll = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const documents = await DanhGiaService.findAllByProductId(productId);
    return res.send(documents);
  } catch (error) {
    console.error("FIND ALL REVIEWS ERROR:", error);
    return next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách đánh giá"));
  }
};

exports.findAllForAdmin = async (req, res, next) => {
  try {
    const documents = await DanhGiaService.findAllForAdmin();
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách tất cả đánh giá"));
  }
};

exports.deleteForAdmin = async (req, res, next) => {
  try {
    const deleted = await DanhGiaService.deleteForAdmin(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy đánh giá"));
    }
    return res.send({ message: "Đánh giá đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa đánh giá với id=${req.params.id}`)
    );
  }
};
