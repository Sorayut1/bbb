import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, DollarSign, Package, Filter, Search, Eye, Printer, Download, ChevronDown, Receipt } from "lucide-react";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Filter states
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "all",
        searchTerm: ""
    });

    // Mock data - ในการใช้งานจริงจะเรียกจาก API
    const mockOrders = [
        {
            order_id: 1,
            order_number: "ORD001",
            table_number: "T001",
            customer_name: "คุณสมชาย",
            total_amount: 850.00,
            status: "completed",
            created_at: "2024-12-30T14:30:00",
            items: [
                { name: "ผัดไทยกุ้งสด", quantity: 2, price: 180 },
                { name: "ต้มยำกุ้ง", quantity: 1, price: 220 },
                { name: "ข้าวผัดปู", quantity: 1, price: 250 }
            ]
        },
        {
            order_id: 2,
            order_number: "ORD002",
            table_number: "T003",
            customer_name: "คุณมาลี",
            total_amount: 450.00,
            status: "completed",
            created_at: "2024-12-30T15:45:00",
            items: [
                { name: "แกงเขียวหวานไก่", quantity: 1, price: 180 },
                { name: "ข้าวเปล่า", quantity: 2, price: 20 }
            ]
        },
        {
            order_id: 3,
            order_number: "ORD003",
            table_number: "T005",
            customer_name: "คุณประยุทธ",
            total_amount: 1250.00,
            status: "cancelled",
            created_at: "2024-12-29T12:15:00",
            items: [
                { name: "ปลาเผาเกลือ", quantity: 1, price: 450 },
                { name: "ผัดผักบุ้งไฟแดง", quantity: 2, price: 80 },
                { name: "ข้าวเปล่า", quantity: 4, price: 20 }
            ]
        },
        {
            order_id: 4,
            order_number: "ORD004",
            table_number: "T002",
            customer_name: "คุณสุดา",
            total_amount: 680.00,
            status: "completed",
            created_at: "2024-12-28T18:20:00",
            items: [
                { name: "ส้มตำไทย", quantity: 1, price: 120 },
                { name: "ไก่ย่าง", quantity: 1, price: 280 },
                { name: "ข้าวเหนียว", quantity: 2, price: 30 }
            ]
        },
        {
            order_id: 5,
            order_number: "ORD005",
            table_number: "VIP01",
            customer_name: "คุณวิทยา",
            total_amount: 2150.00,
            status: "completed",
            created_at: "2024-12-27T19:30:00",
            items: [
                { name: "ปูผัดผงกะหรี่", quantity: 1, price: 680 },
                { name: "กุ้งแช่น้ำปลา", quantity: 1, price: 450 },
                { name: "ยำวุ้นเส้น", quantity: 1, price: 150 }
            ]
        }
    ];

    useEffect(() => {
        // Simulate API call
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "completed":
                return "สำเร็จ";
            case "cancelled":
                return "ยกเลิก";
            case "pending":
                return "รอดำเนินการ";
            default:
                return "ไม่ระบุ";
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        // Filter by date range
        if (filters.startDate) {
            filtered = filtered.filter(order => 
                new Date(order.created_at) >= new Date(filters.startDate)
            );
        }
        if (filters.endDate) {
            filtered = filtered.filter(order => 
                new Date(order.created_at) <= new Date(filters.endDate + "T23:59:59")
            );
        }

        // Filter by status
        if (filters.status !== "all") {
            filtered = filtered.filter(order => order.status === filters.status);
        }

        // Filter by search term
        if (filters.searchTerm) {
            filtered = filtered.filter(order => 
                order.order_number.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                order.customer_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                order.table_number.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
        setShowFilterModal(false);
    };

    const resetFilters = () => {
        setFilters({
            startDate: "",
            endDate: "",
            status: "all",
            searchTerm: ""
        });
        setFilteredOrders(orders);
    };

    const getTotalStats = () => {
        const completed = filteredOrders.filter(order => order.status === "completed");
        const totalRevenue = completed.reduce((sum, order) => sum + order.total_amount, 0);
        return {
            totalOrders: filteredOrders.length,
            completedOrders: completed.length,
            totalRevenue: totalRevenue
        };
    };

    const stats = getTotalStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl mb-6 p-6 border-l-4 border-orange-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                ประวัติคำสั่งซื้อ
                            </h1>
                            <p className="text-gray-600">ดูประวัติและจัดการคำสั่งซื้อทั้งหมด</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilterModal(true)}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                            >
                                <Filter size={20} />
                                กรองข้อมูล
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Search */}
                <div className="bg-white rounded-2xl shadow-xl mb-6 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="ค้นหาด้วยหมายเลขคำสั่ง, ชื่อลูกค้า, หรือโต๊ะ..."
                                    value={filters.searchTerm}
                                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                                    onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                        <button
                            onClick={applyFilters}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                        >
                            ค้นหา
                        </button>
                    </div>
                </div>

                {/* Filter Modal */}
                {showFilterModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">กรองข้อมูล</h2>
                                    <button
                                        onClick={() => setShowFilterModal(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            วันที่เริ่มต้น
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            วันที่สิ้นสุด
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        สถานะคำสั่งซื้อ
                                    </label>
                                    <select
                                        value={filters.status}
                                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    >
                                        <option value="all">ทั้งหมด</option>
                                        <option value="completed">สำเร็จ</option>
                                        <option value="cancelled">ยกเลิก</option>
                                        <option value="pending">รอดำเนินการ</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                                    >
                                        ค้นหา
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                                    >
                                        รีเซ็ต
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Detail Modal */}
                {showOrderDetail && selectedOrder && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-800">รายละเอียดคำสั่งซื้อ</h2>
                                    <button
                                        onClick={() => setShowOrderDetail(false)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">หมายเลขคำสั่ง</p>
                                        <p className="font-bold text-lg">{selectedOrder.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">โต๊ะ</p>
                                        <p className="font-bold text-lg">{selectedOrder.table_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">ชื่อลูกค้า</p>
                                        <p className="font-bold text-lg">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">สถานะ</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusText(selectedOrder.status)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-4">รายการอาหาร</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-gray-600">จำนวน: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold">฿{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span>ยอดรวม</span>
                                        <span className="text-orange-600">฿{selectedOrder.total_amount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                        <Printer size={18} />
                                        พิมพ์ใบเสร็จ
                                    </button>
                                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                                        <Download size={18} />
                                        ดาวน์โหลด
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">คำสั่งซื้อทั้งหมด</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-xl">
                                <Receipt size={24} className="text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">คำสั่งสำเร็จ</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.completedOrders}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <Package size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">ยอดขายรวม</p>
                                <p className="text-3xl font-bold text-gray-800">฿{stats.totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <DollarSign size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600">
                        <h2 className="text-xl font-bold text-white">
                            รายการคำสั่งซื้อ ({filteredOrders.length} รายการ)
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-orange-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        หมายเลขคำสั่ง
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        ลูกค้า / โต๊ะ
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        ยอดรวม
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        สถานะ
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                        วันที่/เวลา
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                        จัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order, index) => (
                                    <tr
                                        key={order.order_id}
                                        className={`hover:bg-orange-50 transition-colors ${
                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                                                    <Receipt size={20} className="text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg text-gray-800">
                                                        {order.order_number}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ID: {order.order_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-800">{order.customer_name}</p>
                                                <p className="text-sm text-gray-600">โต๊ะ {order.table_number}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-lg text-orange-600">
                                                ฿{order.total_amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(order.created_at).toLocaleString('th-TH', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowOrderDetail(true);
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors shadow-md transform hover:scale-105"
                                                    title="ดูรายละเอียด"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors shadow-md transform hover:scale-105"
                                                    title="พิมพ์ใบเสร็จ"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-gray-500 text-lg">ไม่พบข้อมูลคำสั่งซื้อ</p>
                            <p className="text-gray-400">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;