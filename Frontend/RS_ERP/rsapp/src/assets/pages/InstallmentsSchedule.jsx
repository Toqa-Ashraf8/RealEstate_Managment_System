import React, { useEffect } from 'react';
import { 
    CalendarDays, DollarSign, User, Printer, Save, Banknote ,ArrowRight 
} from 'lucide-react';
import '../css/InstallmentsSchedule.css';
import { useDispatch, useSelector} from 'react-redux';
import { clearpaymentModal, FillClientData, generateInstallments, getInstallmentIndexRow, saveBookingandInstallment, showPaymentModal } from '../redux/bookingSlice';
import { useNavigate } from 'react-router-dom';
import PaymentTypeModal from '../modals/PaymentTypeModal';
import { toast } from 'react-toastify';

const InstallmentsSchedule = () => {
    const db = useSelector((state) => state.negotiation);
    const db_b = useSelector((state) => state.booking);
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const Clientdata = db.bookingClient;
    const installmentdata=db_b.InstallmentInformation;
  
//-----------------------------------------------------------------------------------
const GetInstallmentRowIndex=(i)=>{
    dispatch(getInstallmentIndexRow(i));
    dispatch(showPaymentModal(true));
    dispatch(clearpaymentModal());
}
const saveAllData=async()=>{
    const bookingclientID=db.bookingClient.ClientID;
    const bookingclientName=db.bookingClient.ClientName;
    const bookingclientProject=db.bookingClient.ProjectName;
    const bookingclientUnit=db.bookingClient.Unit;
    const downpay=db_b.InstallmentInformation.DownPayment;
    const firstinstallmentDate=db_b.InstallmentInformation.FirstInstallmentDate;
    const yearsCount=db_b.InstallmentInformation.InstallmentYears;
    const updatedArray = db_b.InstallmentDetails.map((item) => {
    if (item.Paid === 1) {
    return {
      ...item,
      ...db_b.paymentType
    };
    } 
    else {
    return {
      ...item,
      PaymentType: "",
      CheckImage: ""
    };
   }
 });
    const data={...db_b.bookingClient,DownPayment:downpay,FirstInstallmentDate:firstinstallmentDate,InstallmentYears:yearsCount,
                    ClientID:bookingclientID,ClientName:bookingclientName,
                    ProjectName:bookingclientProject,Unit:bookingclientUnit,installments:updatedArray}
    
          try {
           const result=await dispatch(saveBookingandInstallment(data)).unwrap();
            toast.success("تم الحجز بنجاح!", {
               theme: "colored",
               position: "top-left",
           });
        
       } 
       catch (error) {
           toast.error("حدث خطأ في الاتصال الخادم", {
               theme: "colored",
               position: "top-left",
           });
       }  
}

//-----------------------------------------------------------------------------------
    useEffect(() => {
      
        const FetchClientData = async () => {
            if (Clientdata) {
                await dispatch(FillClientData(Clientdata));
                await dispatch(generateInstallments(installmentdata));
            }
        }
        FetchClientData();
    }, [dispatch, Clientdata,installmentdata]);
//------------------------------------------------------------------------------------
    return (
        <div className="mini_ins_wrapper"> 
        {db_b.paymentModal && <PaymentTypeModal/>}
            {db_b.bookingClients.map((client, index) => (
                <div key={index} className="mini_ins_container">
                    <header className="mini_ins_header">
                        <div className="mini_ins_title_section">  
                            <h1>إدارة تحصيل الأقساط</h1>
                            <p>الوحدة: <mark>{client.Unit}</mark> - مشروع <mark>{client.ProjectName}</mark></p>
                        </div>
                        <div className="mini_ins_actions">
                            <button className="mini_btn secundary" onClick={()=>navigate('/complete_booking')}><ArrowRight  size={16} /> الرجوع لصفحة الحجز</button>
                            <button className="mini_btn btn-info" style={{color:'#fff'}} ><Printer size={16} /> طباعة</button>
                            <button 
                            className="mini_btn btn-success"
                            onClick={()=>saveAllData()}
                            ><Save size={16} /> حفظ التغييرات</button>
                        </div>
                    </header>
                    <div className="mini_ins_summary_strip">
                      
                        <div className="mini_stat_card blue"><User className="card_icon" /><div><span>العميل</span><strong>{client.ClientName}</strong></div></div>
                        <div className="mini_stat_card green"><DollarSign className="card_icon" /><div><span>الإجمالي</span><strong>{client.NegotiationPrice} ج.م</strong></div></div>
                        <div className="mini_stat_card highlight"><CalendarDays className="card_icon" /><div><span>المقدم</span><strong>{db_b.InstallmentInformation.DownPayment} ج.م</strong></div></div>
                    </div>      
                    <div className="mini_table_section">
                        <div className="mini_table_header">
                            <h2>جدول الدفعات ({db_b.InstallmentDetails[0]?.Months || 0} شهر)</h2>
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
                                {db_b.InstallmentDetails.map((item, idx) => (
                                    <div className="mini_trow" key={idx}>
                                        <div className="ins_td muted">{item.InstallmentNumber}</div>
                                        <div className="ins_td">{item.DueDate.split('T')[0]}</div>
                                        <div className="ins_td bold">{item.MonthlyAmount} ج.م</div>
                                        <div className="ins_td">
                                            {item.Paid===0 ? 
                                            (<span className="mini_badge warning">مستحق</span>)
                                            :
                                            (<span className="mini_badge success">تم الدفع</span>)
                                            }
                                        </div>
                                        {item.Paid===0 && 
                                        <div className="ins_td">
                                            <button 
                                            className="pay_btn"
                                            onClick={()=>GetInstallmentRowIndex(idx)}
                                            >
                                                <Banknote size={14} /> دفع
                                            </button>
                                        </div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InstallmentsSchedule;