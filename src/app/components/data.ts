import type { Doc, DocId } from "./types";

export const DOC_TITLES: Record<DocId, string> = {
  "invoice_creation_process.pdf": "Invoice Creation Process",
  "approval_hierarchy.pdf": "Approval Hierarchy",
  "vendor_onboarding_process.pdf": "Vendor Onboarding",
  "refund_process.pdf": "Refund Process",
  "purchase_order_workflow.pdf": "Purchase Order Workflow",
};

export const initialDocs: Doc[] = [
  {
    id: "invoice_creation_process.pdf",
    title: "Invoice Creation Process",
    pages: 4,
    status: "indexed",
    updated: "2026-04-18",
    sizeKb: 184,
    owner: "Priya N.",
    sections: [
      {
        heading: "Overview",
        body: [
          "Invoice is created by the operations team in the system.",
          "Initial validation is performed for completeness.",
        ],
      },
      {
        heading: "Approval Flow",
        body: [
          "Sent to manager for first-level approval.",
          "Forwarded to finance for financial verification.",
          "Final posting is completed after approval.",
        ],
      },
      {
        heading: "Key Rules",
        body: [
          "No invoice proceeds without manager approval.",
          "Finance approval is mandatory before posting.",
          "Incomplete invoices are rejected at validation stage.",
        ],
      },
    ],
  },
  {
    id: "approval_hierarchy.pdf",
    title: "Approval Hierarchy",
    pages: 3,
    status: "indexed",
    updated: "2026-04-15",
    sizeKb: 96,
    owner: "Priya N.",
    sections: [
      {
        heading: "Overview",
        body: [
          "Approval is based on role hierarchy and transaction value.",
          "Manager approval is required for all invoices.",
          "Finance team performs secondary approval.",
          "High-value transactions require senior management approval.",
        ],
      },
      {
        heading: "Key Rules",
        body: [
          "Approval levels increase with transaction value.",
          "Certain thresholds trigger additional approvals.",
          "Final authority depends on predefined hierarchy.",
        ],
      },
    ],
  },
  {
    id: "vendor_onboarding_process.pdf",
    title: "Vendor Onboarding",
    pages: 5,
    status: "indexed",
    updated: "2026-04-10",
    sizeKb: 232,
    owner: "Arjun S.",
    sections: [
      {
        heading: "Process",
        body: [
          "Vendor submits onboarding request with required documents.",
          "Compliance and KYC verification is performed.",
          "Vendor details are entered into the system.",
          "Approval is granted after verification.",
          "Vendor is activated for transactions.",
        ],
      },
      {
        heading: "Key Rules",
        body: [
          "Missing documents halt onboarding.",
          "Compliance check is mandatory.",
          "Only approved vendors can be used in transactions.",
        ],
      },
    ],
  },
  {
    id: "refund_process.pdf",
    title: "Refund Process",
    pages: 3,
    status: "pending",
    updated: "2026-04-12",
    sizeKb: 142,
    owner: "Meera K.",
    sections: [
      {
        heading: "Process",
        body: [
          "Refund request is initiated by operations or customer support.",
          "Verification of refund reason is performed.",
          "Manager approval is required.",
          "Finance processes the refund.",
          "Refund is completed and recorded.",
        ],
      },
      {
        heading: "Key Rules",
        body: [
          "All refunds require validation.",
          "Approval is mandatory before processing.",
          "Finance handles final disbursement.",
        ],
      },
    ],
  },
  {
    id: "purchase_order_workflow.pdf",
    title: "Purchase Order Workflow",
    pages: 4,
    status: "indexed",
    updated: "2026-04-08",
    sizeKb: 176,
    owner: "Arjun S.",
    sections: [
      {
        heading: "Process",
        body: [
          "Purchase request is created in the system.",
          "Manager reviews and approves the request.",
          "Vendor is selected or assigned.",
          "Purchase order is issued.",
          "Order execution and delivery follow.",
        ],
      },
      {
        heading: "Key Rules",
        body: [
          "No PO without approval.",
          "Vendor must be registered.",
          "Approval required before issuing PO.",
        ],
      },
    ],
  },
];
