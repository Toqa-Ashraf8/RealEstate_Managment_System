import React, { useEffect, useRef } from "react";
import "../css/PaymentTypeModal.css";
import {Building2,Ungroup,Image as ImageIcon}from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import { CiImageOn } from "react-icons/ci";
import { confirmpaidStatus, getPaymentModalvalues, saveinstallmentCheck, showPaymentModal } from "../redux/bookingSlice";
import { variables } from "../variables";
const PaymentTypeModal = () => {
const db_b = useSelector((state) => state.booking);
const dispatch = useDispatch();

//-------------------------------------------------------------
const HandlepaymentValuesChange=(e)=>{
  const {name,value}=e.target;
  dispatch(getPaymentModalvalues({[name]:value}));
}
const HandleChangeImage=async(e)=>{
   const { name } = e.target;
    if (!e.target.files || e.target.files.length === 0) return; 
       const file = e.target.files[0];
       const formData = new FormData();
       const fileName = file.name;
        formData.append("checkfile", file, fileName);    
          await  dispatch(saveinstallmentCheck(formData));
          await  dispatch(getPaymentModalvalues({[name]:fileName}));         
}
//********************************************************************************/
const handleConfirmReversal=()=>{
  dispatch(confirmpaidStatus());
}
  return (
    <div dir="rtl">
      <div className="modalp">
        <div className="modalcnt_p">
          <div className="headerp">
            <div className="mdl_titles_p">
              <span 
              className="close_p"
              onClick={()=>dispatch(showPaymentModal(false))}
              >&times;</span>
            </div>
          </div>
          <div className="bodyp">
              
          <div className="row">
        <div className="col-6">

             <div className="input-group-modern data_cntp">
                <label className='data_lbl'>طريقة الدفع </label>
                <select 
                className='form-select-modern'
                name='PaymentType'
                value={db_b.paymentType?.PaymentType || ""}
                onChange={HandlepaymentValuesChange}
                >
            
                  <option value="-1">-إختر-</option>
                  <option value="كاش">كاش</option>
                  <option value="شيك">شيك</option>
                </select>
              
              </div>
             <div className="input-group-modern data_cntp mb-0">
                  <label className='data_lbl'> صورة الشيك</label>
                  <div className="file-input-wrapper">
                    <input 
                     type="file"
                     className='form-control-modern'
                     name='CheckImage'
                     onChange={HandleChangeImage}
                     />
                    <div className="custom-file-label">
                       <span>اضغط لرفع صورة الشيك</span>
                    </div>
                  </div>
                </div>
              </div>
                <div className="col-6">
                 <div className="final_image_preview_big">
                  {(db_b.installmentCheckImageName || db_b.paymentType?.CheckImage)?
                  
                     (<img 
                         src= {`${variables.URL_IMGI}/${db_b.installmentCheckImageName || db_b.paymentType?.CheckImage}`}
                         className="final_img_fluid_I" alt="" />
                    )  
                    :
                    ( <div className="final_empty_msg">
                       <ImageIcon size={40} className="final_icon_fade" />
                        <p>معاينة الشيك</p>
                        </div>
                    )
                     }    
               </div>
               </div>
          </div>
          </div>
          <div className="footerp">
          <div className="footer_btns_container">
            <button className="btn_modal success" onClick={()=>handleConfirmReversal()}>تحديث الحالة</button>
            <button className="btn_modal danger"
             onClick={()=>dispatch(showPaymentModal(false))}
            >إلغاء</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTypeModal;
