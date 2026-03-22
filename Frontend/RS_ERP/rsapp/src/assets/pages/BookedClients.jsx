import React from 'react';
import { Users, User, Eye, Printer, Search, Calendar, Landmark } from 'lucide-react';
import '../css/BookedClients.css';

const BookedClients = ({ bookedData = [] }) => {
    // بيانات تجريبية للعرض فقط في حالة الـ Data فاضية
    const displayData = bookedData.length > 0 ? bookedData : [
        { ClientName: "أحمد محمد علي", ProjectName: "كمبوند الصفوة", Unit: "A-102", TotalPrice: "2,500,000", Date: "2026-03-22" },
        { ClientName: "سارة محمود حسن", ProjectName: "برج اللؤلؤة", Unit: "Floor 5 - U3", TotalPrice: "1,850,000", Date: "2026-03-20" }
    ];

    return (
        <div className="booked_list_wrapper">
            <div className="booked_list_header">
                <div className="booked_list_title_area">
                    <h2><Users size={28} /> سجل الحجوزات المكتملة</h2>
                    <p>عرض جميع العملاء الذين أتموا إجراءات الحجز وجدولة الأقساط</p>
                </div>
                <div className="booked_list_search_bar">
                    <Search size={20} />
                    <input type="text" placeholder="بحث عن عميل أو مشروع..." />
                </div>
            </div>

            <div className="booked_list_container">
                {displayData.map((client, index) => (
                    <div key={index} className="booked_list_card">
                        {/* الجزء الأول: بيانات العميل */}
                        <div className="booked_list_user_info">
                            <div className="booked_list_avatar">
                                <User size={22} />
                            </div>
                            <div className="booked_list_text">
                                <h3>{client.ClientName}</h3>
                                <span><Landmark size={14} /> {client.ProjectName} | وحدة: {client.Unit}</span>
                            </div>
                        </div>

                        {/* الجزء الثاني: السعر والتاريخ */}
                        <div className="booked_list_financial_info">
                            <div className="booked_list_stat">
                                <p className="booked_list_label">إجمالي سعر التعاقد</p>
                                <p className="booked_list_value">{client.TotalPrice} ج.م</p>
                            </div>
                            <div className="booked_list_stat">
                                <p className="booked_list_label">تاريخ الحجز</p>
                                <p className="booked_list_date"><Calendar size={14} /> {client.Date}</p>
                            </div>
                        </div>

                        {/* الجزء الثالث: الأزرار */}
                        <div className="booked_list_actions">
                            <button className="booked_list_btn view">
                                <Eye size={16} /> عرض التفاصيل
                            </button>
                            <button className="booked_list_btn print">
                                <Printer size={16} /> طباعة العقد
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookedClients;