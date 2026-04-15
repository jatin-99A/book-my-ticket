import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import BookingPage from "./BookingPage";

const Index = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return <BookingPage />;
};

export default Index;
