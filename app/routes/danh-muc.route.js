// app/routes/danhmuc.route.js

const express = require("express");
const danhmuc = require("../controllers/danh-muc.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router
  .route("/")
  .get(danhmuc.findAll) // GET để công khai cho mọi người xem
  .post([authMiddleware, adminMiddleware], danhmuc.create); // POST chỉ cho Admin

router
  .route("/:id")
  .get(danhmuc.findOne) // GET để công khai
  .put([authMiddleware, adminMiddleware], danhmuc.update)
  .delete([authMiddleware, adminMiddleware], danhmuc.delete);

module.exports = router;
