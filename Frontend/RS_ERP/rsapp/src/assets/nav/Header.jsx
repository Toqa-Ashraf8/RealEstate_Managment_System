import React from 'react'
import '../css/Header.css'
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { Link } from 'react-router-dom';
import { MdOutlineNotifications } from "react-icons/md";
import { useSelector } from 'react-redux';
import HeaderActions from './HeaderActions';

const Header = () => {
  const {token ,role}=useSelector((state)=>state.auth);
  if (!token) return null;
  return (
    <div dir='rtl'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
     <div className="container-fluid">
    <div className="navbar-brand" >
      <span> <MdOutlineRealEstateAgent size={35} color='teal' /> </span>
    </div>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        
        
         { role==="Admin" && (
          <li className="nav-item">
          <Link className="nav-link" to="/addprojects">
            إضافة المشاريع
          </Link>
          </li> 
        )}
        <li className="nav-item">
          <Link className="nav-link" to="/projects">
            المشاريع 
          </Link>
        </li>
          <li className="nav-item">
          <Link className="nav-link" to="/addclients">
              إضافة العملاء     
          </Link>
        </li>
        {role==="Admin" && 
          (<li className="nav-item">
          <Link className="nav-link" to="/negotiation_requests">
           طلبات الشراء
          </Link>
          </li>  
          )}
        <li className="nav-item">
          <Link className="nav-link" to="/booking">
              إدارة الحجوزات
          </Link>
        </li>
      </ul>
    {token && <HeaderActions/>}
    </div>
  </div>
</nav>
    </div>
  )
}

export default Header
