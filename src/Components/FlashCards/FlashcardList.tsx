import { useEffect, useState } from "react";
import Cards from "./Cards";
import "./flashcards.scss";

interface Flashcard {
  pergunta: string;
  resposta: string;
}

interface FlashcardListProps {
  text: string; // texto enviado pelo ChatInput
}

function FlashcardList({ text }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function generateFlashcards() {
      setLoading(true);

      // Aqui você chama a API que gera os flashcards
      const response = await fetch(
        "http://localhost:3000/generate-flashcards",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "SESSAO_FIXA_POR_ENQUANTO",
            text, // seu conteúdo
          }),
        }
      );

      const data = await response.json();
      setFlashcards(data.flashcards || []);
      setLoading(false);
    }

    generateFlashcards();
  }, [text]);

  if (loading) return <p>Gerando flashcards...</p>;
  if (flashcards.length === 0) return null;

  return (
    <div className="flashcard-list">
      {flashcards.map((f, i) => (
        <Cards key={i} pergunta={f.pergunta} resposta={f.resposta} />
      ))}
    </div>
  );
}

export default FlashcardList;
