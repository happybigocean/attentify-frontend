export type ChatEntry = {
  sender: "client" | "agent" | "system" | "ai";
  content: string;
  title?: string;
  timestamp: string;
  channel?: "chat" | "sms" | "email" | "voice";
  message_type?: "text" | "file" | "voice" | "system";
  metadata?: Record<string, any>;
};

export type Message = {
  _id: string;
  client_id: string;
  agent_id?: string;
  session_id?: string;
  started_at: string;
  last_updated: string;
  status: "open" | "closed" | "pending";
  channel: "chat" | "sms" | "email" | "voice";
  title?: string;
  messages: ChatEntry[];
  ai_summary?: string;
  tags?: string[];
  resolved_by_ai?: boolean;
};