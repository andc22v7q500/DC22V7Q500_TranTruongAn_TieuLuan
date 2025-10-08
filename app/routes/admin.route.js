// app/routes/admin.route.js
const express = require("express");
const donhang = require("../controllers/don-hang.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// Áp dụng bảo vệ cho tất cả các route của admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Routes cho quản lý đơn hàng
router.route("/don-hang").get(donhang.findAllOrders);

router.route("/don-hang/:id/trang-thai").put(donhang.updateOrderStatus);

// (Sau này thêm các route quản lý người dùng, sản phẩm... vào đây)

module.exports = router;
