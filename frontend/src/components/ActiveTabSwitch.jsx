import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex gap-2 p-4 border-b border-slate-700/50">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
          activeTab === "chats"
            ? "bg-indigo-600 text-white"
            : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50"
        }`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
          activeTab === "contacts"
            ? "bg-indigo-600 text-white"
            : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
