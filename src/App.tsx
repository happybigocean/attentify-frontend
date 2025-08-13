import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/User/Dashboard";
import MessagePage from "./pages/User/MessagePage";
import MessageDetailPage from "./pages/User/MessageDetailPage";
import Settings from "./pages/User/Settings";
import ProtectedRoute from './routes/ProtectedRoute';
import GmailAccountPage from "./pages/User/GmailAccountPage";
import PhoneAccountPage from "./pages/User/PhoneAccountPage";
import ShopifyPage from "./pages/User/ShopifyPage";
import ShopifySuccess from "./pages/User/ShopifySuccess";
import OrderPage from "./pages/User/OrderPage";
import RegisterCompany from "./pages/User/RegisterCompany";
import InvitationPage from "./pages/User/InvitationPage";
import { UserProvider } from "./context/UserContext";
import { NotificationProvider } from "./context/NotificationContext";
import { CompanyProvider } from "./context/CompanyContext";
import { PageTitleProvider } from "./context/PageTitleContext";

// admin pages
import AdminDashboard from "./pages/Admin/Dashboard";
import UserManagement from "./pages/Admin/UserManagement";
import "./App.css";

function App() {  
  return (
    <NotificationProvider>
      <UserProvider>
        <CompanyProvider>
          <PageTitleProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/user"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/message"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <MessagePage />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/message/:threadId"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <MessageDetailPage  />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/order"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/accounts/gmail"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <GmailAccountPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/accounts/phone"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <PhoneAccountPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/shopify"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <ShopifyPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/shopify/success"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <ShopifySuccess />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <Settings />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/invite"
                  element={
                    <ProtectedRoute allowedRoles={['company_owner', 'store_owner']}>
                      <InvitationPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/register-company"
                  element={
                      <RegisterCompany />
                  }
                />
              </Routes>
            </BrowserRouter>
          </PageTitleProvider>
        </CompanyProvider>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App
