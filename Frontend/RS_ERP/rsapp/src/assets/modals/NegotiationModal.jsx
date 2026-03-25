import React, { useEffect, useRef } from "react";
import "../css/NegotiationModal.css";
import {Building2,Ungroup}from 'lucide-react'
import { useDispatch, useSelector } from "react-redux";
import { 
  calculateDiscount,  
  saveNegotiationToTable, 
  setNegotiationData, 
  toggleNegotiationModal 
} from "../redux/clientSlice";
import { fetchPriceByUnit, fetchProjects, fetchUnitsByProject } from "../services/clientService";
const NegotiationModal = () => {
const {negotiation,projects,units}= useSelector((state) => state.clients);
const {isLoading}=useSelector((state)=>state.ui);
const dispatch = useDispatch();
const negotiationPriceRef=useRef();

const handleInputsChange=(e)=>{
    const{name,value}=e.target;
     if (e.target.name === "ProjectName") {
      const selectedValue = e.target.value;
      if (e.target.value !== "-1") dispatch(fetchUnitsByProject(selectedValue));
    }
     if(e.target.name === "Unit"){
          const unitvalue=e.target.value;
        if (e.target.value !== "-1") dispatch(fetchPriceByUnit(unitvalue));
         negotiationPriceRef.current.focus();
      }
    dispatch(setNegotiationData({[name]:value}));
}

const addNewNegotiation=()=>{
  dispatch(saveNegotiationToTable())
}

 useEffect(()=>{
    negotiationPriceRef.current.focus();
    if(negotiation.ProjectName!==-1 && negotiation.ProjectName){
        dispatch(fetchProjects());
        dispatch(fetchUnitsByProject(negotiation.ProjectName))
    }
 },[dispatch])

  return (
    <div dir="rtl">
      <div className="modaln">
        <div className="modalcnt_n">
          <div className="headern">
            <div className="mdl_titles">
              <span className="close_b"  
              onClick={()=>dispatch(toggleNegotiationModal(false))}>
                <span>&times;</span>
              </span>
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
                      value={negotiation.ProjectName || ""} 
                      onChange={handleInputsChange} 
                      >
                        <option value="-1">-إختر-</option>
                        {projects.map((project, index) => <option key={index} value={project.ProjectName}>{project.ProjectName}</option>)}
                      </select>
                  </div> 
                  <div>
                 </div>
                   {negotiation.ProjectName && negotiation.ProjectName !== "-1" && (
                    <div className="data-unitname" style={{display:'flex',gap:'40px'}}>
                      <label className="lbl_crm"> الوحدة</label>
                      <select className="crm_select select-unit" name="Unit" value={negotiation.Unit || ""} onChange={handleInputsChange}>
                        <option value="-1">-إختر-</option>
                        {units.map((unit, index) => <option key={index} value={unit.UnitName}>{unit.UnitName }</option>)}
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
                    value={negotiation.serialCode || ""}
                    onChange={handleInputsChange}
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
                    value={negotiation.OriginalPrice || ""}
                    onChange={handleInputsChange}
                  />
                </div>
                 <div className="input-group-modern data_cntu">
                  <label className="data_lbl">السعر المقترح</label>
                  <input
                    type="text"
                    className="form-control-modern"
                    autoComplete="off"
                     ref={negotiationPriceRef}
                    name="NegotiationPrice"
                    value={negotiation.NegotiationPrice || ""}
                    onChange={handleInputsChange}
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
                    value={negotiation.DiscountAmount || ""}
                    onChange={handleInputsChange}
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
              disabled={isLoading}
              onClick={()=>addNewNegotiation()}
              >إضافة</button>
              <button 
              className="btn btn-danger"
              disabled={isLoading}
              onClick={()=>dispatch(toggleNegotiationModal(false))}
              >إلغاء</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationModal;
