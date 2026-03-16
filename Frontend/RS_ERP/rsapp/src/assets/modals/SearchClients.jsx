import React, { useEffect } from 'react'
import '../css/SearchClients.css'
import { useDispatch, useSelector } from 'react-redux';
import { variables } from '../variables';
import { IoMdClose } from "react-icons/io";
import { FillClientsForm, GetAllClients, GetnegotiationsByclient, Getunit, getunitsByproject, ShowsearchcLientsMdl } from '../redux/clientSlice';
const SearchClients = () => {
  const db = useSelector((state) => state.clients);
  const dispatch = useDispatch();
//**************************************************************** */
const HandleSearch= async(i)=>{
    const selectedClient = db.clients[i];
    if (!selectedClient) return;  
    const clientid=selectedClient.ClientID;
    dispatch(FillClientsForm(i));
    console.log(clientid);
   if (clientid) {
        await dispatch(GetnegotiationsByclient(clientid));
    }
}
 useEffect(() => {
    const loadClients = async () => {
      try {
        await dispatch(GetAllClients());
      } 
      catch (error) {
        console.error("فشل في جلب البيانات:", error);
      }
    };
    loadClients();
  }, [dispatch]);
  
  return (
    <div dir='rtl'>
      <div className="modals">
        <div className="modalcnt_s">
            <div className="hdr_s">
                <div className='hrdtitles_s'> 
                      <span 
                      className='close_search'
                      onClick={()=>dispatch(ShowsearchcLientsMdl(false))}
                      ><IoMdClose size={30} /></span>
                </div> 
                <h3 className='hds_title'>العملاء</h3>
        </div>
            <div className="bodys">
                <div className='tbl_ss'>
                    <table className='table table-striped tbl-srch'>
                    <thead>
                        <tr>
                            <th>الكود</th>
                            <th>العميل</th>
                            <th>رقم الموبايل</th>
                            <th>حالة العميل</th>
                            <th>ملاحظات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {db.clients.length===0 ?<tr><td colSpan={7} className="empty-msg">لا توجد بيانات لعرضها</td></tr>:
                        db.clients.map((client,i)=>
                        <tr key={i} onClick={()=>HandleSearch(i)}>
                        <td>{client.ClientID}</td>
                        <td>{client.ClientName}</td>
                        <td>{client.PhoneNumber}</td>
                        <td>{client.ClientStatus}</td>
                        <td>{client.Notes}</td>
                        </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="footer_s">
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                    <button 
                    className='btn btn-danger btn_closes'
                     onClick={()=>dispatch(ShowsearchcLientsMdl(false))}
                    >إغلاق</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default SearchClients;
