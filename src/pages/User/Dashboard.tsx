import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import { usePageTitle } from "../../context/PageTitleContext";
import { useCompany } from '../../context/CompanyContext'; // adjust path

export default function Dashboard() {
  const { setTitle } = usePageTitle();
  const companyContext = useCompany();
console.log("CompanyContext", companyContext)
  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);

  return (
    <Layout>
        <div className="p-3">
          <div className="mt-2 text-gray-500">
            <p>
                This page is under the contruction.
            </p>
          </div>
        </div>
    </Layout>
  );
}