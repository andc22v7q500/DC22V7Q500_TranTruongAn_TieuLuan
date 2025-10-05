// app/routes/danhmuc.route.js

const express = require("express");
const danhmuc = require("../controllers/danhmuc.controller");

const router = express.Router();

router.route("/").get(danhmuc.findAll).post(danhmuc.create);

router
  .route("/:id")
  .get(danhmuc.findOne)
  .put(danhmuc.update)
  .delete(danhmuc.delete);

module.exports = router;
