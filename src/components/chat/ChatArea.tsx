import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { Avatar } from "@/components/ui/avatar";
import MessageBubble from "./MessageBubble";

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
}

interface ChatAreaProps {
    messages: Message[];
    isLoading: boolean;
    scrollAreaRef: React.RefObject<HTMLDivElement | null>;
    isDragging: boolean;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    isLoading,
    scrollAreaRef,
    isDragging,
    onDrop,
    onDragOver,
    onDragLeave,
}) => {
    const bottomRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    return (
        <ScrollArea
            className={`flex-1 p-4 overflow-y-auto ${isDragging ? "border-2 border-dashed border-blue-300 bg-blue-100 dark:bg-blue-950" : ""}`}
        >
            <ScrollAreaPrimitive.Viewport
                ref={scrollAreaRef}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className="size-full"
            >
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                        <div ref={bottomRef} />
                    </>
                )}
            </ScrollAreaPrimitive.Viewport>
        </ScrollArea>
    );
};

export default ChatArea;
