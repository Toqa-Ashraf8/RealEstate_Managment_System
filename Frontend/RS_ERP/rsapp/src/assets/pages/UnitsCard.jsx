import React, { useEffect } from 'react'
import '../css/UnitsCard.css'
import { useDispatch, useSelector } from 'react-redux'
import { FaRulerCombined, FaTag, FaImage, FaInfoCircle } from 'react-icons/fa';
import { getdtlsByMaster } from '../redux/projectSlice';
import { variables } from '../variables';
import { formatCurrency } from '../helpers'

const UnitsCard = () => {
  const db = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    const Getunits = async () => {
      if (db.fillprojectcode) {
        await dispatch(getdtlsByMaster(db.fillprojectcode));
      }
    }
    Getunits();
  }, [db.fillprojectcode, dispatch]);

 

  return (
    <div className="u-card-wrapper" dir="rtl">
      <div className="u-card-container">
        {db.unitss.length === 0 ? (
          <div className="u-card-empty">
            <FaImage size={40} color="#ccc" />
            <p>لا توجد وحدات متاحة لهذا المشروع حالياً</p>
          </div>
        ) : (
          <div className="u-card-grid">
            {db.unitss.map((unit, index) => (
              <div key={index} className="u-card-item">
                <div className="u-card-header">
                  {unit.unitImage ? (
                    <img src={variables.URL_IMGU + unit.unitImage} alt={unit.unitName} className="u-card-img" />
                  ) : (
                    <div className="u-card-no-img"><FaImage size={24} /></div>
                  )}
                  <div className="u-card-badge">{unit.Floor}</div>
                  
                  
                </div>

                <div className="u-card-info">
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                 <span><h4 className="u-card-title">{unit.unitName}</h4></span> 
                  <div className='u-card-status'>
                    <span>{unit.unitStatus || 'غير محدد'}</span>
                  </div>
                  </div>
                  <div className="u-card-details">
                    <div className="u-card-detail">
                      <FaRulerCombined size={12} />
                      <span>{unit.TotalArea} م²</span>
                    </div>
                    <div className="u-card-detail">
                      <FaTag size={12} />
                      <span>{unit.MeterPrice} ج/م</span>
                    </div>
                  </div>

                  <div className="u-card-price-row">
                    <div className="u-card-price">
                      <span className="price-label">السعر الإجمالي</span>
                      <span className="price-value">{formatCurrency(unit.TotalPrice)} ج</span>
                    </div>
                    <FaInfoCircle className="info-icon" title="تفاصيل أكثر" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UnitsCard;