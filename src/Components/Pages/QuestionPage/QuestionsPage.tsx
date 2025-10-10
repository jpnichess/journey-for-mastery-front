import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../Header/Header";
import "./question-page.scss";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

function QuestionsPage() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const userId = searchParams.get("userId") || "guest";
  const contentId = searchParams.get("contentId") || "sessionId";
  const text = searchParams.get("text") || "";
  const difficulty = searchParams.get("difficulty") || "easy";

  useEffect(() => {
    if (text.trim()) {
      generateQuestions();
    }
  }, [text]);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    setSubmitted(false);
    setUserAnswers({});

    if (!text.trim()) {
      setError("O conteúdo não pode estar vazio.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, userId, contentId, difficulty }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}`);
      }

      if (!data.quiz || !Array.isArray(data.quiz)) {
        throw new Error("O backend não retornou um quiz válido.");
      }

      setQuestions(data.quiz);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message);
      } else {
        console.error(err);
        setError("Erro desconhecido ao gerar questões.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (qIndex: number, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = () => setSubmitted(true);

  const score = submitted
    ? questions.reduce(
        (acc, q, i) => (userAnswers[i] === q.answer ? acc + 1 : acc),
        0
      )
    : 0;

  const classifyScore = (percentage: number): string => {
    if (percentage < 40) return "Precisa estudar mais.";
    if (percentage >= 40 && percentage <= 69) return "Continue estudando";
    if (percentage >= 70 && percentage <= 90) return "À caminho da maestria";
    return "Mestre no assunto";
  };

  return (
    <>
      <Header />
      <main className="simulate-page">
        <h1 className="simulate-title">Simulado</h1>

        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">Gerando questões...</p>}

        {questions.length > 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {questions.map((q, index) => (
              <div className="question-card" key={index}>
                <p>
                  <strong>
                    {index + 1}. {q.question}
                  </strong>
                </p>
                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`options-label ${
                      userAnswers[index] === i ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={userAnswers[index] === i}
                      onChange={() => handleOptionChange(index, i)}
                      disabled={submitted}
                    />
                    {opt}
                  </label>
                ))}
                {submitted && (
                  <>
                    <p
                      className={`feedback ${
                        userAnswers[index] === q.answer ? "correct" : "wrong"
                      }`}
                    >
                      {userAnswers[index] === q.answer
                        ? "Correto!"
                        : `Errado. Resposta certa: ${q.options[q.answer]}`}
                    </p>
                    {q.explanation && (
                      <p className="explanation">Explicação: {q.explanation}</p>
                    )}
                  </>
                )}
              </div>
            ))}

            {!submitted ? (
              <button type="submit" className="submit-btn">
                Enviar Respostas
              </button>
            ) : (
              <div className="results">
                <h3>
                  Resultado: {score} de {questions.length} acertos (
                  {((score / questions.length) * 100).toFixed(0)}%)
                </h3>
                <p>
                  Classificação:{" "}
                  <strong>
                    {classifyScore((score / questions.length) * 100)}
                  </strong>
                </p>
                <button onClick={generateQuestions} className="new-quiz-btn">
                  Gerar Novo Simulado
                </button>
              </div>
            )}
          </form>
        )}
      </main>
    </>
  );
}

export default QuestionsPage;
