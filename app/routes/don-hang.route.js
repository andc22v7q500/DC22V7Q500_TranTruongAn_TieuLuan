const express = require("express");
const donhang = require("../controllers/don-hang.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware); // Tất cả API đơn hàng đều cần đăng nhập

router.route("/").post(donhang.create);

// (Sau này thêm GET để lấy lịch sử đơn hàng)

module.exports = router;
