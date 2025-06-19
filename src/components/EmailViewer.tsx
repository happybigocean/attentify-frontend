import React from "react";
import DOMPurify from "dompurify";
import { formatEmailAddress } from "../utils/formatEmailAddress";

type EmailViewerProps = {
  subject: string;
  from: string;
  to: string;
  date: string;
  htmlBody: string;
};

const EmailViewer: React.FC<EmailViewerProps> = ({
  subject,
  from,
  to,
  date,
  htmlBody,
}) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlBody);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
      <header className="mb-4 border-b pb-4">
        <h2 className="text-xl font-bold mb-2">{subject}</h2>
        <div className="flex gap-3 text-sm text-gray-600">
          <div>
            <span className="font-semibold">From:</span>{" "}
            {formatEmailAddress(from)}
          </div>
          <div>
            <span className="font-semibold">To:</span>{" "}
            {formatEmailAddress(to)}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {new Date(date).toLocaleString()}
          </div>
        </div>
      </header>
      <section className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </section>
    </div>
  );
};

export default EmailViewer;