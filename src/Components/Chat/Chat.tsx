import { useState, useEffect, useRef } from "react";
import "./chat.scss";

type Message = {
  id: string | number;
  text: string;
  sender: "user" | "bot";
};

interface ChatProps {
  text: string;
  userId: string;
  contentId: string;
}

export default function Chat({ userId, contentId }: ChatProps) {
  // Default messages of JFM Chat
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Já captei o conteúdo", sender: "bot" },
    { id: 2, text: "Alguma dúvida antes de resolver questões?", sender: "bot" },
  ]);
  const [chatMessage, setChatMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);

  const sessionId = contentId || userId || "guest";


  useEffect(() => {
    if (chatTextareaRef.current) {
      chatTextareaRef.current.style.height = "auto";
      chatTextareaRef.current.style.height =
        chatTextareaRef.current.scrollHeight + "px";
    }
  }, [chatMessage]);

  const handleSend = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    // Users message
    const userMsg: Message = { id: Date.now(), text: trimmed, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setChatMessage("");

    const botId = Date.now() + 1;
    setMessages((prev) => [...prev, { id: botId, text: "", sender: "bot" }]);

    try {
      const res = await fetch("http://localhost:3000/stream-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });

      if (!res.body) throw new Error("Resposta do servidor inválida");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId ? { ...msg, text: fullText } : msg
          )
        );
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botId ? { ...msg, text: "Erro ao gerar resposta." } : msg
        )
      );
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(chatMessage);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(chatMessage);
  };

  return (
    <div className="chat-main">
      <h1 className="chat-title">JFM Chat</h1>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-card ${msg.sender}`}>
              {msg.sender === "bot" ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-wrapper">
          <form onSubmit={handleFormSubmit} className="chat-input-form">
            <textarea
              ref={chatTextareaRef}
              className="chat-textarea"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={1}
              onKeyDown={handleTextareaKeyDown}
            />
            <button type="submit" className="chat-send-button">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
