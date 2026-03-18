import React, { useState } from 'react';
import { 
    CalendarDays, DollarSign, User, Printer, Trash2, 
    Save, FileSpreadsheet, CreditCard, Banknote, Image as ImageIcon, CheckCircle2 
} from 'lucide-react';
import '../css/InstallmentsSchedule.css';

const InstallmentsSchedule = () => {
    const data = {
        client: "م/ أحمد مصطفى كامل",
        project: "أبراج فيو العاصمة",
        unit: "شقة الدور 15",
        total: 2000000,
        paid: 50000,
        dueNow: 450000,
        toInstall: 1500000
    };

    // إدارة حالة الأقساط (مستحق / مدفوع)
    const [installments, setInstallments] = useState(
        Array.from({ length: 36 }, (_, i) => ({
            id: i + 1,
            date: `10/${(i + 4) % 12 + 1}/2026`,
            amount: 41666,
            status: "مستحق", // الحالة الابتدائية
            paymentMethod: null,
            checkImage: null
        }))
    );

    const [selectedInst, setSelectedInst] = useState(null); // القسط اللي بيتم دفعه حالياً
    const [showModal, setShowModal] = useState(false);

    // دالة لتحديث حالة القسط بعد الدفع
    const handlePay = (method, image = null) => {
        setInstallments(prev => prev.map(inst => 
            inst.id === selectedInst.id 
            ? { ...inst, status: "مدفوع", paymentMethod: method, checkImage: image } 
            : inst
        ));
        setShowModal(false);
    };

    return (
        <div className="mini_ins_wrapper">
            <div className="mini_ins_container">
                
                <header className="mini_ins_header">
                    <div className="mini_ins_title_section">
                        <h1>إدارة تحصيل الأقساط</h1>
                        <p>الوحدة: <mark>{data.unit}</mark> - مشروع <mark>{data.project}</mark></p>
                    </div>
                    <div className="mini_ins_actions">
                        <button className="mini_btn secundary"><Printer size={16} /> طباعة</button>
                        <button className="mini_btn primary"><Save size={16} /> حفظ التغييرات</button>
                    </div>
                </header>

                {/* كروت الملخص */}
                <div className="mini_ins_summary_strip">
                    <div className="mini_stat_card blue"><User className="card_icon" /><div><span>العميل</span><strong>{data.client}</strong></div></div>
                    <div className="mini_stat_card green"><DollarSign className="card_icon" /><div><span>الإجمالي</span><strong>{data.total.toLocaleString()} ج.م</strong></div></div>
                    <div className="mini_stat_card highlight"><CalendarDays className="card_icon" /><div><span>المقدم</span><strong>{data.dueNow.toLocaleString()} ج.م</strong></div></div>
                </div>

                <div className="mini_table_section">
                    <div className="mini_table_header">
                        <h2>جدول الدفعات (36 شهر)</h2>
                    </div>

                    <div className="mini_table_box">
                        <div className="mini_thead sticky_th">
                            <div className="ins_th">#</div>
                            <div className="ins_th">التاريخ</div>
                            <div className="ins_th">القيمة</div>
                            <div className="ins_th">الحالة</div>
                            <div className="ins_th">الإجراء</div>
                        </div>

                        <div className="mini_tbody scrollable_body">
                            {installments.map(item => (
                                <div className={`mini_trow ${item.status === 'مدفوع' ? 'paid_row' : ''}`} key={item.id}>
                                    <div className="ins_td muted">{String(item.id).padStart(2, '0')}</div>
                                    <div className="ins_td">{item.date}</div>
                                    <div className="ins_td bold">{item.amount.toLocaleString()} ج.م</div>
                                    <div className="ins_td">
                                        <span className={`mini_badge ${item.status === 'مدفوع' ? 'success' : 'warning'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="ins_td">
                                        {item.status === "مستحق" ? (
                                            <button className="pay_btn" onClick={() => { setSelectedInst(item); setShowModal(true); }}>
                                                <Banknote size={14} /> دفع
                                            </button>
                                        ) : (
                                            <span className="pay_info">{item.paymentMethod === 'شيك' ? '✅ شيك' : '✅ كاش'}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal الدفع */}
            {showModal && (
                <div className="modal_overlay">
                    <div className="payment_modal">
                        <h3>تسجيل دفع القسط رقم {selectedInst?.id}</h3>
                        <p>القيمة: {selectedInst?.amount.toLocaleString()} ج.م</p>
                        
                        <div className="modal_actions">
                            <button className="method_btn" onClick={() => handlePay('كاش')}>
                                <Banknote size={20} /> دفع كاش
                            </button>
                            
                            <label className="method_btn check">
                                <ImageIcon size={20} /> رفع صورة الشيك
                                <input type="file" hidden onChange={() => handlePay('شيك', 'dummy_url')} />
                            </label>
                        </div>
                        <button className="close_modal" onClick={() => setShowModal(false)}>إلغاء</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstallmentsSchedule;