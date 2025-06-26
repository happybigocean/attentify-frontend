import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/User/Dashboard";
import MessagePage from "./pages/User/MessagePage";
import MessageDetailPage from "./pages/User/MessageDetailPage";
import Settings from "./pages/User/Settings";
import ProtectedRoute from './routes/ProtectedRoute';
import AccountsPage from "./pages/User/AccountsPage";
import ShopifyPage from "./pages/User/ShopifyPage";
import ShopifySuccess from "./pages/User/ShopifySuccess";
import "./App.css";

function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <MessagePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/message/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <MessageDetailPage  />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <AccountsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shopify"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <ShopifyPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shopify/success"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <ShopifySuccess />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
