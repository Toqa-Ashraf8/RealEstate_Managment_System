import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        toast.error("غير مسموح لك بدخول هذه الصفحة!", {
        toastId: "unauthorized_access", 
        position: "top-left",
      });
        return <Navigate to="/projects" replace />;
    }
    return children;
};

export default ProtectedRoute;