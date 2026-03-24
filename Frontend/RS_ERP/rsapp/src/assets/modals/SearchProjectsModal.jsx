import React, { useEffect } from 'react'
import '../css/SearchProjectsModal.css'
import { useDispatch, useSelector } from 'react-redux';
import { selectProjectFromSearch, toggleSearchModal } from '../redux/projectSlice';
import { variables } from '../variables';
import { fetchProjectsList, fetchProjectUnits } from '../projectService';
const SearchProjectsModal = () => {
  const db = useSelector((state) => state.projects);
  const dispatch = useDispatch();
useEffect(() => {
   const fetchData =async  () => { 
    await dispatch(fetchProjectsList());
  }; 
  fetchData(); 
}, []);
const getDataInInputs=async(i)=>{
     await dispatch(selectProjectFromSearch(i));
}
useEffect(() => {
  if (db.searchRowI) {
    dispatch(fetchProjectUnits(db.selectedProjectRowIndex));
    dispatch(toggleSearchModal(false));
  }
}, [db.searchRowI]);

  return (
    
    <div dir='rtl'>
      <div className="modals">
        <div className="modalcnt_s">
            <div className="hdr_s">
                <div className='hrdtitles'>
                      <span 
                      style={{color:'#fff',cursor:'pointer',fontSize:'40px',marginTop:'-10px',marginRight:'15px'}}
                      onClick={()=>dispatch(toggleSearchModal(false))}
                      >&times;</span>
                </div> 
                <h3 className='hds_title'>المشاريع</h3>
        </div>
            <div className="bodys">
                <div className='tbl_ss'>
                    <table className='table table-striped tbl-srch'>
                    <thead>
                        <tr>
                            <th>كود المشروع</th>
                            <th>المشروع</th>
                            <th>النوع</th>
                            <th>الموقع</th>
                            <th>عدد الوحدات</th>
                            <th>الحالة</th>
                            <th>الصورة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {db.projects.length===0 ?<tr><td colSpan={7} className="empty-msg">لا توجد بيانات لعرضها</td></tr>:
                        db.projects.map((projects,i)=>
                        <tr key={i} onClick={()=>getDataInInputs(i)}>
                        <td>{projects.ProjectCode}</td>
                        <td>{projects.ProjectName}</td>
                        <td>{projects.ProjectType}</td>
                        <td>{projects.Location}</td>
                        <td>{projects.TotalUnits}</td>
                        <td>{projects.ProjectStatus}</td>
                       <td>
                                 {variables.URL_IMGP + projects.ProjectImage  ? (
                                 <div style={{width:'50px', height:'50px', margin:'auto'}}> 
                                 <img 
                                   src={variables.URL_IMGP + projects.ProjectImage} 
                                   alt="Project" 
                                     style={{
                                     position:'relative', 
                                     width:'100%', 
                                     height:'100%', 
                                     objectFit:'cover'
                                     }}
                                   />
                                   </div>)
                                   : 
                                 (<div style={{
                                     width:'50px', 
                                     height:'50px', 
                                     margin:'auto', 
                                     background:'#f0f0f0', 
                                     display:'flex', 
                                     alignItems:'center', 
                                     justifyContent:'center',
                                     borderRadius:'4px'
                                   }}>
                                     <span style={{fontSize:'12px', color:'#999'}}>لا توجد صورة</span>
                                   </div>)}
                                 </td>
                        </tr>
                        )
                        }
                        
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="footer_s">
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                    <button 
                    className='btn btn-danger btn_closes'
                    onClick={()=>dispatch(toggleSearchModal(false))}
                    >إغلاق</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SearchProjectsModal;
