import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import { usePageTitle } from "../../context/PageTitleContext";

export default function Settings() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Tickets");
  }, [setTitle]);

  return (
    <Layout>
        <div className="p-3">
          <div className="mt-4 text-gray-500">
            <p>This page is under the contruction.</p>
          </div>
        </div>
    </Layout>
  );
}