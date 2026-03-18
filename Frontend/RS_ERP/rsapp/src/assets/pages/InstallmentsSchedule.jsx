import React, { useState } from 'react';
// تأكدي من عمل import للأيقونات دي:
import { CalendarDays, DollarSign, User, Building, Printer, Trash2, Save, FileSpreadsheet, CreditCard } from 'lucide-react';
import '../css/InstallmentsSchedule.css';

const InstallmentsSchedule = () => {
    // بيانات وهمية لـ 3 سنوات (36 قسط)
    const data = {
        client: "م/ أحمد مصطفى كامل",
        project: "أبراج فيو العاصمة",
        unit: "شقة الدور 15",
        total: 2000000,
        paid: 50000, // العربون
        dueNow: 450000, // المقدم
        toInstall: 1500000
    };

    const [installments] = useState(Array.from({ length: 36 }, (_, i) => ({
        id: i + 1,
        date: `10/${(i + 4) % 12 + 1}/2026`,
        amount: 41666,
    })));

    return (
        <div className="mini_ins_wrapper">
            <div className="mini_ins_container">
                
                {/* Header مدمج جداً */}
                <header className="mini_ins_header">
                    <div className="mini_ins_title_section">
                        <h1>جدولة الأقساط</h1>
                        <p>الوحدة: <mark>{data.unit}</mark> - مشروع <mark>{data.project}</mark></p>
                    </div>
                    <div className="mini_ins_actions">
                        <button className="mini_btn secundary"><Printer size={16} /> طباعة</button>
                        <button className="mini_btn secundary"><FileSpreadsheet size={16} /> Excel</button>
                        <button className="mini_btn primary"><Save size={16} /> حفظ النهائي</button>
                    </div>
                </header>

                {/* كروت الملخص المالي (مدمجة ومريحة للعين) */}
                <div className="mini_ins_summary_strip">
                    <div className="mini_stat_card blue">
                        <User className="card_icon" />
                        <div>
                            <span>العميل</span>
                            <strong>{data.client}</strong>
                        </div>
                    </div>
                    <div className="mini_stat_card green">
                        <DollarSign className="card_icon" />
                        <div>
                            <span>إجمالي السعر</span>
                            <strong>{data.total.toLocaleString()} ج.م</strong>
                        </div>
                    </div>
                    <div className="mini_stat_card yellow">
                        <CreditCard className="card_icon" />
                        <div>
                            <span>العربون</span>
                            <strong>{data.paid.toLocaleString()} ج.م</strong>
                        </div>
                    </div>
                    <div className="mini_stat_card highlight">
                        <CalendarDays className="card_icon" />
                        <div>
                            <span>المقدم (25%)</span>
                            <strong>{data.dueNow.toLocaleString()} ج.م</strong>
                        </div>
                    </div>
                </div>

                {/* جدول الأقساط بـ Fixed Height و Scroll داخلي */}
                <div className="mini_table_section">
                    <div className="mini_table_header">
                        <h2>توزيع الأقساط ({installments.length} شهر)</h2>
                        <button className="mini_text_btn red"><Trash2 size={15} /> مسح الجدول</button>
                    </div>

                    <div className="mini_table_box">
                        <div className="mini_thead sticky_th">
                            <div className="ins_th">#</div>
                            <div className="ins_th">تاريخ الاستحقاق</div>
                            <div className="ins_th">قيمة القسط</div>
                            <div className="ins_th">الحالة</div>
                        </div>

                        <div className="mini_tbody scrollable_body">
                            {/* صف المقدم دايماً في الأول */}
                            <div className="mini_trow hero">
                                <div className="ins_td bold primary">--</div>
                                <div className="ins_td">عند التعاقد</div>
                                <div className="ins_td bold primary">{data.dueNow.toLocaleString()} ج.م</div>
                                <div className="ins_td"><span className="mini_badge dp">تعاقد</span></div>
                            </div>

                            {/* قائمة الأقساط الطويلة */}
                            {installments.map(item => (
                                <div className="mini_trow" key={item.id}>
                                    <div className="ins_td muted">{String(item.id).padStart(2, '0')}</div>
                                    <div className="ins_td">{item.date}</div>
                                    <div className="ins_td bold">{item.amount.toLocaleString()} ج.م</div>
                                    <div className="ins_td"><span className="mini_badge gray">مجدول</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* فوتر بسيط للجدول يوضح المتبقي */}
                    <footer className="mini_table_footer">
                        <span>إجمالي المتبقي للتقسيط</span>
                        <strong>{data.toInstall.toLocaleString()} ج.م</strong>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default InstallmentsSchedule;