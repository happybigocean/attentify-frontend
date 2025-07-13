import React, {useState, useEffect} from "react";
import DOMPurify from "dompurify";
import { formatEmailAddress } from "../utils/formatEmailAddress";

type EmailViewerProps = {
  subject: string;
  from: string;
  to: string;
  date: string;
  htmlBody: string;
  threadId?: string;
  isExpanded?: boolean;
  replyFromParent?: string;
  OnHandleReply?: () => void;
};

const EmailViewer: React.FC<EmailViewerProps> = ({
  subject,
  from,
  to,
  date,
  htmlBody,
  isExpanded,
}) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlBody);

  return (
    <div>
      {!isExpanded && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
          <header>
            <h2 className="text-xl font-bold mb-2">{subject}</h2>
            <div className="flex gap-3 text-sm text-gray-600">
              <div>
                <span className="font-semibold">From:</span>{" "}
                {from}
              </div>
              <div>
                <span className="font-semibold">To:</span>{" "}
                {to}
              </div>
              <div>
                <span className="font-semibold">Date:</span>  {new Date(date).toLocaleString()}
              </div>
            </div>
          </header>
        </div>
      )}
      {isExpanded && (
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
      )}
    </div>
  );
};

export default EmailViewer;