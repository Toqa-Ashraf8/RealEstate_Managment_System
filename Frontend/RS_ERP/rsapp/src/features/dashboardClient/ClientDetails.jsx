import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { 
    Eye, 
    ArrowRight, 
    User, 
    CreditCard, 
    ExternalLink ,
    Home,
    Search, 
    Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDetails = () => {
    const { bookingData,bookedUnitsData}=useSelector((state)=>state.clientsProfile);
    const navigate=useNavigate();
  
     return (
        <div className="erp-container animate-fade">
          {bookingData.map(c=>
          <div>
            <div className="erp-header"> 
                <button className="btn-back" 
                onClick={() => navigate('/clientpage')}>
                    <ArrowRight size={18}/> العودة للقائمة الرئيسية
                </button>
                <h3>ملف العميل:{bookingData.ClientName} </h3>
            </div>
            <div className="erp-card">
                <div className="card-header"><User size={18}/> البيانات الأساسية</div>
                <div className="inputs-grid">
                    <div className="input-group">
                        <label>الاسم الكامل</label>
                        <input type="text"  value={c.ClientName} readOnly />
                    </div>
                    <div className="input-group">
                        <label>الرقم القومي</label>
                        <input type="text" value={c.NationalID} readOnly />
                    </div>
                   {/*  <div className="input-group">
                        <label>رقم الهاتف 1</label>
                        <input type="text"  value={selectedClient.phone1} readOnly />
                    </div> */}
                    <div className="input-group">
                        <label>رقم الهاتف 2</label>
                        <input type="text"  value={c.SecondaryPhone} readOnly />
                    </div>
                    <div className="input-group full-width">
                        <label>العنوان بالكامل</label>
                        <input type="text"  value={c.Address}  readOnly />
                    </div>
                    <div className="input-group">
                        <label>صورة البطاقة</label>
                        <button className="btn-id-view"> 
                         
                            <ExternalLink size={14}/> عرض المرفق
                        </button>
                    </div>
                </div> 
            </div>
      </div>
     )}
     
             <div className="erp-card">   
                <div className="card-header"><Home size={18}/> الوحدات المحجوزة</div>
                <table className="erp-table inner">
                    <thead>
                        <tr>
                            <th>إسم الوحدة</th>
                            <th>اسم المشروع</th>
                        </tr>
                    </thead>
                   
    
                         <tbody>  
                        {bookedUnitsData.map((unit,index)=>      
                            <tr key={index}>
                              <td>{unit.Unit}</td> 
                               <td>{unit.ProjectName} </td>
                               </tr>
                            )}    
                      </tbody>        
                  </table>
             </div>
     </div>
);
}

export default ClientDetails