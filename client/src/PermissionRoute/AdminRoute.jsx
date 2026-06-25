import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  
  const { currentUser } = useAuth();

  return currentUser?.isAdmin ? <Outlet /> : <Navigate to="/" />;

}
