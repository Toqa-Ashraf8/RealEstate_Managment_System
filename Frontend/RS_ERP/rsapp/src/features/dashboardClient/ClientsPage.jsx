import React, { useEffect, useState } from 'react';
import './ClientsPage.css';
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
import {useDispatch, useSelector} from 'react-redux'
import { fetchAllClients, fetchClientFullDetails } from '../../services/clientsProfileService';
import {useNavigate} from 'react-router-dom'
import ClientDetails from './ClientDetails';
const ClientsPage = () => {
    const dispatch=useDispatch();
    const {
        clientData,
        bookingData,
        bookedUnitsData
    }=useSelector((state)=>state.clientsProfile);
    const navigate=useNavigate();
       
useEffect(()=>{
    dispatch(fetchAllClients());
}, []);

const setSelectedClient=async(id)=>{
    try {
        await dispatch(fetchClientFullDetails(id)).unwrap();
        navigate('/clientdetails');
    } catch (error) {
        console.error("Failed to fetch details:", error);
    }

}
console.log("bookingData",bookingData);
console.log("bookedUnitsData",bookedUnitsData)
    if (clientData) { 
        return (
            <div className="erp-container animate-fade">
                <div className="main-header">
                    <h2 className="section-title">إدارة ملفات العملاء</h2>
                    <div className="search-wrapper">
                        <Search size={18} className="search-icon"/>
                        <input type="text" placeholder="بحث باسم العميل أو الكود..." 
                        className="search-input"/>
                    </div>
                </div>

                <div className="modern-table-container">
                    <div className="table-header-grid">
                        <div className="header-item">كود العميل</div>
                        <div className="header-item">الاسم </div>
                        <div className="header-item">رقم التواصل</div>
                        <div className="header-item action-header">الإجراءات</div>
                    </div>
                    
                    <div className="table-body-grid">
                        {clientData.map((c,index) => (
                            <div className="table-row-card" key={index}>
                                <div className="row-item code-cell">
                                    <span className="client-code-badge">{c.ClientID}</span>
                                </div>
                                <div className="row-item name-cell">
                                    <User size={16} className="item-icon-gray"/>
                                    <span className="client-name-text">{c.ClientName}</span>
                                </div>
                                <div className="row-item phone-cell">
                                    <Phone size={16} className="item-icon-gray"/>
                                    <span>{c.PhoneNumber}</span>
                                </div>
                                <div className="row-item action-cell">
                                    <button className="btn-open-file" 
                                     onClick={() => setSelectedClient(c.ClientID)}>
                                        <Eye size={16}/> عرض ملف العميل
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    
   } 
};

export default ClientsPage;