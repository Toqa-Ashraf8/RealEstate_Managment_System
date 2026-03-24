import React from 'react';
import { MdClose, MdWarning, MdDelete } from "react-icons/md";
import '../css/DeleteUnitRowModal.css';
import {  deleteUnitFromList, hidedeleteUnitRowModal } from '../redux/projectSlice';
import { useDispatch, useSelector } from 'react-redux';

const DeleteUnitRowModal = () => {
  const db = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  return (
    <div className="row-modal-overlay">
      <div className="row-modal-card">
        
        <div className="row-modal-close" 
        onClick={()=>dispatch(hidedeleteUnitRowModal())}
        >
          <MdClose />
        </div>

        <div className="row-modal-content">
          <div className="row-modal-icon">
            <MdWarning />
          </div>
          <p className="row-modal-text">
            هل أنت متأكد من عملية الحذف؟
          </p>
        </div>

        <div className="row-modal-btns">
          <button className="row-btn-cancel" 
          onClick={()=>dispatch(hidedeleteUnitRowModal())}
          >
            لا
          </button>
          <button className="row-btn-confirm"
          onClick={()=>dispatch(deleteUnitFromList())}
          >
            <MdDelete /> نعم
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteUnitRowModal;