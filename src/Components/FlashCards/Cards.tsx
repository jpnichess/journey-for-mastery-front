import { useState } from "react";
import "./flashcards.scss";

interface FlashcardCardProps {
  question: string;
  answer: string;
  color?: string; 
}

function Cards({ question, answer, color }: FlashcardCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="ticket" style={{ backgroundColor: color }}>
        <div className="front">{question}</div>
        <div className="back">{answer}</div>
      </div>
    </div>
  );
}

export default Cards;
