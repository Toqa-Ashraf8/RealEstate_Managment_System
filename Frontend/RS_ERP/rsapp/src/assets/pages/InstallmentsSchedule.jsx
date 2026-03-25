import React, { useEffect } from 'react';
import { 
    CalendarDays, 
    DollarSign, 
    User, 
    Printer, 
    Save, 
    Banknote ,
    ArrowRight ,
    SquarePen} from 'lucide-react';
import '../css/InstallmentsSchedule.css';
import { useDispatch, useSelector} from 'react-redux';
import { 
    changetoReserved, 
    clearpaymentModal, 
    FillClientData, 
    generateInstallments, 
    openRevertModal, 
    saveBookingandInstallment, 
    setPendingPayment, 
    showPaymentModal, 
} from '../redux/bookingSlice';
import { useNavigate } from 'react-router-dom';
import PaymentTypeModal from '../modals/PaymentTypeModal';
import { toast } from 'react-toastify';
import RevertPaymentModal from '../modals/RevertPaymentModal';
import { MdDeleteOutline } from "react-icons/md";

const InstallmentsSchedule = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const { 
        bookingClient,
        initialClientData, 
        InstallmentInformation, 
        InstallmentDetails, 
        isRevertPaymentModalOpen, 
        paymentModal,
        reserved 
    } = useSelector((state) => state.booking);
//-----------------------------------------------------------------------------------
const payInstallment=(i)=>{
    dispatch(setPendingPayment({ index: i, isEdit: 0 }));
    dispatch(showPaymentModal(true));
    dispatch(clearpaymentModal());
}
const saveAllData=async()=>{
    const data={
        ...initialClientData, 
        ...bookingClient, 
        ...InstallmentInformation, 
        installments:InstallmentDetails.map(item => ({
            ...item,
            Paid: item.Paid ? 1 : 0 ,
            PaymentType: item.PaymentType || "", 
            CheckImage: item.CheckImage || ""
        }))
    }
 
       try {
           const result=await dispatch(saveBookingandInstallment(data)).unwrap();
            toast.success("تم الحجز بنجاح!", {
               theme: "colored",
               position: "top-left",
           });
           await dispatch(changetoReserved(initialClientData));
       } 
       catch (error) {
           toast.error("حدث خطأ في الاتصال الخادم", {
               theme: "colored",
               position: "top-left",
           });
       } 
       if(reserved===0){
        await navigate('/booking');
       }     
        
}

const handleEdit=(i)=>{
     dispatch(setPendingPayment({ index: i, isEdit: 1 }));
     dispatch(showPaymentModal(true));
}
//-----------------------------------------------------------------------------------
    useEffect(() => {
        const FetchClientData = async () => {
         const savedData = localStorage.getItem('activeBookingClient');
            if (savedData && reserved===0 && !bookingClient.ClientID) {
                const parsedData = JSON.parse(savedData);
                await  dispatch(FillClientData(parsedData));
                await dispatch(generateInstallments(InstallmentInformation));
            }
        }
        FetchClientData();
    }, [dispatch, InstallmentInformation]);
//------------------------------------------------------------------------------------

    return (
        <div className="mini_ins_wrapper"> 
        {paymentModal && <PaymentTypeModal/>}
         {isRevertPaymentModalOpen && <RevertPaymentModal/>}
                <div className="mini_ins_container">
                    <header className="mini_ins_header">
                        <div className="mini_ins_title_section">  
                            <h1>إدارة تحصيل الأقساط</h1>
                            <p>الوحدة: <mark>{initialClientData.Unit}</mark> - مشروع <mark>{initialClientData.ProjectName}</mark></p>
                        </div>
                        <div className="mini_ins_actions">
                            <button className="mini_btn secundary" onClick={()=>navigate(-1)}><ArrowRight  size={16} /> الرجوع لصفحة الحجز</button>
                            <button className="mini_btn btn-info" style={{color:'#fff'}} onClick={() => window.print()}><Printer size={16} /> طباعة</button>
                            <button 
                            className="mini_btn btn-success"
                            onClick={()=>saveAllData()}
                            ><Save size={16} /> حفظ التغييرات</button>
                        </div>
                    </header>
                    <div className="mini_ins_summary_strip">
                      
                        <div className="mini_stat_card blue"><User className="card_icon" /><div><span>العميل</span><strong>{initialClientData.ClientName}</strong></div></div>
                        <div className="mini_stat_card green"><DollarSign className="card_icon" /><div><span>الإجمالي</span><strong>{initialClientData.NegotiationPrice} ج.م</strong></div></div>
                        <div className="mini_stat_card highlight"><CalendarDays className="card_icon" /><div><span>المقدم</span><strong>{InstallmentInformation.DownPayment}ج.م</strong></div></div>
                    </div>      
                    <div className="mini_table_section">
                        <div className="mini_table_header">
                            <h2>جدول الدفعات ({InstallmentDetails[0]?.Months || 0} شهر)</h2>
                        </div>
                        <div className="mini_table_box">   
                            <div className="mini_thead sticky_th">
                                <div className="ins_th">رقم</div>
                                <div className="ins_th">التاريخ</div>
                                <div className="ins_th">القيمة</div>
                                <div className="ins_th">الحالة</div>
                                <div className="ins_th">الإجراء</div>
                            </div>                   
                            <div className="mini_tbody scrollable_body">
                            {InstallmentDetails.length===0 ? <div className="empty-msg" style={{textAlign:'center'}}> لا يوجد أقساط لعرضها</div> :
                                InstallmentDetails.map((item, idx) => (
                                    <div className="mini_trow" key={idx}>
                                        <div className="ins_td muted">{item.InstallmentNumber}</div>
                                        <div className="ins_td">{item.DueDate.split('T')[0]}</div>
                                        <div className="ins_td bold">{item.MonthlyAmount} ج.م</div>
                                        <div className="ins_td">
                                            {Number(item.Paid)===0 ? 
                                            (<span className="mini_badge warning">مستحق</span>)
                                            :
                                            (<span className="mini_badge success">تم الدفع</span>)
                                            }
                                        </div>
                                        {Number(item.Paid)===0  ? 
                                        (<div className="ins_td">
                                            <button 
                                            className="pay_btn"
                                            onClick={()=>payInstallment(idx)}>
                                            <Banknote size={14} /> دفع
                                        </button>
                                            
                                        </div>):
                                          <div style={{cursor:'pointer',display:'flex',justifyContent:'center',alignItems:'center',gap:'10px'}}>
                                                 <span>
                                                    <MdDeleteOutline 
                                                    size={22} 
                                                    color='red'
                                                    onClick={()=>dispatch(openRevertModal(idx))}
                                                    />
                                                 </span>
                                                 <span>
                                                    <SquarePen  
                                                    size={20} 
                                                    color='blue'
                                                    onClick={()=>handleEdit(idx)}
                                                    />
                                                 </span>
                                            </div>
                                        }
                                        <div>
                                        </div>
                                    </div>
                                ))}
                              
                            </div>
                             
                        </div>
                        
                    </div>
                </div>
           
        </div>
    );
};

export default InstallmentsSchedule;