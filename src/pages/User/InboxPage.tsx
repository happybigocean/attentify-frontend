import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EllipsisVerticalIcon,
  ArchiveBoxArrowDownIcon,
  InboxIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Ticket {
  id: string;
  from: string;
  subject: string;
  receivedAt: string;
  status: "solved" | "unsolved";
  archived: boolean;
  trashed: boolean;
}

const dummyTickets: Ticket[] = [
  {
    id: "1",
    from: "orders@shop.com",
    subject: "Refund request for order #12045",
    receivedAt: "Jun 15",
    status: "unsolved",
    archived: false,
    trashed: false,
  },
  {
    id: "2",
    from: "support@client.io",
    subject: "Cancel previous order",
    receivedAt: "Jun 13",
    status: "solved",
    archived: true,
    trashed: false,
  },
  {
    id: "3",
    from: "hello@domain.com",
    subject: "Can you check our delivery update?",
    receivedAt: "Jun 12",
    status: "unsolved",
    archived: false,
    trashed: true,
  },
];

type ViewMode = "inbox" | "archived" | "trashed";

export default function InboxPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("inbox");

  const filteredTickets = dummyTickets
    .filter((t) => {
      if (viewMode === "inbox") return !t.archived && !t.trashed;
      if (viewMode === "archived") return t.archived;
      if (viewMode === "trashed") return t.trashed;
    })
    .filter((t) => t.subject.toLowerCase().includes(search.toLowerCase()));

  const toggleSelectAll = () => {
    if (selected.length === filteredTickets.length) {
      setSelected([]);
    } else {
      setSelected(filteredTickets.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const viewLabel =
    viewMode === "archived"
      ? "Archived"
      : viewMode === "trashed"
      ? "Trash"
      : "Inbox";

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">{viewLabel}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode("inbox")}
              className={`flex items-center gap-1 text-sm ${
                viewMode === "inbox"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <InboxIcon className="w-4 h-4" />
              Inbox
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={`flex items-center gap-1 text-sm ${
                viewMode === "archived"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArchiveBoxArrowDownIcon className="w-4 h-4" />
              Archived
            </button>
            <button
              onClick={() => setViewMode("trashed")}
              className={`flex items-center gap-1 text-sm ${
                viewMode === "trashed"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrashIcon className="w-4 h-4" />
              Trash
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-2.5 left-3" />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-t-lg">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selected.length === filteredTickets.length}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <ArrowPathIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* Inbox Table */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td className="p-6 text-gray-400 text-center" colSpan={5}>
                    No {viewLabel.toLowerCase()} emails found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 transition-all border-t border-gray-100"
                  >
                    <td className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        checked={selected.includes(ticket.id)}
                        onChange={() => toggleSelect(ticket.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700 w-1/4">
                      {ticket.from}
                    </td>
                    <td className="px-4 py-3 w-2/4 text-blue-700 hover:underline">
                      <Link to={`/inbox/${ticket.id}`}>{ticket.subject}</Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right w-1/6">
                      {ticket.receivedAt}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === "solved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
