import React from 'react';
import { MdClose, MdWarning, MdDelete } from "react-icons/md";
import '../css/DeleteProjectModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { ClearInputs, deleteAll, showDeleteProjectModal } from '../redux/projectSlice';
import { toast } from 'react-toastify';

const DeleteProjectModal = () => {
  const db = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const DeleteAll = async () => {
    await dispatch(deleteAll(db.project.ProjectCode));
    await dispatch(showDeleteProjectModal(false));
    await dispatch(ClearInputs());
    toast.error("تم حذف البيانات !", {
      theme: "colored",
    });
  }

  return (
    <div className="delete-wrapper">
      <div className="delete-card">
        
        <div className="delete-close-btn" onClick={() => dispatch(showDeleteProjectModal(false))}>
          <MdClose />
        </div>

        <div className="delete-content">
          <div className="delete-icon-box">
            <MdWarning />
          </div>
          <h2 className="delete-title">تنبيه الحذف</h2>
          <p className="delete-description">
            هل أنت متأكد من حذف جميع بيانات هذا المشروع؟
            <br />
            <span className="project-id">كود المشروع: {db.project?.ProjectCode}</span>
          </p>
        </div>

        <div className="delete-actions">
           <button className="btn-action btn-yes" onClick={DeleteAll}>
            <MdDelete /> نعم، متأكد
          </button>
          <button className="btn-action btn-no" onClick={() => dispatch(showDeleteProjectModal(false))}>
            لا، إلغاء
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteProjectModal;