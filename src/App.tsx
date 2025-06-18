import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/User/Dashboard";
import MessagePage from "./pages/User/MessagePage";
import MessageDetailPage from "./pages/User/MessageDetailPage";
import Settings from "./pages/User/Settings";
import ProtectedRoute from './routes/ProtectedRoute';
import "./App.css";
import AccountsPage from "./pages/User/AccountsPage";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App
