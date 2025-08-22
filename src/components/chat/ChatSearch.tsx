import React from "react";

interface ChatSearchProps {
    search: string;
    setSearch: (value: string) => void;
}

const ChatSearch: React.FC<ChatSearchProps> = ({ search, setSearch }) => {
    return (
        <div className="mb-2">
            <input
                type="text"
                className="w-full px-2 py-1 rounded border"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
    );
};

export default ChatSearch;
