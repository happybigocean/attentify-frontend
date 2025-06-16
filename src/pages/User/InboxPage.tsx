import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout";
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
      return false;
    })
    .filter((t) => t.subject.toLowerCase().includes(search.toLowerCase()));

  const toggleSelectAll = () => {
    if (selected.length === filteredTickets.length && filteredTickets.length > 0) {
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
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 absolute top-3 left-4" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-6">
            <button
              onClick={() => setViewMode("inbox")}
              className={`flex items-center gap-2 text-base ${
                viewMode === "inbox"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <InboxIcon className="w-5 h-5" />
              Inbox
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={`flex items-center gap-2 text-base ${
                viewMode === "archived"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ArchiveBoxArrowDownIcon className="w-5 h-5" />
              Archived
            </button>
            <button
              onClick={() => setViewMode("trashed")}
              className={`flex items-center gap-2 text-base ${
                viewMode === "trashed"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrashIcon className="w-5 h-5" />
              Trash
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-t-lg">
          <div className="flex items-center gap-6 ms-1">
            <input
              type="checkbox"
              checked={selected.length === filteredTickets.length && filteredTickets.length > 0}
              onChange={toggleSelectAll}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
            />
            <button
              className="hover:text-blue-600 transition-colors"
              title="Refresh"
              onClick={() => {
                // TODO: add refresh logic here
              }}
            >
              <ArrowPathIcon className="h-6 w-6 cursor-pointer" />
            </button>
            <button
              className="hover:text-blue-600 transition-colors"
              title="More options"
            >
              <EllipsisVerticalIcon className="h-6 w-6 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Inbox Table */}
        <div className="bg-white border-x border-b border-gray-200 rounded-b-lg">
          <table className="min-w-full divide-y divide-gray-200 text-lg">
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td className="p-8 text-gray-400 text-center" colSpan={5}>
                    No {viewLabel.toLowerCase()} emails found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 transition-all border-t border-gray-100"
                  >
                    <td className="px-6 py-4 w-14">
                      <input
                        type="checkbox"
                        checked={selected.includes(ticket.id)}
                        onChange={() => toggleSelect(ticket.id)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700 w-1/4">
                      {ticket.from}
                    </td>
                    <td className="px-6 py-4 w-2/4 text-blue-700 hover:underline">
                      <Link to={`/inbox/${ticket.id}`}>{ticket.subject}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right w-1/6">
                      {ticket.receivedAt}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
