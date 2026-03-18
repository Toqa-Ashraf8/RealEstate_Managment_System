import React from 'react'
import '../css/Header.css'
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { Link } from 'react-router-dom';
import { MdOutlineNotifications } from "react-icons/md";

const Header = () => {
  return (
    <div dir='rtl'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
     <div className="container-fluid">
    <Link className="navbar-brand" to="/">
      <span> <MdOutlineRealEstateAgent size={35} color='teal' /> </span>
    </Link>
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
        <li className="nav-item">
          <Link className="nav-link" aria-current="page" to="/">
            الرئيسية
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/addprojects">
            إضافة المشاريع
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/projects">
            عرض المشاريع
          </Link>
        </li>
          <li className="nav-item">
          <Link className="nav-link" to="/addclients">
             العملاء والمهتمين     
          </Link>
        </li>
       <li className="nav-item">
          <Link className="nav-link" to="/negotiation_requests">
           طلبات التفاوض-الشراء
          </Link>
        </li>  
        <li className="nav-item">
          <Link className="nav-link" to="/booking">
              إدارة الحجوزات
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/installments_schedule">
          الأقساط
          </Link>
        </li>
      </ul>
    <div>
      <span><MdOutlineNotifications size={30}/></span>
    </div>
    </div>
  </div>
</nav>

    </div>
  )
}

export default Header
