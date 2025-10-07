// app/controllers/gio-hang.controller.js
const GioHangService = require("../services/gio-hang.service");
const ApiError = require("../api-error");

// Thêm sản phẩm vào giỏ
exports.addItemToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { ma_bien_the, so_luong } = req.body;

    if (!ma_bien_the || !so_luong) {
      return next(new ApiError(400, "Mã biến thể và số lượng là bắt buộc"));
    }

    // 1. Tìm hoặc tạo giỏ hàng cho người dùng
    const cart = await GioHangService.findOrCreateCart(userId);
    // 2. Thêm sản phẩm vào giỏ hàng
    const updatedCart = await GioHangService.addItem(
      cart.id,
      ma_bien_the,
      so_luong
    );

    return res.send(updatedCart);
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng")
    );
  }
};

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await GioHangService.findOrCreateCart(userId);
    const cartDetails = await GioHangService.getCartDetails(cart.id);
    return res.send(cartDetails);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Có lỗi xảy ra khi lấy thông tin giỏ hàng"));
  }
};

// Cập nhật số lượng
exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params; // itemId là id của chi_tiet_gio_hang
    const { so_luong } = req.body;

    if (!so_luong || so_luong <= 0) {
      await GioHangService.removeItem(itemId);
      return res.send({
        message: "Sản phẩm đã được xóa khỏi giỏ hàng do số lượng <= 0",
      });
    } else {
      await GioHangService.updateItemQuantity(itemId, so_luong);
      return res.send({ message: "Số lượng sản phẩm đã được cập nhật" });
    }
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Có lỗi xảy ra khi cập nhật giỏ hàng"));
  }
};

// Xóa sản phẩm khỏi giỏ
exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const deleted = await GioHangService.removeItem(itemId);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy sản phẩm trong giỏ hàng"));
    }
    return res.send({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
  } catch (error) {
    console.error(error);
    return next(
      new ApiError(500, "Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng")
    );
  }
};
