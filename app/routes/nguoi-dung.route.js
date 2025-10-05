// app/routes/nguoi-dung.route.js
const express = require("express");
const nguoidung = require("../controllers/nguoi-dung.controller");

const router = express.Router();

// Định nghĩa các route cho xác thực
router.post("/signup", nguoidung.signUp);
router.post("/signin", nguoidung.signIn);

// (Sau này có thể thêm các route CRUD cho admin ở đây, ví dụ: router.get("/", ...))

module.exports = router;
