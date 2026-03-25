import React from 'react';
import { MdClose, MdWarning, MdDelete } from "react-icons/md";
import '../css/ProjectDeleteModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { resetProjectForm, toggleDeleteProjectModal } from '../redux/projectSlice.js';
import { toast } from 'react-toastify';
import { deleteProject } from '../services/projectService.js';

const ProjectDeleteModal = () => {
  const {project} = useSelector((state) => state.projects);
  const {isLoading}=useSelector((state)=>state.ui);
  const dispatch = useDispatch();

  const deleteForm = async () => {
    await dispatch(deleteProject(project.ProjectCode));
    await dispatch(toggleDeleteProjectModal(false));
    await dispatch(resetProjectForm());
    toast.error("تم حذف البيانات !", {
      theme: "colored",
    });
  }

  return (
    <div className="delete-wrapper">
      <div className="delete-card">
        <button 
        className="delete-close-btn" 
        disabled={isLoading}
        onClick={() => dispatch(toggleDeleteProjectModal(false))}>
        <MdClose />
        </button>

        <div className="delete-content">
          <div className="delete-icon-box">
            <MdWarning />
          </div>
          <h2 className="delete-title">تنبيه الحذف</h2>
          <p className="delete-description">
            هل أنت متأكد من حذف جميع بيانات هذا المشروع؟
            <br />
            <span className="project-id">كود المشروع: {project?.ProjectCode}</span>
          </p>
        </div>

        <div className="delete-actions">
           <button 
           className="btn-action btn-yes-p" 
           disabled={isLoading}
           onClick={()=>deleteForm()}>
            <MdDelete /> نعم، متأكد
          </button>
          <button 
          className="btn-action btn-no" 
          disabled={isLoading}
          onClick={() => dispatch(toggleDeleteProjectModal(false))}>
            لا، إلغاء
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectDeleteModal;