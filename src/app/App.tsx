import { useEffect, useState } from "react";
import { TopNav, type Tab } from "./components/TopNav";
import { LoginScreen } from "./components/LoginScreen";
import { ChatScreen, newConversation } from "./components/ChatScreen";
import { AdminScreen } from "./components/AdminScreen";
import { KnowledgeBase } from "./components/KnowledgeBase";
import { DocumentViewer } from "./components/DocumentViewer";
import { NetSuitePanel } from "./components/NetSuitePanel";
import { CommandPalette } from "./components/CommandPalette";
import { AdminDrawer } from "./components/AdminDrawer";
import { Toaster } from "./components/Toaster";
import { initialDocs } from "./components/data";
import type { Conversation, Doc, DocId } from "./components/types";

function makeFirstConversation(): Conversation {
  return {
    id: "c-initial",
    title: "New chat",
    updatedAt: Date.now(),
    messages: [
      {
        id: "greet",
        role: "assistant",
        content: "Hi, I'm your AI assistant. Ask me anything about your processes.",
      },
    ],
  };
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("assistant");
  const [conversations, setConversations] = useState<Conversation[]>([
    makeFirstConversation(),
  ]);
  const [activeId, setActiveId] = useState("c-initial");

  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [viewer, setViewer] = useState<{ doc: Doc; page: number; mode: "chat" | "admin" } | null>(
    null
  );
  const [drawerDoc, setDrawerDoc] = useState<Doc | null>(null);
  const [netsuiteOpen, setNetsuiteOpen] = useState(false);
  const [kbEdits, setKbEdits] = useState<Partial<Record<DocId, string>>>({});
  const [kbTargetDoc, setKbTargetDoc] = useState<DocId | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  function openDocFromChat(file: DocId, page: number) {
    const doc = docs.find((d) => d.id === file);
    if (doc) setViewer({ doc, page, mode: "chat" });
  }

  function openDocFromAdmin(doc: Doc) {
    setViewer({ doc, page: 1, mode: "admin" });
  }

  function reindex(id: string) {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "indexed",
              updated: new Date().toISOString().slice(0, 10),
            }
          : d
      )
    );
  }

  function newChat() {
    setConversations((prev) => {
      if (prev.length >= 10) return prev;
      const c = newConversation();
      setActiveId(c.id);
      return [c, ...prev];
    });
  }

  useEffect(() => {
    if (!authed) return;
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        setTab("assistant");
        newChat();
      } else if (mod && (e.key === "1" || e.key === "2" || e.key === "3")) {
        e.preventDefault();
        setTab(e.key === "1" ? "assistant" : e.key === "2" ? "kb" : "admin");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authed]);

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="h-screen w-full flex flex-col bg-[#F8FAFC] text-[#0F172A] overflow-hidden">
      <TopNav
        active={tab}
        onChange={setTab}
        onLogout={() => setAuthed(false)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="flex-1 flex min-h-0 relative">
        <div
          className="flex-1 flex min-h-0 transition-[margin] duration-200 ease-out"
          style={{ marginRight: netsuiteOpen && tab === "assistant" ? 380 : 0 }}
        >
          {tab === "assistant" && (
            <ChatScreen
              conversations={conversations}
              setConversations={setConversations}
              activeId={activeId}
              setActiveId={setActiveId}
              docs={docs}
              onOpenDoc={openDocFromChat}
              onOpenNetsuite={() => setNetsuiteOpen(true)}
              kbEdits={kbEdits}
            />
          )}
          {tab === "admin" && (
            <AdminScreen
              docs={docs}
              onView={openDocFromAdmin}
              onReindex={reindex}
              onOpenDrawer={setDrawerDoc}
            />
          )}
          {tab === "kb" && (
            <KnowledgeBase
              edits={kbEdits}
              onSave={(id, content) => setKbEdits((prev) => ({ ...prev, [id]: content }))}
              initialPage={kbTargetDoc}
              onPageConsumed={() => setKbTargetDoc(null)}
            />
          )}
        </div>

        <NetSuitePanel open={netsuiteOpen} onClose={() => setNetsuiteOpen(false)} />
      </main>

      {viewer && (
        <DocumentViewer
          doc={viewer.doc}
          page={viewer.page}
          mode={viewer.mode}
          onClose={() => setViewer(null)}
          onOpenInKB={() => {
            setKbTargetDoc(viewer.doc.id);
            setTab("kb");
            setViewer(null);
          }}
        />
      )}

      <AdminDrawer
        doc={drawerDoc}
        onClose={() => setDrawerDoc(null)}
        onView={(d) => {
          setDrawerDoc(null);
          setViewer({ doc: d, page: 1, mode: "admin" });
        }}
        onReindex={reindex}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        conversations={conversations}
        docs={docs}
        onSelectConversation={setActiveId}
        onOpenDoc={(d) => setViewer({ doc: d, page: 1, mode: "admin" })}
        onTab={setTab}
        onNewChat={newChat}
        onOpenNetsuite={() => setNetsuiteOpen(true)}
      />

      <Toaster />
    </div>
  );
}
