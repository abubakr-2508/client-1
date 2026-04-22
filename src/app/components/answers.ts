import type { Citation, DocId } from "./types";

export type AnswerEntry = {
  match: RegExp;
  answer: string;
  citations: Citation[];
  netsuite?: boolean;
};

export function buildAnswers(kbEdits: Partial<Record<DocId, string>>): AnswerEntry[] {
  return [
    {
      match: /(invoice).*(approval|process|create|lifecycle)|approve.*invoice|who approves/i,
      answer:
        kbEdits["invoice_creation_process.pdf"] ||
        [
          "The invoice approval process follows four sequential stages:",
          "",
          "1. **Creation** — Operations team creates the invoice in the system and runs initial validation.",
          "2. **Manager approval** — First-level approval is required before the invoice advances.",
          "3. **Finance verification** — Finance performs financial review and mandatory approval.",
          "4. **Final posting** — Once approvals are complete, the invoice is posted.",
          "",
          "Incomplete invoices are rejected at the validation stage. High-value transactions require an additional senior management approval based on the predefined hierarchy.",
        ].join("\n"),
      citations: [
        { file: "invoice_creation_process.pdf", page: 2 },
        { file: "approval_hierarchy.pdf", page: 1 },
      ],
    },
    {
      match: /vendor|onboard/i,
      answer:
        kbEdits["vendor_onboarding_process.pdf"] ||
        [
          "Vendor onboarding follows a five-step verification flow:",
          "",
          "1. Vendor submits an onboarding request with the required documentation.",
          "2. Compliance and KYC checks are performed.",
          "3. Verified details are entered into the system.",
          "4. Approval is granted after successful verification.",
          "5. The vendor is activated and eligible for transactions.",
          "",
          "Missing documents halt onboarding, and only approved vendors can be used in transactions.",
        ].join("\n"),
      citations: [
        { file: "vendor_onboarding_process.pdf", page: 3 },
        { file: "approval_hierarchy.pdf", page: 2 },
      ],
    },
    {
      match: /refund/i,
      answer:
        kbEdits["refund_process.pdf"] ||
        [
          "The refund process is initiated by operations or customer support and proceeds through validation, approval, and disbursement:",
          "",
          "1. Request is initiated and the refund reason is verified.",
          "2. Manager approval is required before processing.",
          "3. Finance disburses the refund and records it in the system.",
          "",
          "All refunds require validation; approval is mandatory before any processing begins.",
        ].join("\n"),
      citations: [
        { file: "refund_process.pdf", page: 2 },
        { file: "approval_hierarchy.pdf", page: 1 },
      ],
    },
    {
      match: /purchase order|\bpo\b|procurement|after.*order/i,
      answer:
        kbEdits["purchase_order_workflow.pdf"] ||
        [
          "After a purchase order is issued, the workflow continues with execution and delivery tracking:",
          "",
          "1. Purchase request is created and reviewed by the manager.",
          "2. A registered vendor is selected or assigned.",
          "3. The purchase order is issued upon approval.",
          "4. Order execution and delivery follow against the issued PO.",
          "",
          "No PO can be issued without prior approval, and only registered vendors are eligible.",
        ].join("\n"),
      citations: [
        { file: "purchase_order_workflow.pdf", page: 1 },
        { file: "vendor_onboarding_process.pdf", page: 4 },
      ],
    },
    {
      match: /approval hierarchy|hierarchy|approval level/i,
      answer:
        kbEdits["approval_hierarchy.pdf"] ||
        [
          "Approval is governed by role hierarchy and transaction value:",
          "",
          "- Manager approval is required for all invoices.",
          "- Finance performs secondary approval before posting.",
          "- High-value transactions require senior management approval.",
          "",
          "Approval levels increase with transaction value, and certain thresholds trigger additional approvals.",
        ].join("\n"),
      citations: [
        { file: "approval_hierarchy.pdf", page: 1 },
        { file: "invoice_creation_process.pdf", page: 3 },
      ],
    },
    {
      match: /check invoice status|invoice status|show approval chain|approval chain|netsuite/i,
      answer:
        "Pulling live operational data from NetSuite. The right panel displays the current invoice status, approval chain, and vendor details for the requested record.",
      citations: [],
      netsuite: true,
    },
  ];
}

export function findAnswer(
  query: string,
  kbEdits: Partial<Record<DocId, string>>
): AnswerEntry {
  const entries = buildAnswers(kbEdits);
  for (const e of entries) if (e.match.test(query)) return e;
  return {
    match: /.*/,
    answer:
      "I couldn't find a confident match in the indexed knowledge base. Try asking about invoice approvals, vendor onboarding, refunds, purchase orders, or the approval hierarchy.",
    citations: [],
  };
}
