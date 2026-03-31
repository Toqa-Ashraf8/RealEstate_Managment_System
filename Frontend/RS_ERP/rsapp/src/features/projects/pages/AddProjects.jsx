import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Hash,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import "./AddProjects.css";
import { AiOutlineClear } from "react-icons/ai";
import {
  MdCleaningServices,
  MdAdd,
  MdOutlineLocalPrintshop,
  MdOutlineAddCircleOutline,
  MdDeleteOutline,
} from "react-icons/md";
import { RiSave3Fill, RiDeleteBinLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDomainAdd } from "react-icons/md";
import {
  prepareUnitModal,
  resetProjectForm,
  setProjectData,
  SetRowIndexvalue,
  setUnitEditingIndex,
  showDeleteUnitModal,
  toggleDeleteProjectModal,
  toggleSearchModal,
  toggleUnitModal,
} from "../../../assets/redux/projectSlice.js"; 
import { CiEdit } from "react-icons/ci";
import { variables } from "../../../assets/variables.js"; 
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../assets/helpers.js";
import UnitDeleteModal from "../../units/UnitDeleteModal.jsx";
import UnitModal from "../../units/UnitModal.jsx";
import SearchProjectsModal from "../modals/SearchProjectsModal.jsx";
import ProjectDeleteModal from "../modals/ProjectDeleteModal.jsx";
import { saveCompleteProject ,uploadProjectImage} from "../../../services/projectService.js";

const AddProjects = () => {
  const {
    project,
    isUnitModalOpen,
    unitsList,
    isDeleteUnitModalOpen,
    isDeleteProjectModalOpen,
    isSearchModalOpen,
    projectImageName,
    unitImageName
  } = useSelector((state) => state.projects);
  const { isLoading } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const NameRef = useRef();
 
  const handleImageUpload = async (e) => {
    const { name } = e.target;
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    const fileName = file.name;
    formData.append("file", file, fileName);
    await dispatch(uploadProjectImage(formData));
    await dispatch(setProjectData({ [name]: fileName }));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProjectData({ [name]: value }));
  };
  
  const handleResetForm = () => {
    dispatch(resetProjectForm());
    NameRef.current.focus();
  };
  
  const handleSaveProject = async () => {
     const parms = { ...project, units:unitsList.map(item=>({...item,ReservedStatus:0}))};
     console.log("parms",parms);
     try {
      const result = await dispatch(saveCompleteProject(parms)).unwrap();
      if (result.errorOccured) {
        toast.error("أدخل بيانات لإتمام عملية الحفظ!", {
          theme: "colored",
          position: "top-left",
        });
      } else {
        toast.success("تم الحفظ بنجاح!", {
          theme: "colored",
          position: "top-left",
        });
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال بالخادم", {
        theme: "colored",
        position: "top-left",
      });
    } 
  };

  const handleOpenUnitModal = () => {
    dispatch(prepareUnitModal(unitsList.length + 1));
    dispatch(toggleUnitModal(true));
    dispatch(setUnitEditingIndex(-1));
  };
  
  const handleEditUnit = (index) => {
    dispatch(toggleUnitModal(true));
    dispatch(SetRowIndexvalue(index));
  };

  return (
    <div>
 <div className="btns_toc_p">
          <button 
          className="icon-btn"
          disabled={isLoading}
          onClick={() => handleResetForm()}
           >
          <span className="btn_c" title="تنظيف">
            <AiOutlineClear size={22} color="#14213d" />
           </span>
         </button>
         
          <button 
          className="icon-btn"
          disabled={isLoading}
          onClick={() => handleResetForm()}
           >
           <span className="btn_c" title="إضافة جديد">
             <MdOutlineDomainAdd size={22} color="#4f46e5"/>     
           </span>
         </button>
           
          <button 
          className="icon-btn"
          disabled={isLoading}
           onClick={() => handleSaveProject()}
           >
           <span className="btn_c" title="حفظ">
             <RiSave3Fill size={22} color="#10b981"/>     
           </span>
         </button>
             
          <button 
          className="icon-btn"
          disabled={isLoading}
          onClick={() => dispatch(toggleDeleteProjectModal(true))}
           >
           <span className="btn_c" title="حذف">
             <RiDeleteBinLine size={22} color="#ef4444"/>     
           </span>
         </button>
             
            <button 
            className="icon-btn"
            disabled={isLoading}
            onClick={() => dispatch(toggleSearchModal(true))}
           >
           <span className="btn_c" title="بحث">
             <FaSearch size={22} color="#3b82f6"/>     
           </span>
         </button> 
        </div>


    <div className="page-container">
      {isUnitModalOpen && <UnitModal/>}
      {isDeleteUnitModalOpen && <UnitDeleteModal/>}
      {isDeleteProjectModalOpen && <ProjectDeleteModal/>}
      {isSearchModalOpen && <SearchProjectsModal />}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="add-project-wrapper"
        dir="rtl"
      >
        <div className="form-header">
          <h2 className="p_title">إضافة مشروع عقاري جديد</h2>
        </div>

       
        <div className="container All_cnt">
          <div className="main_cnt">
            <div className="row align-items-start">
              <div className="col-8">
                <div className="input-group-modern data_cnt">
                  <label className="data_lbl">
                    <Hash size={18} /> كود المشروع
                  </label>
                  <input
                    type="text"
                    className="form-control-modern inp_code"
                    name="ProjectCode"
                    onChange={handleInputChange}
                    value={project.ProjectCode || 0}
                    disabled
                  />
                </div>

                <div className="input-group-modern data_cnt">
                  <label className="data_lbl">
                    <Building2 size={18} /> إسم المشروع
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    autoFocus
                    name="ProjectName"
                    value={project.ProjectName || ""}
                    onChange={handleInputChange}
                    ref={NameRef}
                    autoComplete="off"
                  />
                </div>

                <div className="input-group-modern data_cnt">
                  <label className="data_lbl">
                    <Building2 size={18} /> نوع المشروع
                  </label>
                  <select
                    className="form-select-modern"
                    name="ProjectType"
                    value={project.ProjectType || ""}
                    onChange={handleInputChange}
                  >
                    <option value="-1">-- إختر النوع --</option>
                    <option value="تجاري">تجاري</option>
                    <option value="إداري">إداري</option>
                    <option value="طبي">طبي</option>
                    <option value="سكني">سكني</option>
                    <option value="تجاري-إداري">تجاري-إداري</option>
                  </select>
                </div>

                <div className="input-group-modern data_cnt">
                  <label className="data_lbl">
                    <MapPin size={18} /> الموقع الجغرافي
                  </label>
                  <input
                    type="text"
                    className="form-control-modern"
                    name="Location"
                    value={project.Location || ""}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                <div className="input-group-modern data_cnt">
                  <label className="data_lbl">
                    <Layers size={18} /> إجمالي الوحدات
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="form-control-modern"
                    name="TotalUnits"
                    value={project.TotalUnits || 0}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>

                <div className="input-group-modern data_cnt">
                  <label className="data_lbl">
                    <CheckCircle2 size={18} /> حالة المشروع
                  </label>
                  <select
                    className="form-select-modern"
                    name="ProjectStatus"
                    value={project.ProjectStatus || ""}
                    onChange={handleInputChange}
                  >
                    <option value="-1">-- اختر الحالة --</option>
                    <option value="قيد الإنشاء">قيد الإنشاء</option>
                    <option value="مرحلة التشطيبات">مرحلة التشطيبات</option>
                    <option value="جاهز للاستلام">جاهز للاستلام</option>
                    <option value="قريباً">تم البيع بالكامل</option>
                    <option value="قريباً">قريباً</option>
                  </select>
                </div>

                <div className="input-group-modern data_cnt mb-0">
                  <label className="data_lbl">
                    <ImageIcon size={18} /> صورة المشروع
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      className="form-control-modern"
                      id="project-image"
                      name="ProjectImage"
                      onChange={handleImageUpload}
                    />
                    <div className="custom-file-label">
                      <span>اضغط لرفع صورة المشروع</span>
                      <ImageIcon size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="img_cnt">
                {(() => {
                const imgName = projectImageName || project?.ProjectImage;
                  if (imgName && imgName !== "null") {
                   return (
                    <img 
                     src={`${variables.PROJECT_IMAGES_URL}/${imgName}`} 
                     className="preview-img"
                     alt="" 
                    />
                    );
                   } else {
                     return (
                        <div className="final_empty_msg_p">
                        <ImageIcon size={40} className="final_icon_fade" />
                         <p>معاينة المشروع</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="btn_addunits">
          <button
            className="btn btn-primary btn_add_units"
             disabled={isLoading}
            onClick={() => handleOpenUnitModal()}
          >
            <MdAdd size={20} /> إضافة وحدات للمشروع
          </button>
        </div>

        <div className="tbl_units">
          <table className="table table-striped tbl_u">
            <thead>
              <tr>
                <th>كود</th>
                <th>الوحدة</th>
                <th>الدور</th>
                <th>المساحة الكلية</th>
                <th>سعر المتر</th>
                <th>سعر الوحدة</th>
                <th>صورة الوحدة</th>
                <th>الأحداث</th>
              </tr>
            </thead>
            <tbody>
              {unitsList.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="empty-msg"
                  >
                    لا توجد وحدات مضافة حالياً
                  </td>{" "}
                </tr>
              ) : (
                unitsList.map((unit, index) => (    
                  <tr key={index}>
                    <td>{unit.serial}</td>
                    <td>{unit.unitName}</td>
                    <td>{unit.Floor}</td>
                    <td>{unit.TotalArea} م²</td>
                    <td>{unit.MeterPrice} ج</td>
                    <td>{formatCurrency(unit.TotalPrice)} ج</td>
                    <td>
                      {variables.UNIT_IMAGES_URL && unit.unitImage ? (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            margin: "auto",
                          }}
                        >
                          <img
                            src={variables.UNIT_IMAGES_URL + (unit.unitImage || unitImageName)}
                            alt="Unit"
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ) : (
                      
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            margin: "auto",
                            background: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          <span style={{ fontSize: "12px", color: "#999" }}>
                            لا توجد صورة
                          </span>
                        </div> 
                    )}
                    </td>
                    <td>
                      <div className="btns_dtls">
                       <button 
                          className="icon-btn"
                          disabled={isLoading}
                          onClick={() => handleEditUnit(index)}
                          >
                       <CiEdit size={25} color="blue" />
                      </button>
                      <button 
                          className="icon-btn"
                          disabled={isLoading} 
                          onClick={() => dispatch(showDeleteUnitModal(index))}
                        > 
                          <MdDeleteOutline size={25} color="red" />                            
                       </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default AddProjects;
