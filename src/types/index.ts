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
  comments?: Comment[];
};

export interface OrderInfo {
  order_id: string;
  type: string;
  status: number;
  msg: string;
  shopify_order?: ShopifyOrder;
};

export interface ShopifyAddress {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  [key: string]: any; // For any additional fields
}

export interface ShopifyCustomer {
  id?: number | string;
  email?: string;
  name?: string;
  phone?: string;
  default_address?: ShopifyAddress;
  [key: string]: any; // For any additional fields
}

export interface ShopifyLineItem {
  product_id?: number | string;
  name?: string;
  quantity?: number;
  price?: string | number;
  [key: string]: any; // For extra line item properties
}

export interface ShopifyOrder {
  order_id: number | string;
  order_number?: number | string;
  name?: string;
  shop?: string;
  created_at?: string;
  customer?: ShopifyCustomer;
  shipping_address?: ShopifyAddress;
  billing_address?: ShopifyAddress;
  total_price?: string | number;
  payment_status?: string;
  fulfillment_status?: string;
  line_items?: ShopifyLineItem[];
  updated_at?: string;
  [key: string]: any; // For any additional properties
}

export interface Comment {
  id: string;
  user: string;
  content: string;
  created_at: string;
  updated_at?: string;
};