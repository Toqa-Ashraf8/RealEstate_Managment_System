import React, { useEffect, useRef } from 'react';
import { 
    Users, 
    User, 
    Eye, 
    Printer, 
    Search, 
    Calendar, 
    Landmark, 
    MoreVertical, 
    ArrowUpDown,
    SquarePen,
    Trash2 
} from 'lucide-react';
import './BookedClients.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
    deleteBookingData, 
    deleteBookingRow,   
    setReservationStatus
} from '../../../assets/redux/bookingSlice';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import BookingsReport from '../../../assets/reports/BookingsReport';
import { changeUnitAvailableStatus } from '../../../services/projectService';
import { 
    fetchAllReservedClients, 
    fetchReservedClientById 
} from '../../../services/bookingService';

const BookedClients = () => {
const {reservedClients}=useSelector((state)=>state.booking);
    const dispatch=useDispatch();
    const navigate=useNavigate();
   
const handlePrint = useReactToPrint({
        contentRef: () => componentRef,
        documentTitle: 'تقرير_حجز_عميل',
});

useEffect(()=>{ 
    dispatch(fetchAllReservedClients());
},[])
const editReservedClients=async(id,index)=>{
    const selectedClient=reservedClients[index];
    localStorage.setItem('activeBookingClient', JSON.stringify(selectedClient));
    await dispatch(fetchReservedClientById(id));
     dispatch(setReservationStatus(1));
    await navigate('/complete_booking?clientId='+id);
}
const printReport = async (index, id) => {
    try {
        await dispatch(fetchReservedClientById(id)).unwrap();
        dispatch(setReservationStatus(1)); 
        handlePrint();  
        navigate('/bookingreport');
        
    } catch (error) {
        console.error("Failed to fetch client details", error);
    }
}

const deleteBooking=async(index)=>{
  const selectedBookingId=reservedClients[index].BookingID;
  const reservedUnitName=reservedClients[index].Unit;
    try {
        const result= await dispatch(deleteBookingData(selectedBookingId)).unwrap();
        if(result.isDeleted){
             toast.success("تم حذف الحجز بنجاح!", {
             theme: "colored",
             position: "top-left",
            }); 
        await dispatch(changeUnitAvailableStatus(reservedUnitName));
        dispatch(deleteBookingRow(index));
        }
       
    } catch (error) {
        toast.error("حدث خطأ في الاتال بالخادم!", {
        theme: "colored",
        position: "top-left",
       });
    }
}
    return (
        <div className="booked_list_wrapper">      
          <div className="booked_list_header">
                <div className="booked_list_title_area">
                    <h2><Users size={24} /> سجل الحجوزات المكتملة</h2>
                    <p>إدارة واستعراض{reservedClients.length}عقد مبرم</p>
                </div>
                <div className="booked_list_search_bar">
                    <Search size={18} />
                    <input type="text" placeholder="بحث سريع عن عميل أو وحدة" />
                </div>
            </div>

            <div className="table_container_premium">
                <table className="booked_table">
                    <thead>
                        <tr>
                            <th>العميل <ArrowUpDown size={14} /></th>
                            <th>المشروع والوحدة</th>
                            <th>قيمة الوحدة</th>
                            <th>قيمة الحجز</th>
                            <th className="text_center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                       {reservedClients.length>0 && 
                        reservedClients.map((client,index)=>
                            <tr key={index}>
                    <td>
                        <div className="user_cell">
                        <div className="user_avatar_mini"><User size={14} /></div>
                            <span>{client.ClientName}</span>
                        </div>
                        </td>
                    <td>
                        <div className="project_cell">
                        <p>{client.ProjectName}</p>
                        <small>وحدة:{client.Unit} </small>
                        </div>
                        </td>
                        <td>
                        <span className="price_tag" style={{color:'#040432'}}>
                            {client.NegotiationPrice}<small>ج.م</small>
                            </span>
                        </td>
                        <td>
                        <span className="price_tag" style={{color:'#040432'}}>
                            {client.ReservationAmount}<small>ج.م</small>
                            </span>
                        </td>
                                    
                        <td>
                        <div className="table_actions">
                        <button 
                            className="action_icon view" 
                            title="تعديل" 
                            onClick={()=>editReservedClients(client.BookingID,index)}>
                            <SquarePen  size={18} color='blue' />
                            </button>
                        <button 
                            className="action_icon view" 
                            title="حذف"
                            onClick={()=>deleteBooking(index)}
                            >
                            <Trash2   size={18} color='red' />
                        </button>
                            <button 
                            className="action_icon view" 
                            title="طباعة"
                            onClick={()=>printReport(index,client.BookingID)}
                            >
                            <Printer  size={18} color='teal' />
                            </button>
                        </div>
                    </td>
                    </tr>
                )}
             </tbody>
             </table>
            </div>  
        </div>
    );
};

export default BookedClients;