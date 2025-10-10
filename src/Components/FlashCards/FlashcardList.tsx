import { useEffect, useState } from "react";
import Cards from "./Cards";
import "./flashcards.scss";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardListProps {
  text: string;
  userId: string;
  contentId: string;
}

function FlashcardList({ text }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  const colors = ["#FFE169", "#FF6F91", "#70E000", "#4CC9F0", "#6C8EBF"];

  useEffect(() => {
    async function generateFlashcards() {
      setLoading(true);

      try {
        const response = await fetch(
          "http://localhost:3000/generate-flashcards",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: "sessionId", text }),
          }
        );

        const data = await response.json();
        setFlashcards(data.flashcards || []);
      } catch (err) {
        console.error(err);
        setFlashcards([]);
      } finally {
        setLoading(false);
      }
    }

    generateFlashcards();
  }, [text]);

  return (
    <div className="flashcard-section">
      <div className="flashcard-wrapper">
        <h1 className="flashcard-title">Geração de Flashcards</h1>

        {loading ? (
          <p className="flashcard-loading">Gerando flashcards...</p>
        ) : flashcards.length === 0 ? (
          <p className="flashcard-empty">Nenhum flashcard disponível.</p>
        ) : (
          <div className="flashcard-list">
            {flashcards.map((f, i) => {
              const color = colors[i % colors.length];
              return (
                <Cards
                  key={i}
                  question={f.question}
                  answer={f.answer}
                  color={color}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashcardList;
