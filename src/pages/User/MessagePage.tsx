import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Layout from "../../layouts/Layout";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArchiveBoxArrowDownIcon,
  InboxIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import { usePageTitle } from "../../context/PageTitleContext";
import { useCompany } from "../../context/CompanyContext";

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
  status: string;
  archived: boolean;
  trashed: boolean;
  last_updated: string;
  messages: ChatEntry[];
  assigned_to?: Member | null;
}

type ViewMode = "inbox" | "archived" | "trashed";

const modes: [ViewMode, React.ReactNode][] = [
  ["inbox", <InboxIcon className="w-5 h-5" key="inbox" />],
  ["archived", <ArchiveBoxArrowDownIcon className="w-5 h-5" key="archived" />],
  ["trashed", <TrashIcon className="w-5 h-5" key="trashed" />],
];

interface Member {
  id: string;
  name: string;
  email: string;
}

const statusList = [
  "Open",
  "Assigned",
  "In Progress",
  "Pending",
  "Resolved",
  "Escalated",
  "Awaiting Approval",
  "Canceled",
];

export default function MessagePage() {
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Track menu state for assign and status per message
  const [assignMenuId, setAssignMenuId] = useState<string | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const { currentCompanyId } = useCompany();
  const { notify } = useNotification();
  const { setTitle } = usePageTitle();
  const menuRef = useRef<HTMLDivElement>(null);

  // For local assignment simulation
  const [assignedMap, setAssignedMap] = useState<Record<string, Member | null>>({});

  useEffect(() => {
    if (!currentCompanyId) return;

    const fetchMembers = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || ""}/company/${currentCompanyId}/members`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = response.data;
      if (data) {
        setMembers(data || []);
      }
    };
    fetchMembers();
  }, [currentCompanyId]);

  useEffect(() => {
    setTitle("Messages");
  }, [setTitle]);

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
      //setTimeout(refreshMessages, 500);
      // initialize assignedMap if messages contain assigned_to
      const assignedObj: Record<string, Member | null> = {};
      response.data.forEach(msg => {
        assignedObj[msg._id] = msg.assigned_to || null;
      });
      setAssignedMap(assignedObj);
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
      // initialize assignedMap if messages contain assigned_to
      const assignedObj: Record<string, Member | null> = {};
      response.data.forEach(msg => {
        assignedObj[msg._id] = msg.assigned_to || null;
      });
      setAssignedMap(assignedObj);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setAssignMenuId(null);
        setStatusMenuId(null);
      }
    }
    if (assignMenuId || statusMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [assignMenuId, statusMenuId]);

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

  const handleAssignMenuOpen = (id: string) => {
    setAssignMenuId(id === assignMenuId ? null : id);
    setStatusMenuId(null);
    setMemberSearch("");
  };

  const handleStatusMenuOpen = (id: string) => {
    setStatusMenuId(id === statusMenuId ? null : id);
    setAssignMenuId(null);
  };

  const handleUserSelect = (user: Member, msg: Message) => {
    // In real app, call API here to assign
    setAssignedMap((prev) => ({
      ...prev,
      [msg._id]: user,
    }));
    notify("success", `Assigned "${msg.title ?? msg._id}" to ${user.name}`);
    setAssignMenuId(null);
  };

  const handleStatusSelect = (status: string, msg: Message) => {
    // In real app, call API here to change status
    setMessages((prev) =>
      prev.map((m) =>
        m._id === msg._id ? { ...m, status } : m
      )
    );
    notify("success", `Status of "${msg.title ?? msg._id}" changed to ${status}`);
    setStatusMenuId(null);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const viewLabel: string =
    viewMode === "archived"
      ? "Archived"
      : viewMode === "trashed"
        ? "Trash"
        : "Inbox";

  // Utility to get member circle
  const AssignedCircle = ({ user }: { user: Member }) => (
    <span
      title={user.name}
      className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-200 text-blue-700 font-bold text-base"
    >
      {user.name.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <Layout>
      <div className="p-4">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={onSearchChange}
            className="w-full px-5 py-3 pl-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
          />
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 absolute top-3 left-4" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-6">
            {modes.map(([mode, icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 text-base ${viewMode === mode
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

        <div className="flex items-center justify-between px-5 py-3 bg-white border border-gray-300">
          <div className="flex items-center gap-6 ms-1">
            <input
              type="checkbox"
              checked={
                selected.length === filteredMessages.length &&
                filteredMessages.length > 0
              }
              onChange={toggleSelectAll}
              className="h-5 w-5 text-blue-600 border-gray-300 cursor-pointer"
              aria-label="Select all messages"
            />
            <ArrowPathIcon
              className={`h-6 w-6 cursor-pointer hover:text-blue-600 ${loading ? "animate-spin" : ""
                }`}
              aria-hidden="true"
              onClick={refreshMessages}
            />
          </div>
        </div>

        <div className="bg-white border-x border-b border-gray-300 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 w-14"></th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Assigned</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right w-1/6">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length === 0 ? (
                <tr>
                  <td className="p-8 text-gray-400 text-center" colSpan={6}>
                    No {viewLabel.toLowerCase()} emails found.
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    className="hover:bg-gray-50 transition-all border-t border-gray-100 relative"
                  >
                    <td className="px-6 py-4 w-14">
                      <input
                        type="checkbox"
                        checked={selected.includes(msg._id)}
                        onChange={() => toggleSelect(msg._id)}
                        className="h-5 w-5 text-blue-600 border-gray-300 cursor-pointer"
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
                    {/* Assigned */}
                    <td className="px-6 py-4 w-32">
                      <button
                        className="flex items-center gap-2 px-2 py-1 bg-gray-100 hover:bg-blue-50 rounded cursor-pointer"
                        onClick={() => handleAssignMenuOpen(msg._id)}
                        type="button"
                      >
                        {assignedMap[msg._id] ? (
                          <>
                            <AssignedCircle user={assignedMap[msg._id]!} />
                            <span className="text-gray-700">{assignedMap[msg._id]!.name.split(" ")[0]}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">Unassigned</span>
                        )}
                      </button>
                      {/* Assign User Menu */}
                      {assignMenuId === msg._id && (
                        <div
                          ref={menuRef}
                          className="absolute z-30 mt-2 w-64 bg-white rounded-md border border-gray-200 shadow-lg"
                        >
                          <div className="flex items-center px-3 py-2 border-b border-gray-200">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <input
                              autoFocus
                              type="text"
                              placeholder="Search users..."
                              value={memberSearch}
                              onChange={e => setMemberSearch(e.target.value)}
                              className="w-full text-sm px-1 py-1 outline-none"
                            />
                            <button
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setAssignMenuId(null)}
                              aria-label="Close"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="max-h-56 overflow-y-auto">
                            {filteredMembers.length === 0 ? (
                              <div className="p-4 text-sm text-gray-400 text-center">
                                No users found.
                              </div>
                            ) : (
                              filteredMembers.map(member => (
                                <button
                                  key={member.id}
                                  className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-blue-50"
                                  onClick={() => handleUserSelect(member, msg)}
                                >
                                  <AssignedCircle user={member} />
                                  <div>
                                    <div className="font-medium text-gray-700">{member.name}</div>
                                    <div className="text-xs text-gray-400">{member.email}</div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4 w-36">
                      <button
                        className={`px-3 py-1 text-xs font-semibold rounded ${msg.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                        onClick={() => handleStatusMenuOpen(msg._id)}
                        type="button"
                      >
                        {msg.status}
                      </button>
                      {/* Status Menu */}
                      {statusMenuId === msg._id && (
                        <div
                          ref={menuRef}
                          className="absolute z-30 mt-2 w-56 bg-white rounded-md border border-gray-200 shadow-lg"
                        >
                          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">Change Status</span>
                            <button
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              onClick={() => setStatusMenuId(null)}
                              aria-label="Close"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div>
                            {statusList.map((status) => (
                              <button
                                key={status}
                                className="block w-full px-4 py-2 text-left hover:bg-blue-50"
                                onClick={() => handleStatusSelect(status, msg)}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 text-right w-1/6">
                      {new Date(msg.last_updated).toLocaleDateString()}
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