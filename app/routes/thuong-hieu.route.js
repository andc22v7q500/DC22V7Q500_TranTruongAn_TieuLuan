const express = require("express");
const thuonghieu = require("../controllers/thuong-hieu.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const router = express.Router();

router
  .route("/")
  .get(thuonghieu.findAll)
  .post([authMiddleware, adminMiddleware], thuonghieu.create);

router
  .route("/:id")
  .get(thuonghieu.findOne)
  .put([authMiddleware, adminMiddleware], thuonghieu.update)
  .delete([authMiddleware, adminMiddleware], thuonghieu.delete);

module.exports = router;
