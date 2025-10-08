// app/routes/danh-gia.route.js
const express = require("express");
const danhgia = require("../controllers/danh-gia.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router({ mergeParams: true }); // Bật mergeParams để nhận productId

router
  .route("/")
  .get(danhgia.findAll) // API công khai, ai cũng xem được
  .post(authMiddleware, danhgia.create); // API cần đăng nhập để tạo

module.exports = router;
