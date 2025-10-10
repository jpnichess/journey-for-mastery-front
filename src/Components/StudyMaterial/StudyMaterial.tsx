import { useNavigate } from "react-router-dom";
import FlashcardList from "../FlashCards/FlashcardList";
import Overview from "../Overview/Overview";
import Chat from "../Chat/Chat";
import "./simulate.scss";

interface StudyMaterialProps {
  material: string;
  userId: string;
  contentId: string;
  buttonLabel?: string;
}

export default function StudyMaterial({
  material,
  userId,
  contentId,
}: StudyMaterialProps) {
  const navigate = useNavigate();

  const handleNavigateAndGenerate = (level: "easy" | "medium" | "hard") => {
    if (!userId || !contentId || !material) return;

    const query = new URLSearchParams();
    query.set("userId", userId);
    query.set("contentId", contentId);
    query.set("text", material);
    query.set("difficulty", level);

    navigate(`/questions?${query.toString()}`);
  };

  return (
    <div className="study-material-wrapper">
      <FlashcardList text={material} userId={userId} contentId={contentId} />
      <Overview text={material} userId={userId} contentId={contentId} />
      <Chat text={material} userId={userId} contentId={contentId} />

      <div className="simulate-wrapper">
        <div>
          <h1 className="simulate-title">
            Vamos ver quanto você aprendeu? <br />
          </h1>
        </div>
        <label htmlFor="dificulty-buttons" className="simulate-label">
          Escolha o nível e comece o simulado:
        </label>
        <div className="difficulty-buttons">
          <button
            className="difficulty-btn easy"
            onClick={() => handleNavigateAndGenerate("easy")}
          >
            Fácil
          </button>
          <button
            className="difficulty-btn medium"
            onClick={() => handleNavigateAndGenerate("medium")}
          >
            Médio
          </button>
          <button
            className="difficulty-btn hard"
            onClick={() => handleNavigateAndGenerate("hard")}
          >
            Difícil
          </button>
        </div>
      </div>
    </div>
  );
}
