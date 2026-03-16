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
   } 
   catch (error) {
      toast.error("حدث خطأ في الاتصال بالخادم", {
         theme: "colored",
          position: "top-left",
       });
    }
  }
  return (
    <div className="delete-client-wrapper">
          <div className="delete-client-card">
            
            <div className="delete-client-close-btn" 
            onClick={()=>dispatch(HandleShowModal(false))}>
              <MdClose />
            </div>
    
            <div className="delete-client-content">
              <div className="delete-icon-box-c">
                <MdWarning />
              </div>
              <h2 className="delete-client-title">تنبيه الحذف</h2>
              <p className="delete-client-description">
                هل أنت متأكد من حذف جميع بيانات هذا العميل؟
                <br />
                <span className="client-id">كود العميل: {db.client?.ClientID}</span>
              </p>
            </div>
    
            <div className="delete-client-actions">
               <button className="btn-action-c btn-yes-c" onClick={()=>HandleDelete()}>
                <MdDelete /> نعم، متأكد
              </button>
              <button className="btn-action-c btn-no" onClick={()=>dispatch(HandleShowModal(false))}>
                لا، إلغاء
              </button>
            </div>
    
          </div>
        </div>
  );
};

export default ModalDeleteClients;