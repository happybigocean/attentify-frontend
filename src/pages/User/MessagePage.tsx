import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
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
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";

interface ChatEntry {
  sender: string;
  content: string;
  title?: string;
  timestamp: string;
  channel?: string;
  message_type?: string;
  metadata?: any;
}

interface Message {
  _id: string;
  client_id: string;
  title?: string;
  channel: string;
  status: "solved" | "unsolved";
  archived: boolean;
  trashed: boolean;
  last_updated: string;
  messages: ChatEntry[];
}

type ViewMode = "inbox" | "archived" | "trashed";

const modes: [ViewMode, React.ReactNode][] = [
  ["inbox", <InboxIcon className="w-5 h-5" />],
  ["archived", <ArchiveBoxArrowDownIcon className="w-5 h-5" />],
  ["trashed", <TrashIcon className="w-5 h-5" />],
];

export default function MessagePage() {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { notify } = useNotification();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Message[]>(
        `${import.meta.env.VITE_API_URL || ""}/message`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessages(response.data);
      setTimeout(refreshMessages, 500);
    } catch (error) {
      console.error("Failed to load messages:", error);
      notify("error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const refreshMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        notify("error", "No authentication token found");
        throw new Error("No auth token found");
      }

      const authHeader = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/message/fetch-all`,
        {},
        authHeader
      );

      const response = await axios.get<Message[]>(
        `${import.meta.env.VITE_API_URL || ""}/message`,
        authHeader
      );

      setMessages(response.data);
    } catch (error) {
      console.error("Failed to load messages:", error);
      notify("error", "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = messages
    .filter((msg) => {
      if (viewMode === "inbox") return !msg.archived && !msg.trashed;
      if (viewMode === "archived") return msg.archived;
      if (viewMode === "trashed") return msg.trashed;
      return false;
    })
    .filter((msg) =>
      (msg.title ?? "").toLowerCase().includes(search.toLowerCase())
    );

  const toggleSelectAll = (): void => {
    if (selected.length === filteredMessages.length && filteredMessages.length > 0) {
      setSelected([]);
    } else {
      setSelected(filteredMessages.map((msg) => msg._id));
    }
  };

  const toggleSelect = (id: string): void => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((sid) => sid !== id)
        : [...prevSelected, id]
    );
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  const viewLabel: string =
    viewMode === "archived"
      ? "Archived"
      : viewMode === "trashed"
      ? "Trash"
      : "Inbox";

  return (
    <Layout>
      <div className="p-3">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={onSearchChange}
            className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 absolute top-3 left-4" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-6">
            {modes.map(([mode, icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 text-base ${
                  viewMode === mode
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                type="button"
              >
                {icon} {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-sm">
          <div className="flex items-center gap-6 ms-1">
            <input
              type="checkbox"
              checked={
                selected.length === filteredMessages.length &&
                filteredMessages.length > 0
              }
              onChange={toggleSelectAll}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
              aria-label="Select all messages"
            />
            <ArrowPathIcon
              className={`h-6 w-6 cursor-pointer hover:text-blue-600 ${
                loading ? "animate-spin" : ""
              }`}
              aria-hidden="true"
              onClick={refreshMessages}
            />
            <EllipsisVerticalIcon
              className="h-6 w-6 cursor-pointer hover:text-blue-600"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="bg-white border-x border-b border-gray-200 rounded-sm">
          <table className="min-w-full divide-y divide-gray-200 text-lg">
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td className="p-8 text-gray-400 text-center" colSpan={5}>
                    No {viewLabel.toLowerCase()} emails found.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="hover:bg-gray-50 transition-all border-t border-gray-100"
                  >
                    <td className="px-6 py-4 w-14">
                      <input
                        type="checkbox"
                        checked={selected.includes(msg._id)}
                        onChange={() => toggleSelect(msg._id)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer"
                        aria-label={`Select message ${msg.title ?? msg._id}`}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700 w-1/4">
                      {msg.client_id}
                    </td>
                    <td className="px-6 py-4 w-2/4 text-blue-700 hover:underline">
                      <Link to={`/message/${msg._id}`}>
                        {msg.title ?? "(no subject)"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right w-1/6">
                      {new Date(msg.last_updated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          msg.status === "solved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {msg.status}
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
