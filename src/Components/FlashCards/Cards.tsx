import { useState } from "react";
import "./flashcards.scss";

interface FlashcardCardProps {
  pergunta: string;
  resposta: string;
}

function Cards({ pergunta, resposta }: FlashcardCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="front">{pergunta}</div>
      <div className="back">{resposta}</div>
    </div>
  );
}

export default Cards;
