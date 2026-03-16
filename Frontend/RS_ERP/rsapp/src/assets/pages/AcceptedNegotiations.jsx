import React, { useEffect } from 'react';
import { RotateCcw, User, Tag, CalendarCheck } from 'lucide-react';
import '../css/AcceptedNegotiations.css';
import { useDispatch, useSelector } from 'react-redux';
import { acceptedCount, DefineApproveRow, GetAdcceptedrowByIndex, showModal_reject } from '../redux/negotiationSlice';
import RejectModal from '../modals/RejectModal';

const AcceptedNegotiations = () => {
    const db = useSelector((state) => state.negotiation);
    const dispatch = useDispatch();
//************************************************************************ */
const Re_Reject=(index)=>{
    dispatch(GetAdcceptedrowByIndex(index));
    dispatch(DefineApproveRow(1));
    dispatch(showModal_reject(true));
}
    useEffect(() => {
        const getData = async () => {
            await dispatch(acceptedCount());
        }
        getData();
    }, [dispatch]);

    return (
        <div className="acc-page-wrapper">
             {db.rejectmodal && <RejectModal/>}
            <div className="acc-header">
                <h2>قائمة الطلبات المقبولة</h2>
                <div className="acc-badge">طلب مقبول {db.accepted_neg}</div>
            </div>

            <div className="acc-list-container">
                {db.acceptedRequests.map((req, index) => (
                    <div 
                    key={index} className="acc-item-row"
                    >
                        
                     
                        <div className="acc-section acc-client-section">
                            <div className="acc-avatar"><User size={16}/></div>
                            <div>
                                <h4>{req.ClientName}</h4>
                                <span>كود: {req.ClientID}</span>
                            </div>
                        </div>

                
                        <div className="acc-section acc-unit-section">
                            <p><Tag size={12} /> {req.ProjectName} - {req.Unit}</p>
                            <p className="acc-price">العرض: {req.NegotiationPrice}</p>
                        </div>
                        <div className="section date-section">
                            <p><CalendarCheck size={12} /> تاريخ الطلب</p>
                            <p className="rejected-date">{req.NegotiationDate ? req.NegotiationDate.split('T')[0] : ""}</p>
                        </div>
                    
                        <div className="acc-section acc-date-section">
                            <p><CalendarCheck size={12} /> تاريخ القبول</p>
                            <p className="acc-date-text">{req.CheckedDate ? req.CheckedDate.split('T')[0] : ""}</p>
                        </div>

                   
                        <div className="acc-section acc-action-section">
                            <button 
                            className="btn btn-danger" 
                            style={{width:'120px',height:'30px',fontSize:'13px'}}
                            onClick={()=>Re_Reject(index)}
                            >
                                استرجاع للرفض
                            </button>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AcceptedNegotiations;