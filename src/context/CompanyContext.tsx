import { createContext, useContext, useState } from "react";
import React from "react";

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

interface CompanyProviderProps {
  children: React.ReactNode;
  initialCompanies?: Company[];
  initialCurrentCompanyId?: string;
}

export const CompanyProvider = ({
  children,
  initialCompanies = [],
  initialCurrentCompanyId = "",
}: CompanyProviderProps) => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [currentCompanyId, setCurrentCompanyId] = useState(initialCurrentCompanyId);

  return (
    <CompanyContext.Provider
      value={{ companies, currentCompanyId, setCurrentCompanyId, setCompanies }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
