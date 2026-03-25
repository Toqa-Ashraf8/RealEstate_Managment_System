import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { variables } from '../variables';
import { updateSelectedProjectCode} from '../redux/projectSlice';
import '../css/ProjectsCard.css';
import { FaMapMarkerAlt, FaBuilding, FaHome, FaStore, FaHospital, FaImage, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchProjectsList } from '../services/projectService.js';

const ProjectsCard = () => {
  const projectState = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  //----------------------------------------------------------------------------------
  useEffect(() => {
    dispatch(fetchProjectsList());
  }, [dispatch]);

  const getProjectIcon = (type) => {
    switch(type) {
      case 'سكني': return <FaHome />;
      case 'تجاري': return <FaStore />;
      case 'إداري': return <FaBuilding />;
      case 'طبي': return <FaHospital />;
      default: return <FaBuilding />;
    }
  };

  return (
    <div className="arch-wrapper page-container" dir="rtl">
      <div className="arch-container ">
        {projectState.projectsList.length === 0 ? (
          <div className="arch-empty animate__animated animate__fadeIn">
            <FaImage size={50} />
            <h3>لا توجد مشاريع متاحة حالياً</h3>
          </div>
        ) : (
          <div className="arch-grid">
            {projectState.projectsList.map((project, i) => (
              <div key={i} 
              className="arch-item animate__animated animate__zoomIn" style={{ animationDelay: `${i * 0.1}s` }}
              onClick={()=>dispatch(updateSelectedProjectCode(i))}
              >
                <div className="arch-card" data-type={project.ProjectType}>
                  
           
                  <div className="arch-visual">
                    {project.ProjectImage ? (
                      <img src={variables.URL_IMGP + project.ProjectImage} className="arch-img" alt={project.ProjectName} />
                    ) : (
                      <div className="arch-img-none"><FaImage size={40} /></div>
                    )}
                    
                  
                    <div className="arch-glass-badge arch-status">{project.ProjectStatus || 'نشط'}</div>
                    <div className="arch-glass-badge arch-icon-type">{getProjectIcon(project.ProjectType)}</div>
                 
                  </div>

                  {/* الجزء السفلي: البيانات */}
                  <div className="arch-body">
                    <span className="arch-type-label">{project.ProjectType}</span>
                    <h4 className="arch-title">{project.ProjectName}</h4>
                    
                    <div className="arch-stats">
                      <div className="arch-stat"><FaMapMarkerAlt className="c-red" /> <span>{project.Location || 'غير محدد'}</span></div>
                      <div className="arch-stat"><FaBuilding className="c-blue" /> <span>{project.TotalUnits || 0} وحدة</span></div>
                    </div>
                    
                    <button 
                    className="arch-btn"
                    onClick={()=>navigate('/units')}
                    >
                      <span>التفاصيل</span>
                      <FaArrowLeft className="arch-btn-icon" />
                    </button>
                  </div>
                  
                  <div className="arch-glow"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsCard;