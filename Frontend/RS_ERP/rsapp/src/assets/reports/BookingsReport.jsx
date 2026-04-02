import React from 'react';
import './BookingsReport.css';
import { variables } from '../variables';
import { Printer } from 'lucide-react';

const BookingsReport = React.forwardRef(({ client, installments}, ref) => {
    if (!client) return null;
    const summarizedInstallments = installments?.slice(0, 5) || [];
    return (
        <div className="report-view-container">
         
            <div ref={ref} className="print-only-report">
                <div className="report-header">
                    <div>
                        <h1>شركة العقارات للتطوير</h1>
                        <p style={{fontWeight: 700}}>سجل الحجوزات الرسمي</p>
                    </div>
                    <div style={{textAlign: 'left'}}>
                        <p>كود الحجز: <strong>{client.BookingID}</strong></p>
                        <p>التاريخ: <strong>{new Date().toLocaleDateString('ar-EG')}</strong></p>
                    </div>
                </div>

                <div className="data-grid">
                    <div className="info-section">
                        <div className="info-item"><label>اسم العميل</label><span>{client.ClientName}</span></div>
                        <div className="info-item"><label>الرقم القومي</label><span>{client.NationalID || "---"}</span></div>
                        <div className="info-item"><label>المشروع</label><span>{client.ProjectName}</span></div>
                        <div className="info-item"><label>رقم الوحدة</label><span>{client.unitName}</span></div>
                        <div className="info-item"><label>إجمالي السعر</label><span>{client.NegotiationPrice?.toLocaleString()} ج.م</span></div>
                        <div className="info-item"><label>المقدم المدفوع</label><span>{client.ReservationAmount?.toLocaleString()} ج.م</span></div>
                    </div>
                    
                    <div className="id-card-placeholder">
                        {client.NationalIdImagePath ? (
                            <img src={variables.NATIONAL_ID_IMAGES_URL + client.NationalIdImagePath} alt="ID Card" />
                        ) : (
                            <p>لا يوجد صورة بطاقة </p>
                        )}
                    </div>
                </div>

                <h3 style={{fontWeight: 900, borderRight: '5px solid #000', paddingRight: '10px'}}>ملخص جدولة الأقساط</h3>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>رقم القسط</th>
                            <th>قيمة القسط</th>
                            <th>تاريخ الاستحقاق</th>
                            <th>ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summarizedInstallments.map((inst, index) => (
                            <tr key={index}>
                                <td>قسط رقم {index + 1}</td>
                                <td>{inst.MonthlyAmount?.toLocaleString()} ج.م</td>
                                <td>{inst.DueDate.split('T')[0]}</td>
                                <td>{inst.Paid ? "تم السداد" : "انتظار"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="report-footer">
                    <div className="sig-box"><p>توقيع الطرف الأول (الشركة)</p><div className="line"></div></div>
                    <div className="sig-box"><p>توقيع الطرف الثاني (العميل)</p><div className="line"></div></div>
                </div>
            </div>

            <button className="print-action-button" onClick={()=>window.print()}>
                <Printer size={20} />
                تأكيد وطباعة التقرير
            </button>
        </div>
    );
});

export default BookingsReport;