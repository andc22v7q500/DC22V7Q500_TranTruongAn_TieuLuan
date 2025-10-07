// app/routes/gio-hang.route.js
const express = require("express");
const giohang = require("../controllers/gio-hang.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Áp dụng middleware xác thực cho tất cả các route trong file này
router.use(authMiddleware);

router.route("/").get(giohang.getCart).post(giohang.addItemToCart);

// :itemId là id của dòng trong bảng chi_tiet_gio_hang
router
  .route("/items/:itemId")
  .put(giohang.updateCartItem)
  .delete(giohang.removeCartItem);

module.exports = router;
