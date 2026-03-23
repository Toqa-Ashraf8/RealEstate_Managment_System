import React, { useEffect } from 'react';
import { Users, User, Eye, Printer, Search, Calendar, Landmark, MoreVertical, ArrowUpDown,SquarePen  } from 'lucide-react';
import '../css/BookedClients.css';
import { useDispatch, useSelector } from 'react-redux';
import { getreservedClients, getreservedClientsByID, reservedOrnot } from '../redux/bookingSlice';
import { useNavigate } from 'react-router-dom';

const BookedClients = () => {

    const db_b=useSelector((state)=>state.booking);
    const dispatch=useDispatch();
    const navigate=useNavigate();
//---------------------------------------------------------------------
useEffect(()=>{ 
    dispatch(getreservedClients());
},[db_b.reservedClients])
const editReservedClients=async(id)=>{
    await dispatch(getreservedClientsByID(id));
    await dispatch(reservedOrnot(1));
    await navigate('/complete_booking');
}
//----------------------------------------------------------------------
    return (
        <div className="booked_list_wrapper">
            <div className="booked_list_header">
                <div className="booked_list_title_area">
                    <h2><Users size={24} /> سجل الحجوزات المكتملة</h2>
                    <p>إدارة واستعراض{db_b.reservedClients.length}عقد مبرم</p>
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
                       {db_b.reservedClients.length>0 && 
                       db_b.reservedClients.map((client,index)=>
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
                                    <span className="price_tag" style={{color:'#040432'}}>{client.NegotiationPrice}<small>ج.م</small></span>
                                </td>
                                 <td>
                                    <span className="price_tag" style={{color:'#040432'}}>{client.ReservationAmount}<small>ج.م</small></span>
                                </td>
                               
                               {/*  <td>
                                    <span className="status_chip success">مكتمل</span>
                                </td> */}
                                <td>
                                    <div className="table_actions">
                                        <button className="action_icon view" title="تعديل" onClick={()=>editReservedClients(client.BookingID)}><SquarePen  size={18} color='blue' /></button>
                                        <button className="action_icon print" title="طباعة"><Printer size={18} color='teal' /></button>
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