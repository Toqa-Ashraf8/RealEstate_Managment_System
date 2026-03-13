import React from 'react';
import { MdClose, MdWarning, MdDelete } from "react-icons/md";
import '../css/DeleteUnitRowModal.css';
import { DeleteRow, showdeleteUnitRowModal } from '../redux/projectSlice';
import { useDispatch, useSelector } from 'react-redux';

const DeleteUnitRowModal = () => {
  const db = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  return (
    <div className="row-modal-overlay">
      <div className="row-modal-card">
        
        <div className="row-modal-close" 
        onClick={()=>dispatch(showdeleteUnitRowModal(false))}
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
          onClick={()=>dispatch(showdeleteUnitRowModal(false))}
          >
            لا
          </button>
          <button className="row-btn-confirm"
          onClick={()=>dispatch(DeleteRow())}
          >
            <MdDelete /> نعم
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteUnitRowModal;