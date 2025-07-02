import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

const API_URL_IMAGE = "http://localhost:3000/uploads/food";

const UserProduct = () => {
  const [cart, setCart] = useState([]);
  const { table_number } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    const validCart = Array.isArray(storedCart.items) ? storedCart.items : [];

    // ตรวจสอบว่า item มี quantity ถ้าไม่มีให้ใส่ 1
    const updatedCart = validCart.map(item => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    setCart(updatedCart);

    if (!/^\d+$/.test(table_number)) {
      alert("❌ เลขโต๊ะไม่ถูกต้อง");
      return navigate("/404");
    }

    axios
      .get(`http://localhost:3000/api/user/check-table/${table_number}`)
      .then((res) => console.log("✅ โต๊ะมีอยู่:", res.data))
      .catch((err) => {
        console.error("❌ ไม่พบโต๊ะ:", err);
        alert("❌ ไม่พบโต๊ะนี้ในระบบ");
        navigate("/404");
      });
  }, [table_number, navigate]);

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map(item =>
      item.cartItemId === cartItemId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify({ table_number, items: updatedCart }));

  };

  const handleRemoveItem = (cartItemIdToDelete) => {
    const updatedItems = cart.filter(item => item.cartItemId !== cartItemIdToDelete);
    localStorage.setItem("cart", JSON.stringify({ items: updatedItems }));
    setCart(updatedItems);
    alert("ยกเลิกรายการเรียบร้อยแล้ว");
  };

  const handleCancelAll = () => {
    if (window.confirm("คุณแน่ใจว่าต้องการยกเลิกคำสั่งซื้อทั้งหมด?")) {
      localStorage.removeItem("cart");
      setCart([]);
      alert("ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว");
    }
  };

  const handleSubmitOrder = async () => {
    if (!cart.length) {
      alert("❌ ไม่มีรายการอาหารในคำสั่งซื้อ");
      return;
    }

const orderData = {
  table_number,
  items: cart.map((item) => ({
    menu_id: item.id,
    quantity: item.quantity,
    price: parseFloat(item.price), // ส่งราคาต่อชิ้น ไม่ต้องคูณจำนวนที่สั่ง
    note: item.note,
    specialRequest: item.specialRequest,
  })),
};

    try {
      const res = await axios.post("http://localhost:3000/api/user/order", orderData);
      console.log("✅ คำสั่งซื้อสำเร็จ:", res.data);
      alert("✅ คำสั่งซื้อสำเร็จ!");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      console.error("❌ ส่งคำสั่งซื้อไม่สำเร็จ:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ");
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar tableNumber={table_number} />

      <div className="container mx-auto px-4 py-8 pt-18">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-900 via-black/90 to-orange-800 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">รายการรอคําสั่งซื้อ</h1>
            <p className="text-orange-100">โต๊ะที่ {table_number}</p>
          </div>

          {/* รายการสินค้า */}
          <div className="p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-lg">
                ยังไม่มีสินค้าในคําสั่งซื้อ
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={item.cartItemId || index}
                    className="border-b border-orange-100 pb-4 last:border-0"
                  >
                    <div className="flex flex-col md:flex-row gap-4 p-4 border border-orange-100 rounded-lg bg-white shadow-sm">
                      <div className="w-full md:w-1/3">
                        <img
                          src={`${API_URL_IMAGE}/${item.image}`}
                          alt={item.name || "image"}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-orange-800 mb-2">{item.name}</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-500">รหัสเมนู:</div>
                            <div>{item.id}</div>
                            <div className="text-gray-500">รหัสตะกร้า:</div>
                            <div>{item.cartItemId}</div>
                            <div className="text-gray-500">รายละเอียดเพิ่มเติมจานอาหาร :</div>
                            <div>{item.note || "ไม่มี"}</div>
                            <div className="text-gray-500">คำสั่งพิเศษ :</div>
                            <div>{item.specialRequest || "ไม่มี"}</div>
                            <div className="text-gray-500">จำนวน :</div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="px-2 py-1 bg-orange-200 rounded hover:bg-orange-300"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="text-lg">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="px-2 py-1 bg-orange-200 rounded hover:bg-orange-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <p className="text-2xl font-bold text-orange-600 mb-2">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} บาท
                          </p>
                          <button
                            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
                            onClick={() => {
                              if (window.confirm(`ต้องการลบเมนู "${item.name}" หรือไม่?`)) {
                                handleRemoveItem(item.cartItemId);
                              }
                            }}
                          >
                            🗑 ยกเลิกรายการ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-orange-50 px-6 py-4 border-t border-orange-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-orange-800">ราคารวม :</h3>
              <p className="text-2xl font-bold text-orange-600">
                {totalPrice.toFixed(2)} บาท
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                onClick={handleSubmitOrder}
              >
                ยืนยันการสั่งซื้อ
              </button>
              <button
                className="flex-1 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 px-4 rounded-lg transition-colors"
                onClick={handleCancelAll}
              >
                ยกเลิกคําสั่งซื้อทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProduct;
