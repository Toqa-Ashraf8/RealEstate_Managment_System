import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ApprovedtoReject, clearValuesOfRow, GetAllnegotiations,  GetRejectModalvalues,  negotiationCount, RejectModal_values, SaveRequestByAdmin, showModal_reject } from '../redux/negotiationSlice';
import { AiTwotoneEdit } from "react-icons/ai";
import { toast } from 'react-toastify';
const RejectModal = () => {
     const db = useSelector((state) => state.negotiation);
    const dispatch = useDispatch();
    const RequestRow=db.detailsOfRow;
    const suggestedPrice=useRef();
   const acceptedobj=db.acceptedRow;

  //***************************************************** */
  const AddsuggestedPrice=()=>{
    suggestedPrice.current.disabled=false;
    suggestedPrice.current.focus();
  }
  //***************************************************** */
const HandleChange=(e)=>{
    const {name,value}=e.target;
    dispatch(RejectModal_values({[name]:value}));
    dispatch(GetRejectModalvalues({[name]:value}));
}
const CloseModal=()=>{
    dispatch(showModal_reject(false));
    dispatch(clearValuesOfRow());
}
const RejectConfirming=async()=>{
     const row={ClientID:db.negotiationRow.ClientID,
      ProjectName:db.negotiationRow.ProjectName,
      Unit:db.negotiationRow.Unit,
      NegotiationCondition:db.negotiationRow.NegotiationCondition,
      SuggestedPrice:db.negotiationRow.SuggestedPrice || 0,
      ReasonOfReject:db.negotiationRow.ReasonOfReject || ""
      ,CheckedDate:db.CurrentDate}
    try{
    if(db.defineRow===0){
    await dispatch(SaveRequestByAdmin(row)).unwrap();
     toast.error("تم رفض الطلب!", {
        theme: "colored",
        position: "top-left",
      });  
     
    }
    else if(db.defineRow===1){
      await dispatch(ApprovedtoReject(acceptedobj)).unwrap();
       toast.error("تم إعادة رفض الطلب!", {
        theme: "colored",
        position: "top-left",
      });  
     
    }

      dispatch(showModal_reject(false)); 
    }       
   
    catch (error) {
        console.error("خطأ في العملية:", error);
        toast.warning("حدث خطأ، يرجى التأكد من البيانات");
    }
}

 
  return (
    <div>
                <div className="modal-backdrop">
                    <div className="glass-modal animate__animated animate__zoomIn animate__faster">
                        <div className="modal-header">
                            <h3>رفض عرض العميل</h3>
                            <p>{RequestRow.ClientName} - {RequestRow.ProjectName}</p>
                        </div>
                        <div className="modal-inputs">
                            <div className="field" style={{display:'flex'}} >
                                <label>السعر البديل المقترح</label>
                                <div>
                                    <input 
                                    type="text" 
                                    disabled
                                    placeholder="أدخل مبلغ السعر الجديد"
                                    name='SuggestedPrice'
                                    value={db.negotiationRow.SuggestedPrice || ""}
                                    onChange={HandleChange}
                                    style={{width:'250px'}}
                                    ref={suggestedPrice}
                                />  
                                 <span>
                                    <AiTwotoneEdit 
                                    size={25} color='teal' 
                                    style={{cursor:'pointer',marginRight:'20px'}}
                                    onClick={()=>AddsuggestedPrice()}
                                    />
                                    </span>
                                </div>
                               
                            </div>
                            <div className="field">
                                <label>سبب الرفض</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="لماذا تم رفض هذا السعر؟"
                                    name='ReasonOfReject'
                                    value={db.negotiationRow.ReasonOfReject || ""}
                                    onChange={HandleChange}
                                ></textarea>
                            </div>
                             
                        </div>
                        <div className="modal-actions">
                            <button 
                            className="confirm-btn"
                            onClick={()=>RejectConfirming()}
                            >تأكيد الرفض</button>
                            <button className="cancel-btn" onClick={() =>CloseModal()}>إلغاء</button>
                        </div>
                    </div>
                </div>
            
    </div>
  )
}

export default RejectModal