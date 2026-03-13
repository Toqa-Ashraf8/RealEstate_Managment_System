import React from 'react';
import { MdClose, MdWarning, MdDelete } from "react-icons/md";
import '../css/ModalDeleteClients.css';
import { useDispatch, useSelector } from 'react-redux';
import { clearinputs, deleteAllData, HandleShowModal } from '../redux/clientSlice';
import { toast } from 'react-toastify';
const ModalDeleteClients = () => {
  const db = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  //**********************************************//
  const HandleDelete=async()=>{
   try {
      const result = await dispatch(deleteAllData(db.client.ClientID)).unwrap();
      if(db.deletedall)
      {
          toast.error("تم مسح جميع البيانات", {
           theme: "colored",
          position: "top-left",
       });
      }     
      dispatch(HandleShowModal(false));
      dispatch(clearinputs());
   } catch (error) {
      toast.error("حدث خطأ في الاتصال بالخادم", {
         theme: "colored",
          position: "top-left",
       });
    }
  }
  return (
    <div className="modal-overlay">
      <div className="modal-container" >
        <div className="modal-header">
         <span 
         style={{fontSize:'25px',cursor:'pointer'}}
         onClick={()=>dispatch(HandleShowModal(false))}
         >&times;</span>
        </div>
    
        <div className="modal-body">
          <div className="warning-icon">
            <MdWarning />
          </div>
          <p className="modal-message">
            هل أنت متأكد من عملية الحذف؟
          </p>
        </div>

        <div className="modal-footer">
          <button 
          className="btn-cancel" 
          onClick={()=>dispatch(HandleShowModal(false))}
          >
            لا
          </button>
          <button 
          className="btn-confirm"
          onClick={()=>HandleDelete()}
          >
            <MdDelete /> نعم 
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteClients;