import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User,  CreditCard,  Phone,  MapPin,  FilePenLine ,CircleDollarSign,Building2, BriefcaseBusiness , Calendar,Image as ImageIcon, CheckCircle,  FileText, Hash,  Activity ,  Banknote } from 'lucide-react';
import '../css/CompleteBooking.css';
import { RiSave3Fill } from "react-icons/ri";
import { AiOutlineClear } from "react-icons/ai";
import { FiPrinter } from "react-icons/fi";
import { caluclateDownPayment,  ChangevaluesOfBookingClient,  clearInputs,  FillClientData, generateInstallments, getInstallmentData, saveBookingandInstallment, saveChecksImages, saveNationalidImage} from '../redux/bookingSlice';
import { variables } from '../variables';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const CompleteBooking = () => {
    const db = useSelector((state) => state.negotiation);
    const db_b = useSelector((state) => state.booking);
    const dispatch = useDispatch();
    const focusRef = useRef();
    const Clientdata = db.bookingClient;
    const downPaymentRef=useRef();
    const navigate=useNavigate();
    const obj={...db_b.bookingClient,...db_b.InstallmentInformation}
   
//************************************************************************ 
const HandleChange=(e)=>{
    const {name,value}=e.target;
    dispatch(ChangevaluesOfBookingClient({[name]:value}));
}
//************************************************************************ 
const ClearValues=()=>{
    dispatch(clearInputs());
    focusRef.current.focus();
}
const HandleChangeinstallmentValues=(e)=>{
    const {name,value}=e.target;
   dispatch(getInstallmentData({[name]:value}));
}
//************************************************************************
 const handleFileChange =async (e) => {
       const { name } = e.target;
        if (!e.target.files || e.target.files.length === 0) return; 
        if(e.target.name==='NationalIdImagePath'){
            const file = e.target.files[0];
            const formData = new FormData();
            const fileName = file.name;
            formData.append("formFile", file, fileName);    
           await  dispatch(saveNationalidImage(formData));
           await  dispatch(ChangevaluesOfBookingClient({[name]:fileName}));         
        }
        if(e.target.name==='CheckImagePath'){
                const file2 = e.target.files[0];
                const formData_ = new FormData();
                const fileName_ = file2.name;
                formData_.append("file_c", file2, fileName_);    
              await dispatch(saveChecksImages(formData_));
              await dispatch(ChangevaluesOfBookingClient({[name]:fileName_})); 
        }
    
};
//*******************************************************************************
const SavedData=async()=>{
    const client_id=Clientdata.ClientID;
    const client_name=Clientdata.ClientName;
    const project_name=Clientdata.ProjectName;
    const unit=Clientdata.Unit;
    const parms={...db_b.bookingClient,...db_b.InstallmentInformation,ClientID:client_id,ClientName:client_name,ProjectName:project_name,Unit:unit,installments:[]};
    try {
        const result=await dispatch(saveBookingandInstallment(parms)).unwrap();
        if(result.saved===true){
         toast.success("تم الحجز بنجاح!", {
            theme: "colored",
            position: "top-left",
        });
    } 
    } catch (error) {
         toast.error("حدث خطأ في الاتصال بالخادم!", {
            theme: "colored",
            position: "top-left",
        });
    }
   
}
//*******************************************************************************
    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
        const FetchClientData = async () => {
            await dispatch(FillClientData(Clientdata));
            
        }
        FetchClientData();
    }, [dispatch, Clientdata]);
//***********************************************************************************
const calcutlateDownpayment=()=>{
    const totalamount=db_b.bookingClients[0].NegotiationPrice;
   dispatch(caluclateDownPayment(totalamount));

}
//***********************************************************************************
const createInstallments=()=>{
    if(db_b.InstallmentInformation.DownPayment!=="" &&
       db_b.InstallmentInformation.FirstInstallmentDate!=="" &&
       db_b.bookingClient.ReservationAmount !=""){
         dispatch(generateInstallments(db_b.InstallmentInformation))
         navigate('/installments_schedule');
    }
    else{
        toast.error(" أكمل إدخال البيانات لإنشاء جدول الأقساط!", {
            theme: "colored",
            position: "top-left",
        });
    }
}
//***********************************************************************************
    return (
        <div className="final_page_wrapper">
            <div className="final_booking_container">
                <div className="final_header_area">
                    <h2 className="final_main_title">استكمال بيانات الحجز والأقساط</h2>
                </div>
              
                <div className="final_content_box animate__animated animate__fadeIn">
                    <form className="final_form_body">
                        
                           {db_b.bookingClients.map((client, index) => (
                                <div className="row mb-4" key={index}>
                                    <div className="col-md-4">
                                        <div className="final_field_group">
                                             <input type="text" value={client.ClientID} hidden className="final_input_modern final_disabled" />
                                            <label className="final_label"><User size={18} /> إسم العميل</label>
                                            <input type="text" value={client.ClientName} readOnly className="final_input_modern final_disabled" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="final_field_group">
                                            <label className="final_label"><Building2 size={18} /> المشروع</label>
                                            <input type="text" value={client.ProjectName} readOnly className="final_input_modern final_disabled" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="final_field_group">
                                            <label className="final_label"><Activity size={18} /> الوحدة</label>
                                            <input type="text" value={client.Unit} readOnly className="final_input_modern final_disabled" />
                                        </div>
                                    </div>
                                </div>
  

                            ))}
                        <hr className="final_divider" />

                        <div className="row mt-4">
                            <div className="col-lg-8">
                                <div className="final_field_group mt-3">
                                    <label className="final_label"><Hash size={18} />كود الحجز</label>
                                    <div className="final_upload_btn">
                                        <input 
                                        type="text" 
                                        className="final_input_modern final_disabled" 
                                        name='BookingID'
                                        readOnly
                                        value={db_b.bookingClient.BookingID || 0}
                                        onChange={HandleChange}
                                        />
                                    </div>
                                </div>

                                <div className="final_field_group">
                                    <label className="final_label"><CreditCard size={18} /> رقم البطاقة</label>
                                    <input
                                        type="text"
                                        name="NationalID"
                                        className="final_input_modern"
                                        ref={focusRef}
                                        value={db_b.bookingClient.NationalID || ""}
                                        onChange={HandleChange}
                                    />
                                </div>

                                <div className="final_field_group mt-3">
                                    <label className="final_label"><ImageIcon size={18} /> صورة البطاقة</label>
                                    <div className="final_upload_btn">
                                        <input type="file" name='NationalIdImagePath' onChange={handleFileChange} />
                                        <div className="final_upload_label">
                                            <span>إضغط لرفع صورة البطاقة الشخصية</span>
                                            <ImageIcon size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="final_field_group mt-3">
                                    <label className="final_label"><Phone size={18} /> تليفون إضافي</label>
                                    <input 
                                    type="text" 
                                    name="SecondaryPhone" 
                                    className="final_input_modern"
                                    value={db_b.bookingClient.SecondaryPhone || ""}
                                    onChange={HandleChange}
                                    />
                                </div>
                                <div className="final_field_group mt-3">
                                    <label className="final_label"><MapPin size={18} /> العنوان بالتفصيل</label>
                                    <input 
                                    type="text" 
                                    name="Address" 
                                    className="final_input_modern"
                                    value={db_b.bookingClient.Address || ""}
                                    onChange={HandleChange}
                                    />
                                </div>
                                 <div className="final_field_group mt-3">
                                    <label className="final_label"><BriefcaseBusiness  size={18} />الوظيفة</label>
                                    <input 
                                    type="text" 
                                    name="Job" 
                                    className="final_input_modern"
                                    value={db_b.bookingClient.Job || ""}
                                    onChange={HandleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="final_image_preview_big">
                                   
                                        <img src={variables.URL_IMGN+db_b.nationalidImage} className="final_img_fluid" alt="" />
                                        <div className="final_empty_msg">
                                            <ImageIcon size={40} className="final_icon_fade" />
                                            <p>معاينة البطاقة</p>
                                        </div>
                                </div>
                            </div>
                        </div>

                        <hr className="final_divider" />

                        <div className="row mt-4">
                            <div className="col-lg-8">
                                 <div className="final_field_group mt-3">
                                    <label className="final_label"><CircleDollarSign  size={18} />مبلغ الحجز</label>
                                    <input
                                        type="text"
                                        name="ReservationAmount"
                                        className="final_input_modern"
                                        value={db_b.bookingClient.ReservationAmount || ""} 
                                        onBlur={()=>calcutlateDownpayment()}
                                        onChange={HandleChange}
                                        
                                    />
                                </div>
                                <div className="final_field_group mt-3">
                                    <label className="final_label"><CircleDollarSign  size={18} />المقدم (25%)</label>
                                    <input
                                        type="text"
                                        name="DownPayment"
                                        className="final_input_modern"
                                        disabled
                                        ref={downPaymentRef}
                                        value={db_b.InstallmentInformation.DownPayment || ""}
                                        onChange={HandleChangeinstallmentValues}
                                    />
                                </div>

                                <div className="final_field_group mt-3">
                                    <label className="final_label"><Calendar size={18} /> تاريخ أول قسط</label>
                                    <input
                                        type="date"
                                        name="FirstInstallmentDate"
                                        className="final_input_modern"
                                        value={db_b.InstallmentInformation.FirstInstallmentDate || ""}
                                        onChange={HandleChangeinstallmentValues}
                                    />
                                </div>
                                <div className="final_field_group">
                                    <label 
                                    className="final_label"><Banknote  size={18} /> طريقة الدفع</label>
                                    <select 
                                    name="PaymentMethod" 
                                    className="final_select_modern"
                                    value={db_b.bookingClient.PaymentMethod || ""}
                                    onChange={HandleChange}
                                    >
                                        <option value="-1">-إختر-</option>
                                        <option value="كاش">كاش (نقدي)</option>
                                        <option value="شيكات بنكية">شيكات بنكية</option>
                                    </select>
                                </div>
                                 <div className="final_field_group mt-3 animate__animated animate__fadeIn">
                                    <label className="final_label"><FileText size={18} /> إرفاق صورة الشيك</label>
                                    <div className="final_upload_btn">
                                        <input type="file" name='CheckImagePath' onChange={handleFileChange} />
                                        <div className="final_upload_label">
                                            <span>رفع صورة الشيك</span>
                                            <FileText size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="final_field_group mt-3">
                                    <label className="final_label"><Calendar size={18} /> مدة التقسيط (بالسنوات)</label>
                                    
                                    <div className="d-flex gap-2 flex-grow-1">
                                        <select
                                            name="InstallmentYears"
                                            className="final_select_modern"
                                            value={db_b.InstallmentInformation.InstallmentYears||""}
                                            onChange={HandleChangeinstallmentValues}
                                        >
                                            <option value="-1">-إختر السنين-</option>
                                            <option value="1">1 سنة</option>
                                            <option value="3">3 سنوات</option>
                                            <option value="5">5 سنوات</option>
                                            <option value="7">7 سنوات</option>
                                        </select>
                                        {db_b.InstallmentInformation.InstallmentYears !== "-1" && (
                                            <button 
                                            type="button" 
                                            className="mini_btn primary"
                                            onClick={()=>createInstallments()}
                                            >
                                                <CheckCircle size={16} /> إنشاء الأقساط
                                            </button>
                                        )}
                                    </div>
                                </div>
                               
                            </div>
                            <div className="col-lg-4">
                                <div className="final_image_preview_big" style={{ height: '220px' }}>
                                    
                                        <img src={variables.URL_IMGC+db_b.checkImage? variables.URL_IMGC+db_b.checkImage:""} className="final_img_fluid" alt="" />
                                        <div className="final_empty_msg" >
                                            <FileText size={40} className="final_icon_fade" />
                                            <p>معاينة الشيك</p>
                                        </div>
                                    
                                </div>
                            </div>
                        </div>

                       
                    </form>
                </div>

                <div className="final_floating_actions">
                    <div 
                    className="final_circle_btn"
                    title="تنظيف"> <AiOutlineClear size={28} color="#14213d" onClick={()=>ClearValues()} /></div>
                    <div className="final_circle_btn" title="حفظ"><RiSave3Fill size={24} color="#10b981" onClick={()=>SavedData()} /></div>
                     <div className="final_circle_btn" title="جدول الاقساط"><Banknote size={24} color="#1026b9" onClick={()=>navigate('/installments_schedule')}/></div>
                </div>
            </div>
        </div>
    );
};

export default CompleteBooking;