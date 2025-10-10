import { useState, useRef, useEffect } from "react";
import { auth } from "../Firebase/FirebaseConfig.js";
import "./chatInput.scss";

function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return false;

    if (!user) {
      alert("Entre com sua conta do Google enviar sua pergunta.");
      return false;
    }

    onSend(trimmed);
    return true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="user-part">
      <div className="promo-div">
        <h3 className="promo-title">
          Submit your content and start your <br />
          <span className="promo-word word-1">Journey</span>
          <span className="promo-word word-2">For</span>
          <span className="promo-word word-3">Mastery</span>
        </h3>
      </div>
      <form onSubmit={onFormSubmit} className="user-form">
        <textarea
          ref={textareaRef}
          className="user-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Envie o material de estudo..."
          rows={1}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="send-button">
          Enviar material de estudo
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
