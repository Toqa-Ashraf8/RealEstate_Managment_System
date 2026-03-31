import React, { useState } from 'react';
import './ConfirmModal.css';
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify'
import { toggleConfirmModal } from '../../../assets/redux/negotiationSlice';
import { 
  processNegotiationReview, 
  updateNegotiationStatus 
} from '../../../services/negotiationService';

const ConfirmModal = () => {
const {
  selectedRejectedNegotiation,
  selectedRequest,
  CurrentDate,
  rejected
} = useSelector((state) => state.negotiation);
const dispatch = useDispatch();

    
const acceptRequest = async () => {
const acceptedrow = {...selectedRequest,CheckedDate:CurrentDate};
console.log("acceptedrow",acceptedrow)
   try {
    if (rejected === 0) {
      await dispatch(processNegotiationReview(acceptedrow)).unwrap();
      toast.success("تم قبول الطلب!");
    } 
    else if (rejected === 1) {
      await dispatch(updateNegotiationStatus(selectedRejectedNegotiation)).unwrap();
      toast.success("تم تحديث الطلب!");
    }
    dispatch(toggleConfirmModal(false));
  } 
  catch (error) {
    toast.warning("حدث خطأ أثناء الحفظ");
  }   
};

  return (
    <div className="modal-o">
      <div className="modal-container">
        <p className="modal-message">هل أنت متأكد من قبول هذا الطلب؟</p>
        <div className="modal-actions">
          <button className="btn btn-danger" 
          onClick={()=>dispatch(toggleConfirmModal(false))}>لا</button>
          <button className="btn-yes" onClick={()=>acceptRequest()}>نعم</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;