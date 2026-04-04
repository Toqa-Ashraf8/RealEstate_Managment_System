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
import { variables } from '../../assets/variables';
const ClientDetails = () => {
    const {bookingData,bookedUnitsData}=useSelector((state)=>state.clientsProfile);
    const navigate = useNavigate();
    const [openUnitIndex, setOpenUnitIndex] = useState(null);

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
                {bookingData.map((c)=>
                <>
                    <div className="info-section">
                        <div className="inputs-grid">
                            <div className="input-group">
                                <label><Hash size={13}/> كود العميل</label>
                                <input type="text" value={c.ClientID} readOnly />
                            </div>
                            <div className="input-group">
                                <label><User size={13}/> الاسم بالكامل</label>
                                <input type="text" value={c.ClientName} readOnly />
                            </div>
                            <div className="input-group">
                                <label>الرقم القومي</label>
                                <input type="text" value={c.NationalID} readOnly />
                            </div>
                            <div className="input-group">
                                <label><Phone size={13}/>1 رقم الهاتف</label>
                                <input type="text" value={c.PhoneNumber} readOnly />
                            </div>
                            <div className="input-group">
                                <label><Phone size={13}/>2 رقم الهاتف</label>
                                <input type="text" value={c.SecondaryPhone} readOnly />
                            </div>
                            <div className="input-group full-width">
                                <label><MapPin size={13}/> العنوان</label>
                                <input type="text" value={c.Address} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="id-card-preview-container">
                        <label className="id-card-label">
                            <ImageIcon size={14} /> صورة البطاقة الشخصية
                        </label>
                        <div className="id-card-frame">
                            <img src={variables.NATIONAL_ID_IMAGES_URL+c.NationalIdImagePath} 
                            alt="" className="id-card-image" />
                            
                        </div>
                    </div>
                   
                    </>
                    )}               
                   </div>
               
            </div>

            <div className="erp-card">
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
                            {bookedUnitsData && bookedUnitsData.map((unit, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td><span className="client-name-text">{unit.unitName}</span></td>
                                        <td>{unit.ProjectName}</td>
                                         <td>{unit.BookingDate.split('T')[0]}</td> 
                                        <td style={{ textAlign: 'center' }}>
                                            <button className="btn-tiny" 
                                            onClick={() => setOpenUnitIndex(openUnitIndex === index ? null : index)}>
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
                                                            {unit.Installments.map((inst, i) => (
                                                                <tr key={i}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{inst.DueDate.split('T')[0]}</td>
                                                                    <td>{inst.MonthlyAmount.toLocaleString()} ج.م</td>
                                                                    <td>
                                                                        <span className={`status-text ${inst.Paid ? 'مدفوع' : 'متأخر'}`}>
                                                                            {inst.Paid ? 'مدفوع' : 'مستحق'}
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
            </div> 
        </div>
    );
};

export default ClientDetails;