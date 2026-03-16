import React, { useEffect } from 'react';
import { RotateCcw, User, Tag, Info, CalendarCheck } from 'lucide-react';
import '../css/RejectedNegotiations.css';
import { useDispatch, useSelector } from 'react-redux';
import { DefineRejectRow, GetRejectedrowByIndex, rejectedCount, showconfirmModal, showModal_reconfrim } from '../redux/negotiationSlice';
import ReConfirmModal from '../modals/ReConfirmModal';
import ConfirmModal from '../modals/ConfirmModal';

const RejectedNegotiations = () => {
    const db = useSelector((state) => state.negotiation);
    const dispatch = useDispatch();
//**************************************************************************** */
const Re_Approve=(index)=>{
    dispatch(GetRejectedrowByIndex(index))
    dispatch(dispatch(DefineRejectRow(1)));
    dispatch(showconfirmModal(true));
}
    useEffect(() => {
        const getData = async () => {
            await dispatch(rejectedCount());
        }
        getData();
    }, [dispatch]);
//**************************************************************************** */
    return (
        <div className="clean-page-wrapper">
            {db.Re_confirmModal && <ReConfirmModal />}
            {db.confirmModal && <ConfirmModal/>}
            <div className="clean-header">
                <h2>قائمة الطلبات المستبعدة</h2>
                <div className="clean-badge_r">{db.rejected_neg} طلب مرفوض</div>
            </div>

            <div className="clean-list-container">
                {db.rejectedRequests.map((req, index) => (
                    <div key={index} className="clean-item-row">
                        
                        {/* معلومات العميل */}
                        <div className="section client-section">
                            <div className="clean-avatar"><User size={16} /></div>
                            <div>
                                <h4>{req.ClientName || ""}</h4>
                                <span>كود: {req.ClientID || ""}</span>
                            </div>
                        </div>

                        {/* المشروع والسعر */}
                        <div className="section unit-section">
                            <p><Tag size={12} /> {req.ProjectName || ""} - {req.Unit || ""}</p>
                            <p className="rejected-price_r">العرض: {req.NegotiationPrice || ""}</p>
                        </div>

                        {/* سبب الرفض */}
                        <div className="section reason-section">
                            <div className="reason-label"><Info size={12} /> سبب الرفض:</div>
                            <p>{req.ReasonOfReject || ""}</p>
                        </div>

                        {/* التواريخ */}
                        <div className="section date-section">
                            <p><CalendarCheck size={12} /> تاريخ الطلب</p>
                            <p className="rejected-date">{req.NegotiationDate ? req.NegotiationDate.split('T')[0] : ""}</p>
                        </div>

                        <div className="section date-section">
                            <p><CalendarCheck size={12} /> تاريخ الرفض</p>
                            <p className="rejected-date">{req.CheckedDate ? req.CheckedDate.split('T')[0] : ""}</p>
                        </div>

                     
                        <div className="section action-section">
                          <button 
                          className="btn btn-success" 
                          style={{width:'120px',height:'30px',fontSize:'13px'}}
                          onClick={()=>Re_Approve(index)}
                          >
                                استرجاع للقبول
                            </button>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RejectedNegotiations;