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
    <div className="flashcard" onClick={() => setFlipped(!flipped)}>
      <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
        <div className="front" style={{ backgroundColor: color }}>
          {question}
        </div>
        <div className="back" style={{ backgroundColor: color }}>
          {answer}
        </div>
      </div>
    </div>
  );
}

export default Cards;
