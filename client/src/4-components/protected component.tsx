import { Navigate} from "react-router-dom";
import { useAuth, type Role } from "../2-context/authContext";


interface ProtectionProps {
  userRole: Role,
  children: React.ReactNode,
  path: string
}

export function AuthProtection({ userRole, path, children }: ProtectionProps) {
  const { isAuth, role } = useAuth();

  if (!isAuth) {
    return <Navigate to={path} replace />;
  }

  if (userRole !== role) {
    if (userRole === 'Admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}