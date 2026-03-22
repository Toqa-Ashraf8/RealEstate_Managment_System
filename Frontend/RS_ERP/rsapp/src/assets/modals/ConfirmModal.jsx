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
const AcceptRequest = async () => {

  const acceptedrow = {
    ClientID: db.negotiationRow.ClientID,
    ProjectName: db.negotiationRow.ProjectName,
    Unit: db.negotiationRow.Unit,
    NegotiationCondition: db.negotiationRow.NegotiationCondition,
    SuggestedPrice: db.negotiationRow.SuggestedPrice || 0,
    ReasonOfReject: db.negotiationRow.ReasonOfReject || "",
    CheckedDate: db.CurrentDate
  };
  try {
  
    if (db.Re_approveRow === 0) {
      await dispatch(SaveRequestByAdmin(acceptedrow)).unwrap();
      toast.success("تم قبول الطلب!");
    } 
    else if (db.Re_approveRow === 1) {
    
      await dispatch(ApprovedtoReject(rejectobj)).unwrap();
      toast.success("تم تحديث الطلب!");
    }

    dispatch(showconfirmModal(false));

  } catch (error) {
    console.error("Submission Error:", error);
    toast.warning("حدث خطأ أثناء الحفظ");
  }
};

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