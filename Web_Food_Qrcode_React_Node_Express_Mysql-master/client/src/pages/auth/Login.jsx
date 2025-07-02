import React, { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ดึง loading, error, setLoading, setError จาก store มาใช้
  const { login, isLoggedIn, user, loading, error, setLoading, setError } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && user) {
      console.log("🔐 Logged in as:", user?.username);
      if (user.role === "owner") {
        navigate("/");
      } else if (user.role === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const API_LOGIN = "http://localhost:3000/api/login";

 const handleSubmit = async (e) => {
  e.preventDefault();

  const setLoading = useAuthStore.getState().setLoading;
  const setError = useAuthStore.getState().setError;
  const login = useAuthStore.getState().login;

  setLoading(true);
  setError(null);

  try {
    const res = await axios.post(API_LOGIN, {
      username: formData.username,
      password: formData.password,
    });

    const { token, user } = res.data;

    login(user, token); // ✅ เรียกฟังก์ชัน login ได้ตรง ๆ

    alert("เข้าสู่ระบบสำเร็จ!");
    setFormData({ username: "", password: "" });
  } catch (err) {
    const message = err.response?.data?.message || err.message || "Login failed";
    setError(message);
    alert("เกิดข้อผิดพลาด: " + message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="text-3xl">🍽️</div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบ</h1>
            <p className="text-orange-100">ยินดีต้อนรับกลับมา!</p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อผู้ใช้งาน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-orange-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="กรอกชื่อผู้ใช้งาน"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-orange-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-400"
                    placeholder="กรอกรหัสผ่าน"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    กำลังดำเนินการ...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    เข้าสู่ระบบ
                  </>
                )}
              </button>
            </form>

            {/* แสดง error message จาก store */}
            {error && (
              <p className="mt-4 text-center text-red-500 font-semibold">
                {error}
              </p>
            )}

            <div className="text-center mt-4">
              <button className="text-orange-600 hover:text-orange-700 text-sm font-medium transition-colors">
                ลืมรหัสผ่าน?
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">ร้านอาหารดีๆ สำหรับทุกคน</p>
          <p className="text-gray-500 text-xs mt-1">
            © 2025 Restaurant Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
