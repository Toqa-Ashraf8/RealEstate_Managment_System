import React, { useEffect } from 'react';
import '../css/DashboardPage.css'; 
import ProjectsUnitsBarChart from '../components/ProjectsUnitsBarChart'; 
import DailyBookingChart from '../components/DailyBookingChart'; 
import { useDispatch } from 'react-redux';
import { fetchMonthlyReservations, fetchProjectsUnitsStats } from '../services/dashboardServices';

const DashboardPage = () => {
  const dispatch=useDispatch();
  const stats = [
    { title: "عدد المشاريع", value: "12" },
    { title: "إجمالي العملاء", value: "1,240" },
    { title: "طلبات الشراء", value: "85" },
    { title: "وحدات محجوزة", value: "42" },
    { title: "وحدات متاحة", value: "156" },
  ];

  /* const projectsUnitsData = [45, 80, 20, 55]; 
  const bookingDailyData = [5, 12, 8, 45];  */
useEffect(()=>{
  const fetchData=async()=>{
   await Promise.all([
      dispatch(fetchProjectsUnitsStats()),
      dispatch(fetchMonthlyReservations())
    ]);
  }
  fetchData();
},[dispatch])

  return (
    <div className="dashboard-main-wrapper" dir="rtl">
      
 
      <div className="stats-container">
        {stats.map((item, index) => (
          <div key={index} className="custom-stat-box">
            <span className="box-label">{item.title}</span>
            <h3 className="box-number">{item.value}</h3>
          </div>
        ))}
      </div>

  
      <div className="charts-flex-row">
        
     
        <div className="chart-item-box">
          <div className="chart-inner-card">
            <div className="chart-top-bar">
              <h5 className="chart-main-heading">أكثر المشاريع وحدات</h5>
            </div>
            <div className="chart-visual-area">
              <ProjectsUnitsBarChart />
            </div>
          </div>
        </div>

        {/* الكارت الشمال */}
        <div className="chart-item-box">
          <div className="chart-inner-card">
            <div className="chart-top-bar">
              <h5 className="chart-main-heading">نشاط الحجوزات اليومي</h5>
            </div>
            <div className="chart-visual-area">
              <DailyBookingChart />
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default DashboardPage;