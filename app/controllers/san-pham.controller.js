// app/controllers/san-pham.controller.js

const SanPhamService = require("../services/san-pham.service");
const ApiError = require("../api-error");

// Tạo mới sản phẩm
exports.create = async (req, res, next) => {
  // Validate dữ liệu đầu vào cơ bản
  if (
    !req.body?.ten_san_pham ||
    !req.body?.ma_danh_muc ||
    !req.body?.ma_thuong_hieu
  ) {
    return next(
      new ApiError(
        400,
        "Tên sản phẩm, mã danh mục và mã thương hiệu là bắt buộc"
      )
    );
  }
  try {
    const document = await SanPhamService.create(req.body);
    return res.send(document);
  } catch (error) {
    console.error("ERROR in create product:", error);
    return next(new ApiError(500, "Có lỗi xảy ra khi tạo sản phẩm"));
  }
};

// Lấy tất cả sản phẩm
exports.findAll = async (req, res, next) => {
  try {
    const documents = await SanPhamService.findAll();
    return res.send(documents);
  } catch (error) {
    console.error("ERROR in findAll product:", error);
    return next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách sản phẩm"));
  }
};

// Lấy chi tiết một sản phẩm
exports.findOne = async (req, res, next) => {
  try {
    const document = await SanPhamService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sản phẩm"));
    }
    return res.send(document);
  } catch (error) {
    console.error("ERROR in findOne product:", error);
    return next(
      new ApiError(500, `Lỗi khi lấy sản phẩm với id=${req.params.id}`)
    );
  }
};

// Cập nhật sản phẩm
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }
  try {
    const document = await SanPhamService.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy sản phẩm"));
    }
    return res.send({ message: "Sản phẩm đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật sản phẩm với id=${req.params.id}`)
    );
  }
};

// Xóa sản phẩm
exports.delete = async (req, res, next) => {
  try {
    const deleted = await SanPhamService.delete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy danh mục"));
    }
    return res.send({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa danh mục với id=${req.params.id}`)
    );
  }
};
