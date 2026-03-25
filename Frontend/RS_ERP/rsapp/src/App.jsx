import './App.css'
import 'animate.css';
import { Routes,Route }from 'react-router-dom'
import Header from './assets/nav/Header'
import AddProjects from './assets/pages/AddProjects'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectsCard from './assets/pages/ProjectsCard'
import NegotiationRequests from './assets/pages/NegotiationRequests'
import RejectedNegotiations from './assets/pages/RejectedNegotiations';
import AcceptedNegotiations from './assets/pages/AcceptedNegotiations';
import BookingsManager from './assets/pages/BookingsManager';
import UnitsCard from './assets/pages/UnitsCard';
import AddClients from './assets/pages/AddClients';
import CompleteBooking from './assets/pages/CompleteBooking';
import InstallmentsSchedule from './assets/pages/InstallmentsSchedule';
import BookedClients from './assets/pages/BookedClients';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {clearGlobalError} from './assets/redux/uiSlice'

function App() {
const dispatch = useDispatch();
const { isLoading, globalError, globalMessage } = useSelector((state) => state.ui);

useEffect(() => {
    if (globalError) {
      toast.error(globalMessage || "حدث خطأ في السيرفر");
      dispatch(clearGlobalError());
    }
  }, [globalError, globalMessage, dispatch]);

  return (
    <>
      <ToastContainer 
        position="top-left" 
        autoClose={3000} 
        rtl={true} 
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    <Header/>
      <Routes>
              <Route path="/addprojects" element={<AddProjects/>}/>
              <Route path="/projects" element={<ProjectsCard/>}/>
              <Route path="/units" element={<UnitsCard/>}/>
              <Route path='/addclients' element={<AddClients/>}/> 
              <Route path='/negotiation_requests' element={<NegotiationRequests/>}/>
              <Route path='/booking' element={<BookingsManager/>}/> 
              <Route path='/rejected_negotiations' element={<RejectedNegotiations/>}/> 
              <Route path='/accepted_negotiations' element={<AcceptedNegotiations/>}/>  
              <Route path='/complete_booking' element={<CompleteBooking/>}/>
              <Route path='/installments_schedule' element={<InstallmentsSchedule/>}/>
              <Route path='/booked_clients' element={<BookedClients/>}/>
      </Routes>
    </>
  )
}

export default App
