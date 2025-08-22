import ConfirmDialog from "@/components/ui/ConfirmDialog";
import React from "react";
import { Button } from "@/components/ui/button";
import ChatSearch from "./ChatSearch";

interface SidebarProps {
    collapsed?: boolean;
    chats: { id: number; name: string }[];
    activeChatId: number;
    onNewChat: () => void;
    onSetActiveChat: (id: number) => void;
    onEditChat: (id: number, name: string) => void;
    onDeleteChat: (id: number) => void;
    editingChatId: number | null;
    editingChatName: string;
    setEditingChatId: (id: number | null) => void;
    setEditingChatName: (name: string) => void;
    theme: string;
    setTheme: (theme: string) => void;
    allMessages: Record<number, { text: string }[]>;
}

const Sidebar: React.FC<SidebarProps> = ({
    chats,
    activeChatId,
    onNewChat,
    onSetActiveChat,
    onEditChat,
    onDeleteChat,
    editingChatId,
    editingChatName,
    setEditingChatId,
    setEditingChatName,
    theme,
    setTheme,
    allMessages,
    collapsed = false,
}) => {
    const [search, setSearch] = React.useState("");
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [chatToDelete, setChatToDelete] = React.useState<number | null>(null);
    const filteredChats = search.trim()
        ? chats.filter(chat =>
            (allMessages[chat.id] || []).some(msg => msg.text.toLowerCase().includes(search.toLowerCase()))
        )
        : chats;
    return (
        <aside className="w-64 h-full border-r bg-muted flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
                <span className={`font-bold text-lg${collapsed ? ' invisible' : ''}`}>Chats</span>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={onNewChat}>+ Nuevo</Button>
                    <Button variant="outline" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "🌙" : "☀️"}</Button>
                </div>
            </div>
            <ChatSearch search={search} setSearch={setSearch} />
            <nav className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                    <div className="text-xs text-red-600 font-bold bg-red-100 rounded px-2 py-1">No hay chats con esa palabra.</div>
                ) : (
                    filteredChats.map(chat => (
                        <div key={chat.id} className="flex items-center mb-2 gap-2">
                            {editingChatId === chat.id ? (
                                <form
                                    className="flex w-full items-center gap-2 overflow-hidden"
                                    onSubmit={e => {
                                        e.preventDefault();
                                        if (editingChatName.trim()) {
                                            onEditChat(chat.id, editingChatName);
                                        }
                                    }}
                                >
                                    <input
                                        className="px-2 py-1 rounded border max-w-[150px]"
                                        value={editingChatName}
                                        onChange={e => setEditingChatName(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="p-1"><span role="img" aria-label="check">✔️</span></button>
                                        <button type="button" className="p-1" onClick={() => setEditingChatId(null)}><span role="img" aria-label="cancel">✖️</span></button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <button
                                        className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${activeChatId === chat.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                                        onClick={() => onSetActiveChat(chat.id)}
                                    >
                                        <span>{chat.name}</span>
                                    </button>
                                    <button className="p-1" type="button" onClick={() => {
                                        setEditingChatId(chat.id);
                                        setEditingChatName(chat.name);
                                    }}><span role="img" aria-label="edit">✏️</span></button>
                                    <button
                                        className="p-1"
                                        type="button"
                                        onClick={() => {
                                            setChatToDelete(chat.id);
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        <span role="img" aria-label="delete">🗑️</span>
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </nav>
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar chat"
                message="¿Seguro que quieres eliminar este chat? Esta acción no se puede deshacer."
                onConfirm={() => {
                    if (chatToDelete !== null) {
                        onDeleteChat(chatToDelete);
                    }
                    setConfirmOpen(false);
                    setChatToDelete(null);
                }}
                onCancel={() => {
                    setConfirmOpen(false);
                    setChatToDelete(null);
                }}
            />
        </aside>
    );
};

export default Sidebar;
