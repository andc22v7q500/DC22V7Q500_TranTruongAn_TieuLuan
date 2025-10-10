// app/routes/admin.route.js
const express = require("express");
const donhang = require("../controllers/don-hang.controller");
const nguoidung = require("../controllers/nguoi-dung.controller");
const danhgia = require("../controllers/danh-gia.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// Áp dụng bảo vệ cho tất cả các route của admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Routes cho quản lý đơn hàng
router.route("/don-hang").get(donhang.findAllOrders);

router.route("/don-hang/:id/trang-thai").put(donhang.updateOrderStatus);

router.route("/nguoi-dung").get(nguoidung.findAll);

router
  .route("/nguoi-dung/:id")
  .get(nguoidung.findOne) // Lấy chi tiết một người dùng
  .put(nguoidung.update) // Cập nhật thông tin/vai trò của người dùng
  .delete(nguoidung.delete);

router.route("/danh-gia").get(danhgia.findAllForAdmin);

router.route("/danh-gia/:id").delete(danhgia.deleteForAdmin);

module.exports = router;
