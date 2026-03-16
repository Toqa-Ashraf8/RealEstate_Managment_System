import React, { useEffect, useRef } from "react";
import "../css/AddClients.css";
import { MdCleaningServices, MdAdd ,MdDeleteOutline,MdLastPage,MdFirstPage,MdNavigateNext,MdChevronLeft} from "react-icons/md";
import { RiSave3Fill, RiDeleteBinLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { motion } from "framer-motion";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { AiOutlineUserDelete,AiOutlineUserAdd,AiOutlineClear } from "react-icons/ai";
import { LuUserRoundSearch } from "react-icons/lu"
import {
  User,
  Hash,
  Phone,
  ReceiptText,
  NotebookPen,
  Hourglass,
 Calendar ,
 ArrowRight ,
 ArrowLeft ,
 ArrowBigLeftDash ,
 ArrowBigRightDash 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNegotiation,
  changeclientsVls,
  clearinputs,
  deleteAllData,
  GetAllClients,
  getpriceByunit,
  getprojects,
  getunitsByproject,
  HandleShowModal,
  saveclientsform,
  showNegotiationModal,
  ShowsearchcLientsMdl,
} from "../redux/clientSlice";
import NegotiationModal from "../modals/NegotiationModal";
import {toast}from 'react-toastify'
import SearchClients from "../modals/SearchClients";
import { IoClose } from "react-icons/io5";
import ModalDeleteClients from "../modals/ModalDeleteClients";


const AddClients = () => {
  const db = useSelector((state) => state.clients);
  const dispatch = useDispatch();
  const nameRef = useRef();
  const codeRef = useRef();
  const parms={...db.client,negotiations:db.negotiations}
  //************************************************************** */
  const HandleChange = (e) => {
    const { name, value } = e.target;
    dispatch(changeclientsVls({[name]:value}));
  };
//------------------------------------------------------------------------------------
 const ClearInp = () => {
    dispatch(clearinputs());
    nameRef.current.focus();
    codeRef.current.disabled = false;
 };
//------------------------------------------------------------------------------------
 const AddNew = () => {
    ClearInp();
    codeRef.current.disabled = true;
  };
 //------------------------------------------------------------------------------------
  const AddnegotiationRequest=()=>{
    dispatch(AddNegotiation(db.negotiations.length +1));
      dispatch(getprojects());
  }
//------------------------------------------------------------------------------------
  const SaveForm=async()=>{
  
    try {
         const result = await dispatch(saveclientsform(parms)).unwrap();
           toast.success("تم حفظ البيانات بنجاح ", {
             theme: "colored",
             position: "top-left",
           });
         
       } catch (error) {
         toast.error("حدث خطأ في الاتصال بالخادم", {
           theme: "colored",
           position: "top-center",
         });
       }
  }
  //------------------------------------------------------------------------------------
useEffect(()=>{
    nameRef.current.focus();
},[])
 
 //******************************************************************** */
  return (
    <div
      dir="rtl"
      className="page-container"
    >   
      {db.showNeg && <NegotiationModal/>} 
      {db.showdModal && <ModalDeleteClients/>}
      {db.ShowSearchCLientsMdl && <SearchClients/>}
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
      <div className="crm_header">
        <h2 className="crm_title">إضافة عملاء ومهتمين جدد</h2>
      </div>
      <div className="btns_toc">
        <span
          className="btn_c"
          title="تنظيف"
          onClick={() => ClearInp()}
        >
          <AiOutlineClear
            size={28}
            color="#14213d"
          />
        </span>
        <span
          className="btn_c"
          title="إضافة جديد"
          onClick={() => AddNew()}
        >
          <AiOutlineUserAdd
            size={28}
            color="#4f46e5"
          />
        </span>
        <span
          className="btn_c"
          title="حفظ"
          onClick={()=>SaveForm()}
        >
          <RiSave3Fill
            size={28}
            color="#10b981"
          />
        </span>
        <span
          className="btn_c"
          title="حذف"
          onClick={()=>dispatch(HandleShowModal(true))}
        >
          <AiOutlineUserDelete
            size={28}
            color="#ef4444"
          />
        </span>
        <span
          className="btn_c"
          title="بحث"
           onClick={()=>dispatch(ShowsearchcLientsMdl(true))}
        >
          <LuUserRoundSearch 
            size={24}
            color="#3b82f6"
          />
        </span>
      </div>
    <div className="main_crm">
  <div className="crm_cnt">
    {/* كود العميل */}
    <div className="data_crm">
      <label className="lbl_crm"><Hash size={18} /> كود العميل</label>
      <input type="text" className="crm_inp" name="ClientID" value={db.client.ClientID || 0} onChange={HandleChange} ref={codeRef} />
    </div>

    {/* إسم العميل */}
    <div className="data_crm">
      <label className="lbl_crm"><User size={18} /> إسم العميل</label>
      <input type="text" className="crm_inp" name="ClientName" value={db.client.ClientName || ""} onChange={HandleChange} autoComplete="off" ref={nameRef} />
    </div>

    {/* رقم الموبايل */}
    <div className="data_crm">
      <label className="lbl_crm"><Phone size={18} /> رقم الموبايل</label>
      <input type="text" className="crm_inp" name="PhoneNumber" value={db.client.PhoneNumber || ""} onChange={HandleChange} />
    </div>


    {/* الحالة */}
    <div className="data_crm">
      <label className="lbl_crm"><ReceiptText size={18} /> الحالة</label>
      <select className="crm_select" name="ClientStatus" value={db.client.ClientStatus || ""} onChange={HandleChange}>
        <option value="-1">-إختر-</option>
        <option value="عميل جديد">عميل جديد</option>
        <option value="استفسار">استفسار</option>
        <option value="مهتم">مهتم</option>
        <option value="متابعة">متابعة</option>
      </select>
    </div>

    {/* ملاحظات */}
    <div className="data_crm">
      <label className="lbl_crm"><NotebookPen size={18} /> ملاحظات</label>
      <textarea className="crm_inp crm_notes" name="Notes" value={db.client.Notes || ""} onChange={HandleChange}></textarea>
    </div>
  </div>
</div>


<div className="btns_bottomcrm">
  <div className="btns_actions_left">
    <button className="btn_nego" onClick={() => AddnegotiationRequest()}>طلب تفاوض / شراء</button>
    <button className="btn_clientshow">عرض السجلات</button>
  </div>
  
  <div className="btns_arrows">
    <span className="btn_c" title="السجل الأول"><MdLastPage size={22}/></span>
    <span className="btn_c" title="التالي"><MdNavigateNext size={22}/></span>
    <span className="btn_c" title="السابق"><MdChevronLeft  size={22} /></span>
    <span className="btn_c" title="السجل الأخير"><MdFirstPage size={22} /></span>
  </div>
</div>
      
      {db.negotiations.length>0 && 
      <div className="tbl_negotiation">
        <table className="table table-striped tbl_n">
            <thead>
              <tr>
                <th>كود الطلب</th>
                <th>المشروع</th>
                <th>الوحدة</th>
                <th>السعر الأصلي للوحدة</th>
                <th>سعر التفاوض</th>
                <th>قيمة الخصم</th>
               {db.rowIndex===-1 || db.negotiations ? 
               ( <>  
               <th>حالة الطلب</th>
               <th>تاريخ الطلب</th>
                </>) 
               :""}
                <th className="events_col">الأحداث</th>
              </tr>
            </thead>
            <tbody>
              {db.negotiations.length>0 &&
               db.negotiations.map((neg,index)=>
              <tr key={index}>
                <td>{neg.serialCode}</td>
                <td>{neg.ProjectName}</td>
                <td>{neg.Unit}</td>
                <td>{neg.OriginalPrice} ج</td>
                <td>{neg.NegotiationPrice} ج</td>
                <td>{neg.DiscountAmount} %</td>
              {db.rowIndex === -1 || db.negotiations ? (
          <>
            <td style={{ fontWeight: 'bold' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {neg.NegotiationStatus === 'مقبول' && (
           <span style={{ color: '#2ecc71', display: 'flex', alignItems: 'center' }}>
              {neg.NegotiationStatus} <IoMdCheckmarkCircleOutline size={20} style={{ marginRight: '5px' }} />
           </span>
          )}
         {neg.NegotiationStatus === 'مرفوض' && (
          <span style={{ color: '#e74c3c', display: 'flex', alignItems: 'center'}}>
            {neg.NegotiationStatus} <IoClose size={20} style={{ marginRight: '5px' }} />
          </span>
        )}
        {(neg.NegotiationStatus !== 'مقبول' && neg.NegotiationStatus !== 'مرفوض') && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {neg.NegotiationStatus} <Hourglass size={18} className="hourglass_" style={{ marginRight: '5px' }} />
          </span>
        )}
      </div>
    </td>
    <td>{neg.NegotiationDate ? neg.NegotiationDate.split('T')[0] : ""}</td>
  </>
) : ""}
                <td>
                  <div className="btns_dtls_n">
                    <span><CiEdit size={30} color="blue"/></span>
                    <span><MdDeleteOutline size={30} color="red"/></span>
                  </div>
                </td>
              </tr>
              )}
            </tbody>
        </table>
      </div>
      }
      </motion.div>
    </div>
  );
};

export default AddClients;
