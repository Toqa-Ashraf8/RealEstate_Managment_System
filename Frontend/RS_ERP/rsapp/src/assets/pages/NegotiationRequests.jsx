import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { acceptedCount, ChangeConditionOfRequest, GetAllnegotiations, GetClientDetails, negotiationCount, rejectedCount, rejectedRequests_show, showconfirmModal, showModal_reject } from '../redux/negotiationSlice';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CgCloseR } from "react-icons/cg";
import 'animate.css';
import RejectModal from '../modals/RejectModal';
import '../css/NegotiationRequests.css'
import { MoveLeft } from 'lucide-react';
import ConfirmModal from '../modals/ConfirmModal';
import { useNavigate } from 'react-router-dom';


const NegotiationRequests = () => {
    const db = useSelector((state) => state.negotiation);
    const dispatch = useDispatch();
    const navigate=useNavigate();
  
//***************************************************** */
const Reject=(i)=>{
   dispatch(showModal_reject(true));
     dispatch(GetClientDetails(i));
      dispatch(ChangeConditionOfRequest(0));
      
}
console.log(db.negotiationRow);
const Accepted=(i)=>{
     dispatch(GetClientDetails(i));
     dispatch(ChangeConditionOfRequest(1));
     dispatch(showconfirmModal(true));
} 
    useEffect(() => {
      const Fetch=async()=>{
        try {
           await dispatch(negotiationCount());
          await dispatch(GetAllnegotiations());
          await dispatch(rejectedCount());
          await dispatch(acceptedCount());

        } catch (error) {
          console.log("فشل في جلب البيانات",error)
        }
      }
      Fetch();
    }, [dispatch]);
console.log(db.negotiationRow.NegotiationCondition);
    return (
      
        <div className="dashboard-wrapper animate__animated animate__fadeIn">
          {db.rejectmodal && <RejectModal/>}
          {db.confirmModal && <ConfirmModal/>}
            <div className="custom-glass-header">
                <div className="title-section">
                    <h3>طلبات التفاوض <span className="badge-count">{db.negotiationNo}</span></h3>
                </div>
                <div className="status-container" style={{cursor:'pointer'}}>
                    <div 
                    className="stat-item reject"
                    onClick={()=>navigate('/rejected_negotiations')}
                    >مرفوض: {db.rejected_neg ||0}</div>
                    <div 
                    className="stat-item approve"
                     onClick={()=>navigate('/accepted_negotiations')}
                    >مقبول: {db.accepted_neg || 0}</div>
                </div>
            </div>


            <div className="table-responsive-glass">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>كود العميل</th>
                            <th>العميل</th>
                            <th>المشروع / الوحدة</th>
                            <th>التحليل المالي</th>
                            <th>التاريخ</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {db.Allnegotiations?.map((neg, index) => (
                            <tr key={index}  className="animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <td>{neg.ClientID}</td>
                                <td className="font-bold">{neg.ClientName}</td>
                                <td>
                                    <div className="unit-info">
                                        <span>{neg.ProjectName}</span>
                                        <span>/</span>
                                        <small>{neg.Unit}</small>
                                    </div>
                                </td>
                                <td>
                                    <div className="price-tag-container" style={{display:'flex',justifyContent:'center'}}>
                                        <span className="price-old" style={{fontSize:'16px'}}>{neg.OriginalPrice}</span>
                                        <span>  <MoveLeft size={25}/></span>
                                        <span className="price-new">{neg.NegotiationPrice}</span>
                                    </div>
                                </td>
                                <td>{neg.NegotiationDate?.split('T')[0]}</td>
                                <td>
                                    <div className="btns-group"
                                    style={{display:'flex',justifyContent:'center',gap:'20px'}}>
                                        <button 
                                        className="action-btn accept-btn" title="قبول"
                                         onClick={()=>Accepted(index)}
                                        >
                                            <IoMdCheckmarkCircleOutline size={22} />
                                        </button>
                                        <button 
                                            className="action-btn reject-btn" 
                                            title="رفض"
                                           onClick={() =>Reject(index)}
                                        >
                                            <CgCloseR size={22} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

          
        </div>
    );
};

export default NegotiationRequests;