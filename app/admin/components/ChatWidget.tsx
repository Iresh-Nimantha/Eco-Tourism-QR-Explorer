"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../Chatbot/chat.css";

interface Message {
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface ChatbotResponse {
  reply: string;
  error?: string;
}

const EcoTourismChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [heldImage, setHeldImage] = useState<string | null>(null);
  const [heldImageName, setHeldImageName] = useState<string>("");
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          type: "bot",
          text: "🌿 Welcome to Eco Tourism! Your AI guide for Sri Lanka's eco-tourism adventures! 🏞️\n\n✨ I can help you:\n- Discover hidden natural gems\n- Identify places from photos\n- Find sustainable travel options\n- Learn about wildlife & conservation\n- Plan eco-friendly itineraries\n\nWhat would you like to explore today? 🌍",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (
    text: string,
    imageBase64: string | null = null
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    const plainText = text.trim();
    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: imageBase64 ? `📸 ${plainText}` : text,
        timestamp: new Date(),
      },
    ]);

    try {
      const res = await fetch("Chatbot/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: plainText, image: imageBase64 }),
      });

      if (!res.ok) {
        throw new Error(
          `Server responded with ${res.status}: ${res.statusText}`
        );
      }

      const data: ChatbotResponse = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.reply || "Sorry, I couldn't process that. Try again! 🌿",
          timestamp: new Date(),
        },
      ]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error sending message:", errorMessage);
      setError("Failed to connect to the server. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Oops! I couldn't connect to the server. Please check your connection and try again. 🌱",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const processImageFile = (file: File): void => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result && typeof event.target.result === "string") {
        const base64 = event.target.result.split(",")[1];
        setHeldImage(base64);
        setHeldImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile) processImageFile(imageFile);
  };

  const handleTextSend = (): void => {
    const hasText = inputText.trim();
    if (hasText || heldImage) {
      const textToSend =
        inputText.trim() ||
        (heldImage
          ? "Can you identify this place or provide eco-tourism info?"
          : "");
      sendMessage(textToSend, heldImage);
      setInputText("");
      setHeldImage(null);
      setHeldImageName("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const removeHeldImage = (): void => {
    setHeldImage(null);
    setHeldImageName("");
  };

  const handleRetry = (): void => {
    sendMessage(inputText || "Retry last request", heldImage);
  };

  const handleQuickAction = (action: string): void => {
    setInputText(action);
    sendMessage(action);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const quickActions = [
    "🏞️ National Parks",
    "🦋 Wildlife Spots",
    "🌿 Eco Stays",
    "🚶‍♂️ Hiking Trails",
    "💡 Travel Tips",
    "🏖️ Best Beaches",
  ];

  // Custom renderer for colored text in Markdown
  const renderColoredText = (text: string): string => {
    return text.replace(
      /\{(.*?):(.*?)\}/g,
      (_match, color, content) =>
        `<span style="color: ${color}">${content}</span>`
    );
  };

  if (!mounted) {
    return null;
  }

  const chatWidget = (
    <div className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-auto">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 sm:p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 flex items-center gap-2"
          aria-label="Open Eco Tourism Chat"
          title="Chat with Eco Tourism"
        >
          {!logoError ? (
            <Image
              src="/logo.png"
              alt="Eco Tourism Logo"
              width={24}
              height={24}
              className="w-6 h-6 sm:w-8 sm:h-8"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-2xl sm:text-3xl">🌿</span>
          )}
          <span className="hidden sm:inline text-sm font-medium">
            Eco Tourism
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className="bg-white rounded-xl shadow-2xl border border-green-200 flex flex-col overflow-hidden w-[95vw] max-w-md h-[80vh] max-h-[700px] sm:w-[400px] sm:h-[80vh] sm:max-h-[700px] animate-slide-up"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="dialog"
          aria-label="Eco Tourism Chat Window"
        >
          {dragOver && (
            <div className="absolute inset-0 bg-green-100 bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl mb-2">📸</div>
                <p className="text-green-700 font-semibold text-sm sm:text-base">
                  Drop your image here!
                </p>
                <p className="text-green-600 text-xs sm:text-sm mt-1 max-w-[200px]">
                  Identify places or get eco-tourism info
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!logoError ? (
                <Image
                  src="/logo.png"
                  alt="Eco Tourism Logo"
                  width={28}
                  height={28}
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="text-xl sm:text-2xl">🌿</span>
              )}
              <span className="text-base sm:text-lg font-semibold">
                Eco Tourism
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white text-xl sm:text-2xl hover:text-green-200 hover:rotate-90 transition-transform duration-200"
              aria-label="Close Chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar hide-scrollbar bg-gray-50 text-sm sm:text-base flex flex-col gap-2"
            style={{ wordBreak: "break-word" }}
            role="log"
            aria-live="polite"
          >
            {messages.map((msg, idx) => (
              <div
                key={`${msg.type}-${idx}-${msg.timestamp.getTime()}`}
                className={`p-3 rounded-2xl max-w-[80%] sm:max-w-[85%] shadow-sm ${
                  msg.type === "user"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white self-end"
                    : "bg-white border border-gray-200 self-start"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline hover:text-blue-800"
                      >
                        {children}
                      </a>
                    ),
                    p: ({ children }) => (
                      <p className="whitespace-pre-line">{children}</p>
                    ),
                    // Handle custom colored text
                    span: ({ children, ...props }) => (
                      <span {...props}>{children}</span>
                    ),
                  }}
                >
                  {renderColoredText(msg.text)}
                </ReactMarkdown>
                <div
                  className={`text-xs mt-1 ${
                    msg.type === "user" ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}

            {error && (
              <div className="p-3 rounded-2xl max-w-[80%] sm:max-w-[85%] shadow-sm bg-red-50 border border-red-200 self-start flex items-center gap-2">
                <span className="text-sm text-red-600">{error}</span>
                <button
                  onClick={handleRetry}
                  className="text-xs bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700 transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {loading && (
              <div className="bg-white border border-gray-200 self-start p-3 rounded-2xl shadow-sm flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span>Eco Tourism is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-3 sm:px-4 py-2 sm:pb-3">
              <p className="text-green-700 font-semibold text-sm mb-1">
                Popular:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs bg-white border border-green-200 text-green-700 py-2 px-3 rounded-full hover:bg-green-100 hover:border-green-300 transition-all duration-150 text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Held Image Preview */}
          {heldImage && (
            <div className="px-3 py-2 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">📸</span>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Image Ready
                    </p>
                    <p className="text-xs text-blue-600 truncate max-w-[150px] sm:max-w-[200px]">
                      {heldImageName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeHeldImage}
                  className="text-blue-700 hover:text-red-600 hover:bg-red-50 rounded-full p-1 transition-all text-lg sm:text-xl"
                  title="Remove image"
                  aria-label="Remove uploaded image"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t bg-white flex items-end gap-2">
            <div className="w-full relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  heldImage
                    ? "Add a message about the image..."
                    : "Ask about Sri Lanka's eco-tourism! 🌿"
                }
                className="w-full p-3 border-2 border-green-200 rounded-xl text-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all resize-none min-h-[60px] max-h-[120px]"
                rows={2}
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleTextSend();
                  }
                }}
              />
              {inputText.length > 100 && (
                <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                  {inputText.length}/500
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleTextSend}
                disabled={loading || (!inputText.trim() && !heldImage)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 shadow-sm disabled:bg-gray-300 disabled:scale-100"
                aria-label="Send message"
              >
                Send
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full text-xs border border-green-200 transition-all"
                title="Upload image"
                aria-label="Upload image"
              >
                📷
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-hidden="true"
            />
          </div>

          {/* Footer */}
          <div className="px-3 py-2 text-center bg-gradient-to-r from-green-600 to-emerald-600">
            <span className="text-xs text-white">
              🌍 Powered by Eco Tourism for sustainable tourism 🌿
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return typeof window !== "undefined" && document.body
    ? createPortal(chatWidget, document.body)
    : chatWidget;
};

export default EcoTourismChatWidget;
