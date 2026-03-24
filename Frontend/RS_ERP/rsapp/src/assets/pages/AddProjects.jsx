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
import "../css/AddProjects.css";
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
import UnitModal from "../modals/UnitModal";
import { MdOutlineDomainAdd } from "react-icons/md";
import {
  showDeleteUnitModal,
  toggleDeleteProjectModal,
  toggleSearchModal,
} from "../redux/projectSlice";
import { CiEdit } from "react-icons/ci";
import { variables } from "../variables";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import SearchProjectsModal from "../modals/SearchProjectsModal";
import { formatCurrency } from '../helpers'
import DeleteProjectModal from "../modals/DeleteProjectModal.jsx";
import DeleteUnitRowModal from "../modals/DeleteUnitRowModal.jsx";
import { saveCompleteProject, uploadProjectImage } from "../projectService.js";
const AddProjects = () => {
  const db = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const NameRef = useRef();
  const parms = { ...db.project, units: db.unitss };
  //********************************************************************************* */
  //--------------- Save Image ----------------------------
  const HandleImage = async (e) => {
    const { name } = e.target;
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    const fileName = file.name;
    formData.append("file", file, fileName);
    await dispatch(uploadProjectImage(formData));
    await dispatch(setProjectData({ [name]: fileName }));
  };
  //--------------- HandleChange Master Values  ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProjectData({ [name]: value }));
  };
  //--------------- Clear Master Values  -----------------------------------
  const HandleClear = () => {
    dispatch(resetProjectForm());
    NameRef.current.focus();
  };
 
  //--------------- Save Master--------------------------------------------
  const HandleSave = async () => {
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

  //----------------------Add To Table Button Action----------------------
  const AddToTable = () => {
    dispatch(prepareUnitModal(db.unitsList.length + 1));
    dispatch(toggleUnitModal(true));
    dispatch(setUnitEditingIndex(-1));
  };
  //-----------------------Edit Button Table Action ------------------/
  const EditTblRow = (index) => {
    dispatch(toggleUnitModal(true));
    dispatch(SetRowIndexvalue(index));
  };

  //****************************************************************** */
  return (
    <div className="page-container">
      {db.isUnitModalOpen && <UnitModal />}
      {db.isDeleteUnitModalOpen && <DeleteUnitRowModal/>}
      {db.isDeleteProjectModalOpen && <DeleteProjectModal/>}
      {db.showmdl_s && <SearchProjectsModal />}
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

        <div className="btns_toc_p">
          <span
            className="btn_c"
            title="تنظيف"
            onClick={() => HandleClear()}
          >
            <AiOutlineClear
              size={28}
              color="#14213d"
            />
          </span>
          <span
            className="btn_c"
            title="إضافة جديد"
            onClick={() => HandleClear()}
          >
            <MdOutlineDomainAdd
              size={28}
              color="#4f46e5"
            />
          </span>
          <span
            className="btn_c"
            title="حفظ"
            onClick={() => HandleSave()}
          >
            <RiSave3Fill
              size={28}
              color="#10b981"
            />
          </span>
          <span
            className="btn_c"
            title="حذف"
            onClick={() => dispatch(toggleDeleteProjectModal(true))}
          >
            <RiDeleteBinLine
              size={28}
              color="#ef4444"
            />
          </span>
          <span
            className="btn_c"
            title="بحث"
            onClick={() => dispatch(toggleSearchModal(true))}
          >
            <FaSearch
              size={24}
              color="#3b82f6"
            />
          </span>
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
                    onChange={handleChange}
                    value={db.project.ProjectCode || 0}
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
                    value={db.project.ProjectName || ""}
                    onChange={handleChange}
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
                    value={db.project.ProjectType || ""}
                    onChange={handleChange}
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
                    value={db.project.Location || ""}
                    onChange={handleChange}
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
                    value={db.project.TotalUnits || 0}
                    onChange={handleChange}
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
                    value={db.project.ProjectStatus || ""}
                    onChange={handleChange}
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
                      onChange={HandleImage}
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
                  <img
                    src={
                      variables.URL_IMGP +
                      (db.project.ProjectImage || db.imgName || "")
                    }
                    alt=""
                    className="preview-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="btn_addunits">
          <button
            className="btn btn-primary btn_add_units"
            onClick={() => AddToTable()}
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
              {db.unitss.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="empty-msg"
                  >
                    لا توجد وحدات مضافة حالياً
                  </td>{" "}
                </tr>
              ) : (
                db.unitss.map((unitt, index) => (
                  
                  <tr key={index}>
                    <td>{unitt.serial}</td>
                    <td>{unitt.unitName}</td>
                    <td>{unitt.Floor}</td>
                    <td>{unitt.TotalArea} م²</td>
                    <td>{unitt.MeterPrice} ج</td>
                    <td>{formatCurrency(unitt.TotalPrice)} ج</td>
                    <td>
                      {variables.URL_IMGU && unitt.unitImage ? (
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            margin: "auto",
                          }}
                        >
                          <img
                            src={variables.URL_IMGU + (unitt.unitImage || db.imgName_u)}
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
                        <span>
                          <CiEdit
                            size={25}
                            color="blue"
                            onClick={() => EditTblRow(index)}
                          />
                        </span>
                        <span>
                          <MdDeleteOutline
                            size={25}
                            color="red"
                            onClick={() => dispatch(showDeleteUnitModal(index))}
                          />
                        </span>
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
  );
};

export default AddProjects;
