// const express = require('express');
// const cors = require('cors');
// const db = require('./config/db');
// const path = require("path");

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // อนุญาตให้ frontend เข้าถึง
// app.use(cors({
//   origin: 'http://localhost:5173', // หรือใช้ * เพื่ออนุญาตทุก origin (เฉพาะ dev)
//   credentials: true
// }));


// // ✅ Serve static files (รูปภาพ)
// app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// // สำหรับ Login
// const login = require('./routes/auth/auth')
// app.use("/api", login);       // /api/login

// // สำหรับ owner
// const manageCategory = require('./routes/owner/manageCategory');
// app.use('/api/owner/menu-types', manageCategory);

// const manageMenu = require('./routes/owner/manageMenu');
// app.use('/api/owner/menu', manageMenu);

// const manageTables = require('./routes/owner/manageTables');
// app.use('/api/owner/tables', manageTables);

// const manageStaff = require('./routes/owner/manageStaff')
// app.use("/api/owner/staff", manageStaff); // /api/staff (owner only)

// const manageOrders = require('./routes/owner/manageOrder')
// app.use("/api/owner/orders",manageOrders)


// // USER
// const userHome = require('./routes/user/userHome');
// app.use('/api/user/home', userHome);

// const userOrder = require('./routes/user/userOrder')
// app.use('/api/user/order',userOrder);

// const checkTableRoute = require('./routes/user/checkTable');
// app.use('/api/user/check-table', checkTableRoute);


// module.exports = app; // <-- export app ไปใช้ใน server.js
// app.listen(3000, ()=>{
//     console.log('server running at http://localhost:3000')
// })


// app.js หรือ server.js ก็ได้
const express = require('express');
const cors = require('cors');
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const db = require('./config/db');

const app = express();
const server = http.createServer(app); // ✅ แทน app.listen
const { getTodayCount } = require('./routes/owner/getTodayCount'); // เปลี่ยน path ตามจริง
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ผูก io เข้า express เพื่อใช้ใน req.app.get("io")
app.set("io", io);

// เชื่อมต่อ Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  getTodayCount()
    .then(count => {
      socket.emit("orderCountUpdated", { count });
    })
    .catch(err => {
      console.error("❌ ดึงจำนวนออเดอร์วันนี้ล้มเหลว:", err);
    });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Middleware พื้นฐาน
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// ✅ Serve static files
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Routes
const login = require('./routes/auth/auth');
app.use("/api", login);

const manageCategory = require('./routes/owner/manageCategory');
app.use('/api/owner/menu-types', manageCategory);

const manageMenu = require('./routes/owner/manageMenu');
app.use('/api/owner/menu', manageMenu);

const manageTables = require('./routes/owner/manageTables');
app.use('/api/owner/tables', manageTables);

const manageStaff = require('./routes/owner/manageStaff');
app.use("/api/owner/staff", manageStaff);

const manageOrders = require('./routes/owner/manageOrder');
app.use("/api/owner/orders", manageOrders);

const userHome = require('./routes/user/userHome');
app.use('/api/user/home', userHome);

const userOrder = require('./routes/user/userOrder');
app.use('/api/user/order', userOrder);

const checkTableRoute = require('./routes/user/checkTable');
app.use('/api/user/check-table', checkTableRoute);

// ✅ เริ่ม Server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server with WebSocket running at http://localhost:${PORT}`);
});
