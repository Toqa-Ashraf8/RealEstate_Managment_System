import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, UserPlus } from 'lucide-react';
import '../css/Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate=useNavigate();

  return (
    <div className="auth-page-container">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-wrapper"
      >
        <div className="auth-main-card">
          <div className="auth-header">
            <h2 className="auth-title">إنشاء حساب  جديد</h2>
            <p 
            style={{color: '#64748b', fontWeight: 600}}
            >قم بتعبئة البيانات للوصول إلى لوحة تحكم العقارات
            </p>
          </div>

          <form className="auth-form">
            {/* الصف الأول: اسم المستخدم والإيميل */}
            <div className="auth-form-row">
              <div className="auth-input-group">
                <label className="auth-label"><User size={18}/> اسم المستخدم</label>
                <input type="text" className="auth-control"  />
              </div>
              <div className="auth-input-group">
                <label className="auth-label"><Mail size={18}/>  البريد الالكتروني</label>
                <input type="email" className="auth-control"  />
              </div>
            </div>

            {/* الصف الثاني: كلمة المرور وتأكيدها */}
            <div className="auth-form-row">
              <div className="auth-input-group">
                <label className="auth-label"><Lock size={18}/> كلمة السر</label>
                <input type="password" className="auth-control" />
              </div>
              <div className="auth-input-group">
                <label className="auth-label"><ShieldCheck size={18}/> تأكيد كلمة السر</label>
                <input type="password" className="auth-control"  />
              </div>
            </div>

           {/*  {/* الصف الثالث: نوع الصلاحية */}
             <div className="auth-form-row">
              <div className="auth-input-group">
                <label className="auth-label"><UserPlus size={18}/> الصلاحية</label>
                <select className="auth-control">
                  <option value="User">موظف (User)</option>
                  <option value="Admin">مدير نظام (Admin)</option>
                </select>
              </div>
            </div> 

            <div style={{display:'flex',justifyContent:'center',marginTop:'-15px',marginRight:'50px'}}>
            <button type="submit" className="auth-submit-btn">
                   تسجيل الحساب في المنظومة
            </button>
            </div>
            
          </form>

          <div className="auth-footer">
            لديك حساب مفعل؟ 
            <span className="auth-link" onClick={()=>navigate('/login')}>دخول النظام</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;