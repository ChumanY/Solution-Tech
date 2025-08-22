import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileOptions from "./FileOptions";

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    onSend: () => void;
    showFileOptions: boolean;
    setShowFileOptions: (val: boolean) => void;
    imageInputRef: React.RefObject<HTMLInputElement | null>;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
    videoInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf" | "video") => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    input,
    setInput,
    onSend,
    showFileOptions,
    setShowFileOptions,
    imageInputRef,
    pdfInputRef,
    videoInputRef,
    handleFileChange,
}) => (
    <form
        className="flex items-center gap-2 p-4 border-t relative"
        onSubmit={e => {
            e.preventDefault();
            onSend();
        }}
    >
        <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
        />
        <FileOptions
            showFileOptions={showFileOptions}
            setShowFileOptions={setShowFileOptions}
            imageInputRef={imageInputRef}
            pdfInputRef={pdfInputRef}
            videoInputRef={videoInputRef}
            handleFileChange={handleFileChange}
        />
        <Button type="submit">Enviar</Button>
    </form>
);

export default ChatInput;
