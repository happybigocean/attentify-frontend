import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface Company {
  id: string;
  name: string;
}

interface CompanyContextType {
  companies: Company[];
  currentCompanyId: string;
  setCompanies: (companies: Company[]) => void;
  setCurrentCompanyId: (id: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) throw new Error("useCompany must be used within CompanyProvider");
  return context;
};

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompanyId, setCurrentCompanyId] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL ?? ""}/company`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const companyList = res.data || [];
        setCompanies(companyList);

        if (companyList.length > 0) {
          // Auto-select first company or add your logic here
          setCurrentCompanyId(companyList[0]._id); // or `.id` if your backend uses that
        } 
      } catch (error) {
        console.error("Failed to fetch companies", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <CompanyContext.Provider value={{ companies, currentCompanyId, setCurrentCompanyId, setCompanies }}>
      {children}
    </CompanyContext.Provider>
  );
};
