const express = require("express");
const donhang = require("../controllers/don-hang.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware); // Tất cả API đơn hàng đều cần đăng nhập

router.route("/").get(donhang.findAllForUser).post(donhang.create);

router.route("/:id").get(donhang.findOneForUser);

module.exports = router;
