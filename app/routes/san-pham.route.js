const express = require("express");
const sanpham = require("../controllers/san-pham.controller");
const bienthe = require("../controllers/bien-the-san-pham.controller");
const danhGiaRouter = require("./danh-gia.route");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

// Các route công khai cho khách hàng xem
router.route("/").get(sanpham.findAll);
router.route("/:id").get(sanpham.findOne);

// Các route yêu cầu quyền Admin
router.route("/").post([authMiddleware, adminMiddleware], sanpham.create);

router
  .route("/:id")
  .put([authMiddleware, adminMiddleware], sanpham.update)
  .delete([authMiddleware, adminMiddleware], sanpham.delete);

// Các route cho biến thể của sản phẩm (cũng cần quyền Admin)
router
  .route("/:productId/bien-the")
  .post([authMiddleware, adminMiddleware], bienthe.create);

router
  .route("/bien-the/:id")
  .put([authMiddleware, adminMiddleware], bienthe.update)
  .delete([authMiddleware, adminMiddleware], bienthe.delete);

router.use("/:productId/danh-gia", danhGiaRouter);

module.exports = router;
