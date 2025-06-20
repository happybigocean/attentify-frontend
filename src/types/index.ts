export type ChatEntry = {
  sender: string; // email, phone number, agent id, "system", etc.
  recipient?: string; // for email/SMS, who received the message
  content: string;
  title?: string;
  timestamp: string;
  channel?: "chat" | "sms" | "email" | "voice";
  message_type?: "text" | "html" | "file" | "voice" | "system";
  metadata?: Record<string, any>;
};

export type Message = {
  _id: string;

  // Conversation/thread grouping key (Gmail threadId, SMS conversationId, etc.)
  thread_id?: string;

  // All unique senders/recipients in the conversation
  participants?: string[];

  // For compatibility with chat/SMS legacy logic
  client_id?: string;
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