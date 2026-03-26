import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowLeftCircle } from 'lucide-react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate=useNavigate();

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

          <form className="login-input-row">
            {/* حقل البريد الإلكتروني */}
            <div className="login-input-group">
              <label className="login-label">
                <Mail size={18}/> البريد الإلكتروني
              </label>
              <input 
                name="email"
                type="email" 
                className="login-control" 
                autoComplete="off"
              />
            </div>

            {/* حقل كلمة المرور */}
            <div className="login-input-group">
              <label className="login-label">
                <Lock size={18}/> كلمة المرور
              </label>
              <input 
                name="password"
                type="password" 
                className="login-control" 
              />
            </div>
            <div style={{display:'flex',justifyContent:'center'}}>
            <button type="submit" className="login-submit-btn">
               <LogIn size={22} /> دخول النظام
            </button>
            </div>
          </form>

          <div className="login-footer">
            ليس لديك صلاحية وصول؟ 
            <span className="login-link" onClick={()=>navigate('/register')}>طلب إنشاء حساب</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;