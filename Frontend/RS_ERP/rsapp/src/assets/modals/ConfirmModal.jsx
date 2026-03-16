import React, { useState } from 'react';
import '../css/ConfirmModal.css';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify'
import { SaveRequestByAdmin, showconfirmModal } from '../redux/negotiationSlice';

const ConfirmModal = () => {
     const db = useSelector((state) => state.negotiation);
    const dispatch = useDispatch();
    const row={ClientID:db.negotiationRow.ClientID,
      ProjectName:db.negotiationRow.ProjectName,
      Unit:db.negotiationRow.Unit,
      NegotiationCondition:db.negotiationRow.NegotiationCondition,
      SuggestedPrice:db.negotiationRow.SuggestedPrice || 0,
      ReasonOfReject:db.negotiationRow.ReasonOfReject || ""
      ,CheckedDate:db.CurrentDate}
    //******************************************************************* */
const AcceptRequest=()=>{
  const FetchData=async()=>{
    try {
      if(row) await dispatch(SaveRequestByAdmin(row));
      toast.success("تم قبول الطلب وسيتم ارساله للموظف!", {
        theme: "colored",
        position: "top-left",
      });
      dispatch(showconfirmModal(false));
   } catch (error) {
    console.log("حدث خطأ في تنفيذ الطلب",error)
  }
  }
  FetchData();
}
console.log("row",row);
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