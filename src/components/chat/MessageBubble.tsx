import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface Message {
    id: number;
    text: string;
    sender: "user" | "bot";
}

const MessageBubble: React.FC<{ msg: Message }> = ({ msg }) => {
    const isImage = typeof msg.text === "string" && (
        msg.text.startsWith("data:image/") ||
        msg.text.match(/\.(jpg|jpeg|png)$/i) ||
        (msg.text.startsWith("blob:") && !msg.text.includes("Archivo:"))
    );
    const isFile = typeof msg.text === "string" && msg.text.startsWith("Archivo: ");
    let fileName = "";
    let fileUrl = "";
    let isPDF = false;
    let isMP4 = false;
    let isFileImage = false;
    if (isFile) {
        const parts = msg.text.replace("Archivo: ", "").split("||");
        fileName = parts[0];
        fileUrl = parts[1];
        isPDF = fileName.toLowerCase().endsWith(".pdf");
        isMP4 = fileName.toLowerCase().endsWith(".mp4");
        isFileImage = fileUrl.startsWith("data:image/");
    }
    return (
        <div className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "bot" && <Avatar className="mr-2" />}
            <Card className={`max-w-xs ${msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <div className="p-2">
                    {isImage ? (
                        <img src={msg.text} alt="imagen" className="max-w-full max-h-60 rounded" />
                    ) : isFile ? (
                        isFileImage ? (
                            <img src={fileUrl} alt={fileName} className="max-w-full max-h-60 rounded" />
                        ) : (
                            <a href={fileUrl} download={fileName} className="text-blue-600 underline">{fileName}</a>
                        )
                    ) : (
                        msg.text
                    )}
                </div>
            </Card>
            {msg.sender === "user" && <Avatar className="ml-2" />}
        </div>
    );
};

export default MessageBubble;
