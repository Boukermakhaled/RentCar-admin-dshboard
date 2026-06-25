import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Cars from "./pages/Cars/Cars";
import Orders from "./pages/Orders/Orders";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/dashboard/cars" element={<Cars />} />
            <Route path="/dashboard/orders" element={<Orders />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
