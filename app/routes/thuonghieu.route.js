const express = require("express");
const thuonghieu = require("../controllers/thuonghieu.controller");

const router = express.Router();

router.route("/").get(thuonghieu.findAll).post(thuonghieu.create);

router
  .route("/:id")
  .get(thuonghieu.findOne)
  .put(thuonghieu.update)
  .delete(thuonghieu.delete);

module.exports = router;
