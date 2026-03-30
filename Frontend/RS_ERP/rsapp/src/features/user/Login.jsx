import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeftCircle } from 'lucide-react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../services/authService'; 
import { toast } from 'react-toastify';
import { setUserData } from '../../assets/redux/authSlice';

const Login = () => {
  const {user,token,role,userName}=useSelector((state)=>state.auth);
  const {isLoading}=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const navigate=useNavigate();

const handleChangeValues=(e)=>{
  const {name,value}=e.target;
  dispatch(setUserData({[name]:value}));
}

  const handleLogin=async()=>{
        const result=await dispatch(loginUser(user)).unwrap();
        const {token,role}=result;
        if(token){
          sessionStorage.setItem('token',token);
          sessionStorage.setItem('userRole',role);
          toast.success("تم تسجيل الدخول بنجاح! مرحبا بك",{
            theme:"colored",
            position:"top-left"
          })
          navigate('/addprojects');
        }
  }

  return (
    <div className="login-page-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="login-wrapper"
      >
        <div className="login-main-card">
          <div className="login-header">
            <h3 className="login-title">تسجيل الدخول للمنظومة</h3>
           
          </div>

          <div className="login-input-row">
      
            <div className="login-input-group">
              <label className="login-label">
                <Mail size={18}/> البريد الإلكتروني
              </label>
              <input 
                type="email" 
                className="login-control" 
                autoComplete="off"
                name='Email'
                value={user.Email}
                onChange={handleChangeValues}
              />
            </div>

            <div className="login-input-group">
              <label className="login-label">
                <Lock size={18}/> كلمة المرور
              </label>
              <input 
                type="password" 
                className="login-control"
                name='Password'
                value={user.Password}
                onChange={handleChangeValues} 
              />
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
            <button 
              className="login-submit-btn"
              onClick={()=>handleLogin()}
              >
               <LogIn size={22} /> دخول النظام
            </button>
            </div>
          </div>

          <div className="login-footer">
            ليس لديك صلاحية وصول؟ 
            <span 
            className="login-link" 
            onClick={()=>navigate('/register')}
            >طلب إنشاء حساب
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;