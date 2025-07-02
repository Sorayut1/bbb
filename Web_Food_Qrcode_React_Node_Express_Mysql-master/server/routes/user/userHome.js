const express = require("express");
const router = express.Router();
const db = require("../../config/db"); // ปรับ path ให้ตรงกับของคุณ

// ดึงประเภทเมนูทั้งหมด
// router.get("/categories", (req, res) => {
//   const sql = "SELECT * FROM menu_type";
//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Query error:", err);
//       return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทเมนู" });
//     }
//     res.json(results);
//   });
// });

// // ดึงเมนูตามประเภท (0 = ทั้งหมด)
// router.get("/products/:menuTypeId", (req, res) => {
//   const menuTypeId = req.params.menuTypeId;

//   let sql = `
//     SELECT menu.*, menu_type.type_name AS category_name
//     FROM menu 
//     INNER JOIN menu_type ON menu.menu_type_id  = menu_type.menu_type_id 
//   `;

//   if (menuTypeId !== "0") {
//     sql += " WHERE menu.menu_type_id = ?";
//   }

//   db.query(sql, menuTypeId !== "0" ? [menuTypeId] : [], (err, results) => {
//     if (err) {
//       console.error("Query error:", err);
//       return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
//     }
//     res.json(results);
//   });
// });
router.get("/categories", (req, res) => {
  const sql = "SELECT * FROM menu_type ORDER BY type_name ASC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Query error in /categories:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทเมนู" });
    }
    res.json(results);
  });
});

router.get("/products/:menuTypeId", (req, res) => {
  const menuTypeId = parseInt(req.params.menuTypeId, 10);

  let sql = `
    SELECT menu.*, menu_type.type_name AS category_name
    FROM menu 
    INNER JOIN menu_type ON menu.menu_type_id = menu_type.menu_type_id
  `;

  const values = [];
  if (menuTypeId !== 0) {
    sql += " WHERE menu.menu_type_id = ?";
    values.push(menuTypeId);
  }

  sql += " ORDER BY menu.menu_name ASC";

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Query error in /products/:menuTypeId:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
    }
    res.json(results);
  });
});

// router.get("/products/:menuTypeId", (req, res) => {
//   const menuTypeId = parseInt(req.params.menuTypeId, 10);
//   const tableNumber = req.query.table || "ไม่ระบุ";

//   let sql = `
//     SELECT 
//       menu.menu_id, 
//       menu.menu_name, 
//       menu.price, 
//       menu_type.type_name AS category_name 
//     FROM menu 
//     INNER JOIN menu_type ON menu.menu_type_id = menu_type.menu_type_id
//   `;

//   const values = [];
//   if (menuTypeId !== 0) {
//     sql += " WHERE menu.menu_type_id = ?";
//     values.push(menuTypeId);
//   }

//   sql += " ORDER BY menu.menu_name ASC";

//   db.query(sql, values, (err, results) => {
//     if (err) {
//       console.error("❌ Query error in /products/:menuTypeId:", err);
//       return res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
//     }

//     console.log(`📦 เรียกดูเมนูสำหรับเลขโต๊ะ: ${tableNumber}`);
//     console.table(results.map(item => ({
//       ID: item.menu_id,
//       เมนู: item.menu_name,
//       หมวด: item.category_name,
//       ราคา: item.price
//     })));

//     res.json(results);
//   });
// });


module.exports = router;