const BienTheSanPhamService = require("../services/bien-the-san-pham.service");
const ApiError = require("../api-error");

// Tạo mới một biến thể cho sản phẩm có id là req.params.productId
exports.create = async (req, res, next) => {
  try {
    const document = await BienTheSanPhamService.create(
      req.params.productId,
      req.body
    );
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra khi tạo biến thể sản phẩm"));
  }
};

// Cập nhật một biến thể theo id của nó
exports.update = async (req, res, next) => {
  try {
    const document = await BienTheSanPhamService.update(
      req.params.id,
      req.body
    );
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy biến thể"));
    }
    return res.send({ message: "Biến thể đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật biến thể với id=${req.params.id}`)
    );
  }
};

// Xóa một biến thể theo id của nó
exports.delete = async (req, res, next) => {
  try {
    const deleted = await BienTheSanPhamService.delete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy biến thể"));
    }
    return res.send({ message: "Biến thể đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa biến thể với id=${req.params.id}`)
    );
  }
};
