const DiaChiService = require("../services/dia-chi.service");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const document = await DiaChiService.create(userId, req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tạo địa chỉ"));
  }
};

exports.findAllForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const documents = await DiaChiService.findAllByUserId(userId);
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách địa chỉ"));
  }
};

// luôn lấy userId từ req.user và id địa chỉ từ req.params.id)
exports.update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const updated = await DiaChiService.update(addressId, userId, req.body);
    if (!updated) {
      return next(
        new ApiError(404, "Không tìm thấy địa chỉ hoặc không có quyền")
      );
    }
    return res.send({ message: "Địa chỉ đã được cập nhật" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật địa chỉ"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const deleted = await DiaChiService.delete(addressId, userId);
    if (!deleted) {
      return next(
        new ApiError(404, "Không tìm thấy địa chỉ hoặc không có quyền")
      );
    }
    return res.send({ message: "Địa chỉ đã được xóa" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa địa chỉ"));
  }
};
