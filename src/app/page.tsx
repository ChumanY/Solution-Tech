"use client";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import Sidebar from "@/components/chat/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import ChatInput from "@/components/chat/ChatInput";
import ErrorAlert from "@/components/chat/ErrorAlert";
import { worker } from "../mocks/browser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}


export default function ChatPage() {
  const handleNewChat = () => {
    createChatMutation.mutate();
  };

  const [editingChatId, setEditingChatId] = useState<number | null>(null);
  const [editingChatName, setEditingChatName] = useState("");
  const { data: chats = [], refetch: refetchChats } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await fetch("/api/chats");
      return res.json();
    },
  });
  const [activeChatId, setActiveChatId] = useState(1);
  const queryClient = useQueryClient();
  const editChatMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const res = await fetch(`/api/chats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
    onSuccess: () => {
      refetchChats();
      setEditingChatId(null);
    },
  });
  const deleteChatMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/chats/${id}`, {
        method: "DELETE",
      });
      return res.json();
    },
    onSuccess: () => {
      refetchChats();
      setActiveChatId(chats.length > 0 ? chats[0].id : 0);
    },
  });
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      worker.start();
    }

  }, []);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("dark");

  const { data: messages = [], refetch, isLoading } = useQuery({
    queryKey: ["messages", activeChatId],
    queryFn: async () => {
      const res = await fetch(`/api/chats/${activeChatId}/messages`);
      return res.json();
    },
    enabled: !!activeChatId,
  });


  const { data: allMessages = {}, refetch: refetchAllMessages } = useQuery({
    queryKey: ["allMessages"],
    queryFn: async () => {

      const chatsRes = await fetch("/api/chats");
      const chatsList = await chatsRes.json();
      const result: Record<number, Message[]> = {};
      await Promise.all(
        chatsList.map(async (chat: { id: number }) => {
          const res = await fetch(`/api/chats/${chat.id}/messages`);
          result[chat.id] = await res.json();
        })
      );
      return result;
    },
  });
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/chats/${activeChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sender: "user" }),
      });
      return res.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessageMutation.mutate(input);
    setInput("");
  };

  // Estados y referencias para drag & drop y archivos
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [showFileOptions, setShowFileOptions] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const createChatMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Nuevo Chat" }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      refetchChats();
      setActiveChatId(data.id);
      queryClient.invalidateQueries({ queryKey: ["messages", data.id] });
    },
  });

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (["image/jpeg", "image/png"].includes(file.type)) {
      setFileError("");
      const base64 = await fileToBase64(file);
      sendMessageMutation.mutate(base64);
    } else if (file.type === "application/pdf") {
      setFileError("");
      const base64 = await fileToBase64(file);
      sendMessageMutation.mutate(`Archivo: ${file.name}||${base64}`);
    } else if (file.type === "video/mp4") {
      setFileError("");
      const base64 = await fileToBase64(file);
      sendMessageMutation.mutate(`Archivo: ${file.name}||${base64}`);
    } else {
      setFileError("Solo se permiten imágenes JPG, PNG, videos MP4 o archivos PDF.");
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "image") {
      if (["image/jpeg", "image/png"].includes(file.type)) {
        setFileError("");
        const base64 = await fileToBase64(file);
        sendMessageMutation.mutate(base64);
      } else {
        setFileError("Solo se permiten imágenes JPG o PNG.");
        e.target.value = "";
        setShowFileOptions(false);
        return;
      }
    } else if (type === "video") {
      if (file.type === "video/mp4") {
        setFileError("");
        const base64 = await fileToBase64(file);
        sendMessageMutation.mutate(`Archivo: ${file.name}||${base64}`);
      } else {
        setFileError("Solo se permite subir videos MP4.");
        e.target.value = "";
        setShowFileOptions(false);
        return;
      }
    } else if (type === "pdf") {
      if (file.type === "application/pdf") {
        setFileError("");
        const base64 = await fileToBase64(file);
        sendMessageMutation.mutate(`Archivo: ${file.name}||${base64}`);
      } else {
        setFileError("Solo se permite subir archivos PDF.");
        e.target.value = "";
        setShowFileOptions(false);
        return;
      }
    }
    e.target.value = "";
    setShowFileOptions(false);
  };


  const [alertVisible, setAlertVisible] = useState(true);
  useEffect(() => {
    if (fileError) {
      setAlertVisible(true);
      const timer = setTimeout(() => setAlertVisible(false), 2500);
      const removeTimer = setTimeout(() => setFileError(""), 3000);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [fileError]);

  return (
    <div className="flex h-screen bg-background relative">
      {isMobile && (
        <button
          className="absolute top-4 left-4 z-30 p-2 rounded-md bg-muted text-2xl shadow-lg"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          &#9776;
        </button>
      )}
      {(!isMobile || sidebarOpen) && (
        <div
          className={`fixed inset-0 z-20 bg-black bg-opacity-40 md:static md:bg-transparent md:z-auto ${isMobile ? "w-64" : ""}`}
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSetActiveChat={id => {
              setActiveChatId(id);
              queryClient.invalidateQueries({ queryKey: ["messages", id] });
              if (isMobile) setSidebarOpen(false);
            }}
            onEditChat={(id, name) => editChatMutation.mutate({ id, name })}
            onDeleteChat={id => deleteChatMutation.mutate(id)}
            editingChatId={editingChatId}
            editingChatName={editingChatName}
            setEditingChatId={setEditingChatId}
            setEditingChatName={setEditingChatName}
            theme={theme}
            setTheme={setTheme}
            getMessagesForChat={chatId => Array.isArray(allMessages[chatId]) ? allMessages[chatId] : []}
            collapsed={isMobile}
          />
        </div>
      )}
      <main className="flex flex-col flex-1 h-full w-full max-w-3xl mx-auto bg-background">
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          scrollAreaRef={scrollAreaRef}
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          showFileOptions={showFileOptions}
          setShowFileOptions={setShowFileOptions}
          imageInputRef={imageInputRef}
          pdfInputRef={pdfInputRef}
          videoInputRef={videoInputRef}
          handleFileChange={handleFileChange}
        />
        <ErrorAlert fileError={fileError} alertVisible={alertVisible} />
      </main>
    </div>
  );
}
