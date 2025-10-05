const express = require("express");
const sanpham = require("../controllers/san-pham.controller");
const bienthe = require("../controllers/bien-the-san-pham.controller");

const router = express.Router();

// Các route cho sản phẩm gốc
router.route("/").get(sanpham.findAll).post(sanpham.create);
router
  .route("/:id")
  .get(sanpham.findOne)
  .put(sanpham.update)
  .delete(sanpham.delete);

// Các route cho biến thể của sản phẩm
router
  .route("/:productId/bien-the") // :productId là id của sản phẩm gốc
  .post(bienthe.create);

// Các route để thao tác với một biến thể cụ thể (dựa vào id của chính nó)
router.route("/bien-the/:id").put(bienthe.update).delete(bienthe.delete);

module.exports = router;
