import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import { useUser } from "../../context/UserContext";
import { useCompany } from "../../context/CompanyContext"; 

type JwtPayload = {
  sub: string;
  user_id: string;
  name: string,
  email: string,
  company_id: string,
  role: string,
  status: string,
  companies: any,
};

const OAuthCallbackLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { setCompanies, setCurrentCompanyId } = useCompany();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      const decoded = jwtDecode<JwtPayload>(token);
      const user = {
        id: decoded.user_id,
        name: decoded.name,
        email: decoded.email,
        company_id: decoded?.company_id || "",
        role: decoded.role,
        status: decoded?.status || "",
        companies: decoded?.companies || []
      }

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      if (user.companies?.length) {
        setCompanies(user.companies);
        setCurrentCompanyId(user.company_id); // default company from login
      }

      let redirectPath = "/dashboard";
      switch (user.role) {
        case "admin":
          redirectPath = "/admin/dashboard";
          break;
        case "company_owner":
          redirectPath = "/dashboard";
          break;
        case "store_owner":
          redirectPath = "/dashboard";
          break;
        case "agent":
          redirectPath = "/dashboard";
          break;
        case "readonly":
          redirectPath = "/dashboard";
          break;
        default:
          redirectPath = "/dashboard";
      }

      setTimeout(() => navigate(redirectPath), 1000); // redirect after short delay
    }
  }, [navigate]);

  return <p>Loading...</p>;
};

export default OAuthCallbackLogin;
