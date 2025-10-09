import { useEffect, useState } from "react";
import Cards from "./Cards";
import "./flashcards.scss";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardListProps {
  text: string;
}

function FlashcardList({ text }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  const colors = [
    "#FFD166", 
    "#EF476F", 
    "#06D6A0", 
    "#118AB2", 
    "#073B4C", 
  ];

  useEffect(() => {
    async function generateFlashcards() {
      setLoading(true);

      const response = await fetch("http://localhost:3000/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "SESSAO_FIXA_POR_ENQUANTO",
          text,
        }),
      });

      const data = await response.json();
      setFlashcards(data.flashcards || []);
      setLoading(false);
    }

    generateFlashcards();
  }, [text]);

  if (loading) return <p>Gerando flashcards...</p>;
  if (flashcards.length === 0) return null;

  return (
    <div className="flashcard-wrapper">
      <h1 className="flashcard-title">Geração de Flashcards</h1>
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
    </div>
  );
}

export default FlashcardList;
