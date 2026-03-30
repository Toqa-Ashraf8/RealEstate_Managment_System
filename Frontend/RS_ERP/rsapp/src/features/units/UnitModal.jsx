import React from 'react'
import './UnitModal.css'
import { useDispatch, useSelector } from 'react-redux'
import { 
  calculateUnitTotalPrice, 
  saveUnitToTable, 
  setUnitData, 
  toggleUnitModal
} from '../../assets/redux/projectSlice.js';
import { CiImageOn } from "react-icons/ci";
import { variables } from '../../assets/variables.js';
import { uploadUnitImage } from '../../services/projectService.js';

const UnitModal = () => {

const {selectedUnit,unitImageName}=useSelector((state)=>state.projects);
const dispatch=useDispatch();
  
const HandleChangeV=(e)=>{
  const {name,value}=e.target;
  dispatch(setUnitData({[name]:value}));
}
const HandleChangeImage=async(e)=>{
  const{name}=e.target;
  if (!e.target.files || e.target.files.length === 0) return; 
  const file = e.target.files[0];
  const formDatau = new FormData();
  const fileName=file.name;
  formDatau.append("fileu", file,fileName );
   await dispatch(setUnitData({[name]:fileName}));
  await dispatch(uploadUnitImage(formDatau));
}

  return (
    <div dir='rtl'>
         
        <div className="modalu">
            <div className="modalcnt">
            <div className="headeru">
                <div className='mdl_titles'>
                     <span
                     className='close_b'
                     onClick={()=>dispatch(toggleUnitModal(false))}
                     >&times;</span>
                    <h4 className='units_title'>إضافة وحدة جديدة</h4>
                </div>
                
            </div>
            <div className="bodyu">
              <div className="row">
                <div className="col-8">
                  <div className="input-group-modern data_cntu">
                <label className='data_lbl'>كود</label>
                <input 
                type="text" 
                className='form-control-modern'
                name='serial'
                disabled
                value={selectedUnit.serial}
                onChange={HandleChangeV}
                />
              </div>

              <div className="input-group-modern data_cntu">
                <label className='data_lbl'>إسم الوحدة</label>
                <input 
                type="text" 
                className='form-control-modern'
                autoFocus
                name='unitName'
                value={selectedUnit.unitName}
                onChange={HandleChangeV}
                autoComplete='off'
                />
              </div>
              <div className="input-group-modern data_cntu">
                <label className='data_lbl'>الدور </label>
                <select 
                className='form-select-modern'
                name='Floor'
                value={selectedUnit.Floor}
                onChange={HandleChangeV}
                >
                  <option value="-1">-إختر-</option>
                  <option value="الأول">الأول</option>
                  <option value="الثاني">الثاني</option>
                  <option value="الثالث">الثالث</option>
                  <option value="الرابع">الرابع</option>
                </select>
              
              </div>
                <div className="input-group-modern data_cntu">
                <label className='data_lbl'>المساحة الكلية</label>
                <input 
                type="text" 
                className='form-control-modern'
                name='TotalArea'
                value={selectedUnit.TotalArea}
                onChange={HandleChangeV}
                autoComplete='off'
                />
              </div>

              <div className="input-group-modern data_cntu">
                <label className='data_lbl'>سعر المتر</label>
                <input 
                type="text" 
                className='form-control-modern'
                name='MeterPrice'
                value={selectedUnit.MeterPrice}
                onChange={HandleChangeV}
                autoComplete='off'
                onBlur={()=>dispatch(calculateUnitTotalPrice())}
                />
              </div>
               <div className="input-group-modern data_cntu">
                <label className='data_lbl'>سعر الوحدة</label>
                <input 
                type="text" 
                className='form-control-modern'
                name='TotalPrice'
                value={selectedUnit.TotalPrice}
                onChange={HandleChangeV}
                autoComplete='off'
                />
              </div>
          
                 <div className="input-group-modern data_cntu mb-0">
                  <label className='data_lbl'> صورة الوحدة</label>
                  <div className="file-input-wrapper">
                    <input 
                     type="file"
                     className='form-control-modern' 
                     id="project-image"
                     name='unitImage' 
                     onChange={HandleChangeImage}
                     />
                    <div className="custom-file-label">
                       <span>اضغط لرفع صورة الوحدة</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                  <div className="img_cntu">
                    <div 
                    style={{display:'flex',alignItems:'center',
                           justifyContent:'center',
                           position:'relative',top:'50%'}}>
                    <span><CiImageOn size={35} /></span>
                    </div>
                  {(unitImageName  || selectedUnit.unitImage )&&
                   <img 
                   src={`${variables.UNIT_IMAGES_URL}/${unitImageName || selectedUnit.unitImage}`} 
                   alt="" 
                   className="preview-img" 
                   style={{width:'100%',height:'100%',
                          position:'absolute',top:'0',
                          zIndex:'1000'}} />
                  }        
                </div>
               </div>
           </div>
            </div>
            <div className="footeru">
                <div 
                style={{display:'flex',justifyContent:'space-between',
                        marginLeft:'40px',marginTop:'-15px'}}>
                    <button 
                    className='btn btn-primary btn_addu'
                    onClick={()=> dispatch(saveUnitToTable())}
                    >إضافة</button>
                    <button 
                    className='btn btn-danger'
                    onClick={()=>dispatch(toggleUnitModal(false))}
                    >إلغاء</button>
                </div>
            </div>
        </div>
      </div>
  
    </div>
  )
}

export default UnitModal
