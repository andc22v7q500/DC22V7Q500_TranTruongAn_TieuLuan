// app/routes/dia-chi.route.js
const express = require("express");
const diachi = require("../controllers/dia-chi.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Áp dụng middleware xác thực cho tất cả các route trong file này
router.use(authMiddleware);

router.route("/").get(diachi.findAllForUser).post(diachi.create);

// :id là id của dòng trong bảng dia_chi
router.route("/:id").put(diachi.update).delete(diachi.delete);

module.exports = router;
