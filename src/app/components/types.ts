export type DocId =
  | "invoice_creation_process.pdf"
  | "approval_hierarchy.pdf"
  | "vendor_onboarding_process.pdf"
  | "refund_process.pdf"
  | "purchase_order_workflow.pdf";

export type Citation = { file: DocId; page: number };

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  triggersNetsuite?: boolean;
  loading?: boolean;
  streaming?: boolean;
  rating?: "up" | "down";
  createdAt?: number;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
  pinned?: boolean;
};

export type DocSection = { heading: string; body: string[] };
export type Doc = {
  id: DocId;
  title: string;
  pages: number;
  sections: DocSection[];
  status: "indexed" | "pending" | "failed";
  updated: string;
  sizeKb: number;
  owner: string;
};
