import { useEffect } from "react";
import Layout from "../../layouts/Layout";
import { usePageTitle } from "../../context/PageTitleContext";
import GeneralSettings from "../../components/GeneralSettings";
import TeamMembers from "../../components/TeamMembers";

export default function Settings() {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Company Settings");
  }, [setTitle]);

  return (
    <Layout>
      <div className="px-8 pt-10 max-w-5xl">
        <div className="border border-gray-300 p-8 mb-10">
          <GeneralSettings />
        </div>

        <div className="border border-gray-300 p-8">
          <TeamMembers />
        </div>
      </div>
    </Layout>
  );
}
