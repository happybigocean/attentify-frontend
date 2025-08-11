import { useState, useEffect } from "react";
import { PencilIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useCompany } from "../context/CompanyContext";

export default function GeneralSettings() {
  const { currentCompanyId } = useCompany();

  // Initial states — you can replace with real fetched data or empty strings
  const [companyName, setCompanyName] = useState("Example Company");
  const [siteUrl, setSiteUrl] = useState("https://example.com");
  const [email, setEmail] = useState("contact@example.com");

  // Draft states and edit mode states for each field
  const [companyNameDraft, setCompanyNameDraft] = useState(companyName);
  const [companyNameEdit, setCompanyNameEdit] = useState(false);

  const [siteUrlDraft, setSiteUrlDraft] = useState(siteUrl);
  const [siteUrlEdit, setSiteUrlEdit] = useState(false);

  const [emailDraft, setEmailDraft] = useState(email);
  const [emailEdit, setEmailEdit] = useState(false);

  useEffect(() => {
    if (!currentCompanyId) return;

    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || ""}/company/${currentCompanyId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = response.data;
        console.log(data);
        if (data) {
          setCompanyName(data.name || "Example Company");
          setSiteUrl(data.site_url || "https://example.com");
          setEmail(data.email || "contact@example.com");
        }
      } catch (error) {
        console.error("Error fetching company settings:", error);
      }
    };

    fetchSettings();
  }, [currentCompanyId]);

  // Save function with API call placeholders
  const saveField = async (field: string) => {
    try {
      switch (field) {
        case "companyName":
          // Example API call for updating company name
          await axios.post(
            `${import.meta.env.VITE_API_URL || ""}/company/update-name`,
            { name: companyNameDraft },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setCompanyName(companyNameDraft.trim());
          setCompanyNameEdit(false);
          break;

        case "siteUrl":
          await axios.post(
            `${import.meta.env.VITE_API_URL || ""}/company/update-site-url`,
            { site_url: siteUrlDraft },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setSiteUrl(siteUrlDraft.trim());
          setSiteUrlEdit(false);
          break;

        case "email":
          await axios.post(
            `${import.meta.env.VITE_API_URL || ""}/company/update-email`,
            { email: emailDraft },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          setEmail(emailDraft.trim());
          setEmailEdit(false);
          break;
      }
    } catch (error) {
      console.error(`Failed to save ${field}:`, error);
      alert(`Failed to save ${field}. Please try again.`);
    }
  };

  // Cancel edit handlers
  const cancelEdit = (field: string) => {
    switch (field) {
      case "companyName":
        setCompanyNameDraft(companyName);
        setCompanyNameEdit(false);
        break;
      case "siteUrl":
        setSiteUrlDraft(siteUrl);
        setSiteUrlEdit(false);
        break;
      case "email":
        setEmailDraft(email);
        setEmailEdit(false);
        break;
    }
  };

  // Reusable buttons and icon components
  const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center text-indigo-600 hover:text-indigo-800 focus:outline-none text-sm font-medium"
      aria-label="Edit"
      type="button"
    >
      <PencilIcon className="w-4 h-4 mr-1" />
      Edit
    </button>
  );

  const SaveCancelButtons = ({
    onSave,
    onCancel,
    disableSave,
  }: {
    onSave: () => void;
    onCancel: () => void;
    disableSave?: boolean;
  }) => (
    <div className="flex gap-2">
      <button
        onClick={onSave}
        disabled={disableSave}
        className={`flex items-center text-white text-sm font-medium px-3 py-1 ${
          disableSave
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        } focus:outline-none`}
        type="button"
      >
        <CheckIcon className="w-4 h-4 mr-1" />
        Save Changes
      </button>
      <button
        onClick={onCancel}
        className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
        type="button"
      >
        <XMarkIcon className="w-4 h-4 mr-1" />
        Cancel
      </button>
    </div>
  );

  return (
    <section>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">General</h3>

      {/* Company Name */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4 relative">
        <label
          htmlFor="company-name"
          className="text-lg font-medium text-gray-700 min-w-[100px]"
        >
          Name
        </label>
        <div className="flex-1 w-full max-w-xl">
          <input
            id="company-name"
            type="text"
            className={`border border-gray-300 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !companyNameEdit ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={companyNameEdit ? companyNameDraft : companyName}
            onChange={(e) => setCompanyNameDraft(e.target.value)}
            disabled={!companyNameEdit}
            placeholder="Enter company name"
          />
          <div className="flex justify-end mt-1">
            {!companyNameEdit ? (
              <EditButton onClick={() => setCompanyNameEdit(true)} />
            ) : (
              <SaveCancelButtons
                onSave={() => saveField("companyName")}
                onCancel={() => cancelEdit("companyName")}
                disableSave={!companyNameDraft.trim()}
              />
            )}
          </div>
        </div>
      </div>

      {/* Site URL */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4 relative">
        <label
          htmlFor="site-url"
          className="text-lg font-medium text-gray-700 min-w-[100px]"
        >
          Site URL
        </label>
        <div className="flex-1 w-full max-w-xl">
          <input
            id="site-url"
            type="url"
            className={`border border-gray-300 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !siteUrlEdit ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={siteUrlEdit ? siteUrlDraft : siteUrl}
            onChange={(e) => setSiteUrlDraft(e.target.value)}
            disabled={!siteUrlEdit}
            placeholder="Enter site URL"
          />
          <div className="flex justify-end mt-1">
            {!siteUrlEdit ? (
              <EditButton onClick={() => setSiteUrlEdit(true)} />
            ) : (
              <SaveCancelButtons
                onSave={() => saveField("siteUrl")}
                onCancel={() => cancelEdit("siteUrl")}
                disableSave={!siteUrlDraft.trim()}
              />
            )}
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4 relative">
        <label
          htmlFor="email"
          className="text-lg font-medium text-gray-700 min-w-[100px]"
        >
          Email
          <p className="mt-1 text-xs font-normal text-gray-500 max-w-[250px]">
            Email address for workspace updates, such as system notifications.
          </p>
        </label>
        <div className="flex-1 w-full max-w-xl">
          <input
            id="email"
            type="email"
            className={`border border-gray-300 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !emailEdit ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={emailEdit ? emailDraft : email}
            onChange={(e) => setEmailDraft(e.target.value)}
            disabled={!emailEdit}
            placeholder="Enter email"
          />
          <div className="flex justify-end mt-1">
            {!emailEdit ? (
              <EditButton onClick={() => setEmailEdit(true)} />
            ) : (
              <SaveCancelButtons
                onSave={() => saveField("email")}
                onCancel={() => cancelEdit("email")}
                disableSave={!emailDraft.trim()}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
