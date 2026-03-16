import React, { useEffect, useRef } from "react";
import "../css/NegotiationModal.css";
import {Building2,Ungroup}from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import { AddToNegotiationTable, calculateDiscount, changeNegotiation_values, getpriceByunit, getprojects, getunitsByproject, showNegotiationModal } from "../redux/clientSlice";
const NegotiationModal = () => {
const db = useSelector((state) => state.clients);
const dispatch = useDispatch();
const negotiationpriceRef=useRef();

//-------------------------------------------------------------
const HandleChange=(e)=>{
    const{name,value}=e.target;
     if (e.target.name === "ProjectName") {
      const selectedValue = e.target.value;
      if (e.target.value !== "-1") dispatch(getunitsByproject(selectedValue));
    }
     if(e.target.name === "Unit"){
          const unitvalue=e.target.value;
        if (e.target.value !== "-1") dispatch(getpriceByunit(unitvalue));
         negotiationpriceRef.current.focus();
      }
    dispatch(changeNegotiation_values({[name]:value}));
}
console.log(db.negotiation);
//********************************************************************************/
const AddToTable=()=>{
  dispatch(AddToNegotiationTable())
}
//--------------------------------------------
 useEffect(()=>{
 negotiationpriceRef.current.focus();
 },[])
  return (
    <div dir="rtl">
      <div className="modaln">
        <div className="modalcnt_n">
          <div className="headern">
            <div className="mdl_titles">
              <span 
              className="close_b"
              onClick={()=>dispatch(showNegotiationModal(false))}
              >&times;</span>
              <h4 className="units_title">إرسال طلب تفاوض</h4>
            </div>
          </div>
          <div className="bodyn">
              
            <div className="row">
                <div className="project-unit-section col-5">
                 <div className="data_projectname" style={{display:'flex'}}>
                      <label className="data_lbl" style={{width:'150px!important'}}>
                      إسم المشروع
                      </label>
                      <select 
                      className="crm_select select-project" 
                      name="ProjectName" 
                      value={db.negotiation.ProjectName || ""} 
                      onChange={HandleChange}
                      
                      >
                        <option value="-1">-إختر-</option>
                        {db.projects.map((project, index) => <option key={index} value={project.ProjectName}>{project.ProjectName}</option>)}
                      </select>
                  </div> 
                  <div></div>
                   {db.negotiation.ProjectName && db.negotiation.ProjectName !== "-1" && (
                    <div className="data-unitname" style={{display:'flex',gap:'40px'}}>
                      <label className="lbl_crm"> الوحدة</label>
                      <select className="crm_select select-unit" name="Unit" value={db.negotiation.Unit || ""} onChange={HandleChange}>
                        <option value="-1">-إختر-</option>
                        {db.units.map((unit, index) => <option key={index} value={unit.UnitName}>{unit.UnitName}</option>)}
                      </select>
                    </div>
                  )}
                  <div></div>
              </div>
              <div className="col-7">
                <div className="input-group-modern data_cntu">
                  <label className="data_lbl">كود الطلب</label>
                  <input
                    type="text"
                    className="form-control-modern"
                    disabled
                    name="serialCode"
                    value={db.negotiation.serialCode || ""}
                    onChange={HandleChange}
                  />
                </div>

                <div className="input-group-modern data_cntu">
                  <label className="data_lbl">السعر الأصلي</label>
                  <input
                    type="text"
                    className="form-control-modern"
                    disabled
                    autoComplete="off"
                    name="OriginalPrice"
                    value={db.negotiation.OriginalPrice || ""}
                    onChange={HandleChange}
                  />
                </div>
                 <div className="input-group-modern data_cntu">
                  <label className="data_lbl">السعر المقترح</label>
                  <input
                    type="text"
                    className="form-control-modern"
                    autoComplete="off"
                     ref={negotiationpriceRef}
                    name="NegotiationPrice"
                    value={db.negotiation.NegotiationPrice || ""}
                    onChange={HandleChange}
                    onBlur={() => dispatch(calculateDiscount())}
                  />
                </div>
                 <div className="input-group-modern data_cntu">
                  <label className="data_lbl">قيمة الخصم %</label>
                  <input
                    type="text"
                    className="form-control-modern"
                    autoComplete="off"
                    name="DiscountAmount"
                    value={db.negotiation.DiscountAmount || ""}
                    onChange={HandleChange}
                  />
                </div> 
               
              </div>
          
            </div>
          </div>
          <div className="footern">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginLeft: "45px",
              }}
            >
              <button className="btn btn-primary btn_addu"
              style={{marginRight:'20px'}}
              onClick={()=>AddToTable()}
              >إضافة</button>
              <button 
              className="btn btn-danger"
              onClick={()=>dispatch(showNegotiationModal(false))}
              >إلغاء</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;
