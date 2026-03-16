import React, { useState } from 'react';
import '../css/ConfirmModal.css';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify'
import { ApprovedtoReject, SaveRequestByAdmin, showconfirmModal } from '../redux/negotiationSlice';

const ConfirmModal = () => {
     const db = useSelector((state) => state.negotiation);
    const dispatch = useDispatch();
    const rejectobj=db.rejectedrow;
    
    //******************************************************************* */
const AcceptRequest=()=>{
  const row={ClientID:db.negotiationRow.ClientID,
      ProjectName:db.negotiationRow.ProjectName,
      Unit:db.negotiationRow.Unit,
      NegotiationCondition:db.negotiationRow.NegotiationCondition,
      SuggestedPrice:db.negotiationRow.SuggestedPrice || 0,
      ReasonOfReject:db.negotiationRow.ReasonOfReject || ""
      ,CheckedDate:db.CurrentDate}
  const FetchData=async()=>{
    try {
      if(db.Re_approveRow===0)
      {
        await dispatch(SaveRequestByAdmin(row)).unwrap();
        toast.error("تم  قبول الطلب!", {
          theme: "colored",
          position: "top-left",
        });     

      } 
        else if(db.Re_approveRow===1){
          await dispatch(ApprovedtoReject(rejectobj)).unwrap();
          toast.error("تم إعادة قبول الطلب!", {
          theme: "colored",
          position: "top-left",
        });  
        }
     
      dispatch(showconfirmModal(false));
   } 
   catch (error) {
     console.log("حدث خطأ في تنفيذ الطلب",error)
     toast.warning("حدث خطأ، يرجى التأكد من البيانات");
  }
  }
  FetchData();
}

  return (
    <div className="modal-o">
      <div className="modal-container">
        <p className="modal-message">هل أنت متأكد من قبول هذا الطلب؟</p>
        <div className="modal-actions">
          <button className="btn btn-danger" 
          onClick={()=>dispatch(showconfirmModal(false))}>لا</button>
          <button className="btn-yes" onClick={()=>AcceptRequest()}>نعم</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;