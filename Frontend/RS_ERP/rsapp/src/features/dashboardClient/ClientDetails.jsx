import React, { useState } from 'react';
import './ClientDetails.css'; 
import { 
    ArrowRight, 
    User, 
    CreditCard, 
    ExternalLink, 
    Home, 
    Calendar, 
    Phone, 
    MapPin, 
    Hash, 
    Image as ImageIcon 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ClientDetails = () => {
    const {bookingData}=useSelector((state)=>state.clientsProfile);
    const navigate = useNavigate();
    const [openUnitIndex, setOpenUnitIndex] = useState(null);

  
    const mockBookedUnits = [
        {
            unitName: "شقة A-102",
            ProjectName: "كمبوند النخيل",
            BookingDate: "2026-01-15",
            installments: [
                { DueDate: "2026-04-01", Amount: 5000, IsPaid: true },
                { DueDate: "2026-05-01", Amount: 5000, IsPaid: false }
            ]
        }
    ];

    return (
        <div className="erp-container animate-fade">
            <div className="erp-header">
                <button className="btn-back" onClick={() => navigate('/clientpage')}>
                    <ArrowRight size={18} /> العودة للقائمة
                </button>
                <h3 className="section-title">ملف العميل الكامل</h3>
            </div>

          
            <div className="erp-card">
                <div className="card-header">
                    <User size={18} /> معلومات الهوية والوثائق
                </div>
                
                <div className="details-main-layout">
                
                    <div className="info-section">
                        <div className="inputs-grid">
                            <div className="input-group">
                                <label><Hash size={13}/> كود العميل</label>
                                <input type="text" value={bookingData.ClientID} readOnly />
                            </div>
                            <div className="input-group">
                                <label><User size={13}/> الاسم بالكامل</label>
                                <input type="text" value={bookingData.ClientName} readOnly />
                            </div>
                            <div className="input-group">
                                <label>الرقم القومي</label>
                                <input type="text" value={bookingData.NationalID} readOnly />
                            </div>
                            <div className="input-group">
                                <label><Phone size={13}/>1 رقم الهاتف</label>
                                <input type="text" value={bookingData.PhoneNumber} readOnly />
                            </div>
                            <div className="input-group">
                                <label><Phone size={13}/>2 رقم الهاتف</label>
                                <input type="text" value={bookingData.SecondaryPhone} readOnly />
                            </div>
                            <div className="input-group full-width">
                                <label><MapPin size={13}/> العنوان</label>
                                <input type="text" value={bookingData.Address} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="id-card-preview-container">
                        <label className="id-card-label">
                            <ImageIcon size={14} /> صورة البطاقة الشخصية
                        </label>
                        <div className="id-card-frame">
                            <img src={bookingData.NationalIdImagePath} alt="" className="id-card-image" />
                            <button className="btn-zoom-overlay">
                                <ExternalLink size={12}/> تكبير الصورة
                            </button>
                        </div>
                    </div>
                </div>
            </div>

           {/*  <div className="erp-card">
                <div className="card-header">
                    <Home size={18} /> الوحدات المحجوزة
                </div>
                <div className="table-wrapper">
                    <table className="custom-erp-table">
                        <thead>
                            <tr>
                                <th>اسم الوحدة</th>
                                <th>المشروع</th>
                                <th>تاريخ الحجز</th>
                                <th style={{ textAlign: 'center' }}>الأقساط</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockBookedUnits.map((unit, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td><span className="client-name-text">{unit.unitName}</span></td>
                                        <td>{unit.ProjectName}</td>
                                        <td>{unit.BookingDate}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="btn-tiny" onClick={() => setOpenUnitIndex(openUnitIndex === index ? null : index)}>
                                                <CreditCard size={14} /> {openUnitIndex === index ? "إخفاء" : "عرض"}
                                            </button>
                                        </td>
                                    </tr>

                                    {openUnitIndex === index && (
                                        <tr className="animate-slide">
                                            <td colSpan="4" className="installments-wrapper">
                                                <div className="mini-table-wrapper">
                                                    <h5 className="mini-table-header">
                                                        <Calendar size={14} /> جدول دفعات السداد
                                                    </h5>
                                                    <table className="mini-table">
                                                        <thead>
                                                            <tr>
                                                                <th>م</th>
                                                                <th>التاريخ</th>
                                                                <th>القيمة</th>
                                                                <th>الحالة</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {unit.installments.map((inst, i) => (
                                                                <tr key={i}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{inst.DueDate}</td>
                                                                    <td>{inst.Amount.toLocaleString()} ج.م</td>
                                                                    <td>
                                                                        <span className={`status-text ${inst.IsPaid ? 'مدفوع' : 'متأخر'}`}>
                                                                            {inst.IsPaid ? 'مدفوع' : 'مستحق'}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> */}
        </div>
    );
};

export default ClientDetails;