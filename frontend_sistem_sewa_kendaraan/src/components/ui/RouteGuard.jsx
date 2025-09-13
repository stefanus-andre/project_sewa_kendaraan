// components/RouteGuard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RouteGuard({ children, allowedRoles = [] }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login', { replace: true });
      return;
    }

    const user = JSON.parse(userData);
    
    // Jika ada allowedRoles yang spesifik, cek apakah user role termasuk
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      navigate('/unauthorized', { replace: true });
      return;
    }

  }, [navigate, allowedRoles]);

  return children;
}