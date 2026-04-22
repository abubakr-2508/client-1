Design a production-grade SaaS web application called “rag.cx” — an AI-powered process assistant that combines document intelligence, knowledge base editing, and NetSuite operational data into a single system.

This is a desktop-first B2B product for a small but serious company. It must look like a real internal enterprise system — calm, structured, clean, and premium. It should feel like a product similar to Notion, Linear, or Stripe dashboards — NOT like a prototype, marketing site, or AI-generated UI.

This is NOT a flashy product.
This is NOT a design-heavy UI.
This MUST feel like a real working system.

-----------------------------------
PRODUCT PURPOSE
-----------------------------------

rag.cx helps a business operator stop being the bottleneck for process-related questions.

The system:
1) answers questions using internal documents,
2) shows source citations from documents,
3) allows document preview via structured viewer,
4) integrates with NetSuite to fetch operational data,
5) allows editing of knowledge base (Notion-style),
6) provides an admin panel to manage documents.

The entire experience must feel connected and real.

-----------------------------------
GLOBAL DESIGN DIRECTION
-----------------------------------

Theme: Calm Enterprise Intelligence

Style:
- minimal
- structured
- quiet
- professional
- spacious

Avoid:
- gradients
- shadows
- neon colors
- decorative UI
- flashy elements

STRICT RULE: Do NOT use shadows for elevation. Use only borders and spacing.

🚨 IMPORTANT:
Do NOT introduce additional UI elements, badges, icons, or sections that are not explicitly defined in this prompt.

-----------------------------------
COLOR SYSTEM (STRICT)
-----------------------------------

Background: #F8FAFC
Surface: #FFFFFF
Border: #E2E8F0

Primary Text: #0F172A
Secondary Text: #475569
Muted Text: #94A3B8

Primary Accent: #2563EB
Hover Accent: #1D4ED8

Status:
- Success: #16A34A (subtle)
- Warning: #D97706 (subtle)
- Error: #DC2626 (subtle)

NO additional accent colors.
NO gradients.
NO shadows.

-----------------------------------
TYPOGRAPHY
-----------------------------------

Font: Inter-style

Hierarchy:
- Page title: large, semibold
- Section title: medium
- Body: small readable
- Meta: small muted

Use maximum 3 weights.

-----------------------------------
LAYOUT SYSTEM (VERY IMPORTANT)
-----------------------------------

- Desktop only
- Full height app (no page scroll)
- Only inner sections scroll

Top Navigation:
- height: 56px
- left: logo (blue square + rag.cx)
- right: navigation tabs

Tabs:
- Assistant
- Knowledge Base
- Admin

Active tab:
- bottom border 2px (#2563EB)

Main Layout Types:

1) Chat Layout:
[ Sidebar (260px) ] [ Chat Area ]

2) Dashboard / Admin / KB:
Full width content with padding

Chat Content:
- max-width: 720px
- centered

Spacing:
- strict 8px system (p-4, p-6, gap-4, gap-6)

-----------------------------------
CORE SYSTEMS (VERY IMPORTANT)
-----------------------------------

SYSTEM 1 — AI CHAT ASSISTANT
SYSTEM 2 — DOCUMENT INTELLIGENCE
SYSTEM 3 — NETSUITE DATA PANEL
SYSTEM 4 — ADMIN PANEL
SYSTEM 5 — KNOWLEDGE BASE (NOTION STYLE)

Each system must feel connected but visually consistent.

-----------------------------------
COMPONENT SYSTEM
-----------------------------------

TopNav:
- logo + tabs

Sidebar:
- New Chat button
- Search input
- Conversation list
- Active state highlight

Chat Messages:
- User → right, blue background
- Assistant → left, white card with border

Citations:
- MUST always appear outside the message bubble
- citation chips must always match the file names exactly as defined in the Document System
- always below the message
- never inside the message text

Citation Chip:
- small
- gray background (#F1F5F9)
- clickable
- hover feedback

Buttons:
- Primary: blue
- Secondary: bordered

Inputs:
- bordered
- rounded
- subtle focus ring

Cards:
- white
- bordered
- rounded-xl

Skeletons:
- gray blocks (#E2E8F0)
- animate pulse
- no shimmer

Skeleton loaders must be used for:
- assistant response loading
- document viewer loading
- admin table loading

Use simple, functional UI patterns. Avoid decorative or experimental layouts.

-----------------------------------
DOCUMENT SYSTEM
-----------------------------------

Documents available:
- Invoice Creation Process
- Approval Hierarchy
- Vendor Onboarding
- Refund Process
- Purchase Order Workflow

File names for citations must match exactly:
- invoice_creation_process.pdf
- approval_hierarchy.pdf
- vendor_onboarding_process.pdf
- refund_process.pdf
- purchase_order_workflow.pdf

Attached documents must be the source of truth for answers.
Do NOT attempt to render full PDF layouts or extract raw content directly into UI.
Answers must align with document structure but remain summarized and concise.

-----------------------------------
DOCUMENT CONTENT (FOR AI ANSWERS)
-----------------------------------

invoice_creation_process.pdf:
Summary:
- Invoice is created by the operations team in the system
- Initial validation is performed for completeness
- Sent to manager for first-level approval
- Forwarded to finance for financial verification
- Final posting is completed after approval

Key Rules:
- No invoice proceeds without manager approval
- Finance approval is mandatory before posting
- Incomplete invoices are rejected at validation stage

Sample Use:
Used when answering questions about invoice lifecycle, approval flow, and posting process


approval_hierarchy.pdf:
Summary:
- Approval is based on role hierarchy and transaction value
- Manager approval is required for all invoices
- Finance team performs secondary approval
- High-value transactions require senior management approval

Key Rules:
- Approval levels increase with transaction value
- Certain thresholds trigger additional approvals
- Final authority depends on predefined hierarchy

Sample Use:
Used when answering "who approves", "approval levels", "hierarchy logic"


vendor_onboarding_process.pdf:
Summary:
- Vendor submits onboarding request with required documents
- Compliance and KYC verification is performed
- Vendor details are entered into the system
- Approval is granted after verification
- Vendor is activated for transactions

Key Rules:
- Missing documents halt onboarding
- Compliance check is mandatory
- Only approved vendors can be used in transactions

Sample Use:
Used for onboarding flow, vendor setup, compliance-related questions


refund_process.pdf:
Summary:
- Refund request is initiated by operations or customer support
- Verification of refund reason is performed
- Manager approval is required
- Finance processes the refund
- Refund is completed and recorded

Key Rules:
- All refunds require validation
- Approval is mandatory before processing
- Finance handles final disbursement

Sample Use:
Used for refund lifecycle, approval, and processing queries


purchase_order_workflow.pdf:
Summary:
- Purchase request is created in the system
- Manager reviews and approves the request
- Vendor is selected or assigned
- Purchase order is issued
- Order execution and delivery follow

Key Rules:
- No PO without approval
- Vendor must be registered
- Approval required before issuing PO

Sample Use:
Used for procurement flow, PO lifecycle, and vendor interaction

------------------------------


Document previews must be:
- structured
- simplified
- clean
- summarized (not copied verbatim)

Clicking citation:
→ opens document viewer
→ shows structured extracted content
→ shows page reference
-----------------------------------
SCREENS TO DESIGN
-----------------------------------

SCREEN 1 — LOGIN
- centered card (max width 400px)
- logo
- title: rag.cx
- subtitle: AI-powered process assistant
- email + password
- login button

-----------------------------------

SCREEN 2 — CHAT (MAIN SCREEN)

Layout:
[ Sidebar ] [ Chat Area ]

Sidebar:
- New Chat
- Search
- Conversations (rename, delete)

Chat messages must be constrained to max-width 720px and centered.

Chat Area:

The chat screen must NEVER appear empty.

State 1:
Greeting message:
"Hi, I’m your AI assistant. Ask me anything about your processes."

State 2:
User message (right)

State 3:
Loading:
- typing indicator OR skeleton

State 4:
Assistant response:
- clean structured text (markdown style)
- concise, structured, business-like tone (not conversational or casual)
- no inline citations
- must not include raw file names or page numbers in text

State 5:
Citations:
- shown below message
- grouped under a subtle "Sources" label
- clickable chips

-----------------------------------

SCREEN 3 — DOCUMENT VIEWER

Modal (centered):
- width ~900px
- height ~80vh

Content:
- header: file name
- page label
- contextual label: "Answer extracted from document"
- extracted content (clean, readable)
- page indicator: "Page X of Y"

When opened from Chat:
→ show highlighted extracted section

When opened from Admin:
→ show full document preview

IMPORTANT:
This is NOT a real PDF.
This is a structured document preview.

-----------------------------------

SCREEN 4 — NETSUITE PANEL

Right side panel:
- fixed to right
- below navbar

Content:
- header: “NetSuite Data”

MUST include label:
"Data retrieved from NetSuite"

Cards:
- Invoice status
- Approval chain
- Vendor details

Must feel structured and real.

-----------------------------------

SCREEN 5 — ADMIN PANEL

Content:
- page title: Documents

Table:
- File name
- Status (indexed, pending, failed)
- Updated date
- AI Status: "Indexed for AI responses"
- Actions:
  - View
  - Reindex

-----------------------------------

SCREEN 6 — KNOWLEDGE BASE

Notion-style layout:
- title
- sections
- clean text blocks

-----------------------------------

SCREEN 7 — KB EDIT MODE

- editable content
- save button
- confirmation feedback

-----------------------------------
DATA SIMULATION (CRITICAL)
-----------------------------------

Example Questions:
- What is the invoice approval process?
- How to onboard a vendor?
- What is refund process?
- What happens after purchase order?
- Who approves invoices?

Example Answers:
Invoice process:
1. Invoice created
2. Manager approval
3. Finance approval
4. Final posting

Sources:
- invoice_creation_process.pdf — Page 2
- approval_hierarchy.pdf — Page 1
- vendor_onboarding_process.pdf — Page 3
- refund_process.pdf — Page 2
- purchase_order_workflow.pdf — Page 1

-----------------------------------

NETSUITE TRIGGERS
-----------------------------------

Questions like:
- “Check invoice status”
- “Show approval chain”

→ must open NetSuite panel

-----------------------------------

INTERACTION RULES
-----------------------------------

- User message appears instantly
- Assistant response delayed (~800ms)
- All async interactions must show loading state
- citations clickable
- document viewer opens on click
- NetSuite panel opens on trigger
- Document viewer and NetSuite panel should open with smooth transition (not abrupt).

Conversation system:
- new chat resets state
- greeting appears only on new chat
- rename chat
- delete chat
- search chat
- max 10 conversations

-----------------------------------

KNOWLEDGE BASE BEHAVIOR
-----------------------------------

- user edits content
- saves changes
- returning to chat must show updated answers reflecting changes

-----------------------------------

DEMO FLOW (VERY IMPORTANT)
-----------------------------------

The demo must clearly show that the system replaces manual process dependency.

Flow:
1) user asks question → gets answer
2) user clicks citation → document opens
3) user asks NetSuite question → panel opens
4) user goes to Admin → sees documents
5) user views document
6) user goes to Knowledge Base → edits content
7) user returns to chat → answer reflects update

-----------------------------------

FINAL OUTPUT EXPECTATION
-----------------------------------

Design all screens with:
- consistent layout
- realistic enterprise data
- clean spacing
- strong hierarchy
- no visual noise

The UI should feel stable and consistent across all screens, with no visual jumps or layout inconsistencies.
The result must feel like a real, production-ready internal AI system that can be presented directly to a client.