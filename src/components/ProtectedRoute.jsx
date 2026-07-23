import { Navigate } from "react-router-dom";
import { message } from "antd";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    message.warning("Please login first");

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;