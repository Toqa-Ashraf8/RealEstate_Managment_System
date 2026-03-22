import React, { useEffect } from 'react';
import { UserCheck, FileEdit, Calculator, Printer, User ,ArrowLeft } from 'lucide-react';
import '../css/BookingsManager.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { acceptedCount, GetBookngClient} from '../redux/negotiationSlice';
import { clearInputs, FillClientData } from '../redux/bookingSlice';


const BookingsManager = () => {
   const db = useSelector((state) => state.negotiation);
   const db_b=useSelector((state)=>state.booking);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    
 //----------------------------------------------------------
const CompleteBooking=(index)=>{
    dispatch(GetBookngClient(index));
    navigate('/complete_booking');
    dispatch(clearInputs());
}   

//********************************************************* */
useEffect(()=>{
    const Fetch=async()=>{
         dispatch(acceptedCount());
    }
    Fetch();
},[])
    return (
        <div className="bk-manage-wrapper">
            <div className="bk-header">
                <h2><UserCheck size={24} /> إدارة الحجوزات (استكمال التعاقد)</h2>
                <p>الطلبات المعتمدة من الإدارة وبانتظار جدولة الأقساط</p>
            </div>
           <div style={{display:'flex',justifyContent:'space-around',marginBottom:'20px',marginLeft:'20px'}}>
            <div></div>
            <div></div>
            <div></div>  
            <button 
            className='btn btn-primary' style={{width:'220px'}}
            onClick={()=>navigate("/booked_clients")}
            >عرض جميع الحجوزات
            <ArrowLeft size={20} style={{marginRight:'10px'}}/>
            </button>
            </div>
            <div className="bk-container">
                {db.acceptedRequests.length===0 ?
                (<div className="empty-state-container">
                 <div className="empty-state-icon">
                
                 </div>
                     <h3>لا توجد طلبات معتمدة حالياً</h3>
                     <p>بمجرد الموافقة على طلبات التفاوض، ستظهر جميعها هنا لاستكمال بيانات الحجز.</p>
                     </div>): 
                 (db.acceptedRequests.map((req,index)=>
                    <div key={index} className="bk-card">
                        <div className="bk-main-info">
                            <div className="bk-user-avatar"><User size={20} /></div>
                            <div>
                                <h3>{req.ClientName}</h3>
                                <span>مشروع: {req.ProjectName} | وحدة: {req.Unit}</span>
                            </div>
                        </div>

                        <div className="bk-price-info">
                            <p className="label">السعر المعتمد</p>
                            <p className="value">{req.NegotiationPrice} ج.م</p>
                        </div>

                        <div className="bk-actions">
                            <button 
                            className="btn-complete"
                            onClick={()=>CompleteBooking(index)}
                            >
                                <FileEdit size={16} /> استكمال بيانات الحجز
                            </button>
                            
                        </div>
                    </div>
                ))}
            </div>
        
        </div>
    );
};

export default BookingsManager;