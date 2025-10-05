const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");

const app = express();
const danhMucRouter = require("./app/routes/danh-muc.route");
const thuongHieuRouter = require("./app/routes/thuong-hieu.route");
const sanPhamRouter = require("./app/routes/san-pham.route");

app.use(cors());
app.use(express.json());
app.use("/api/danh-muc", danhMucRouter);
app.use("/api/thuong-hieu", thuongHieuRouter);
app.use("/api/san-pham", sanPhamRouter);

app.get("/", (req, res) => {
  res.json({ message: "Tieu Luan Website ban hang Van phong pham" });
});

// handle 404 response
app.use((req, res, next) => {
  // Code ở đây sẽ chạy khi không có route được định nghĩa nào
  // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
  return next(new ApiError(404, "Resource not found"));
});

// define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
  // Middleware xử lý lỗi tập trung.
  // Trong các đoạn code xử lý ở các route, gọi next(error) sẽ chuyển về middleware xử lý lỗi này
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});
module.exports = app;
