import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../Header/Header";

interface Question {
  question: string;
  options: string[];
  answer: number; // agora é number
}

interface QuizResponse {
  quiz: Question[];
  error?: string;
}

function QuestionsPage() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const userId = searchParams.get("userId") || "guest";
  const contentId = searchParams.get("contentId") || "EXEMPLO_CONTENT_ID";
  const text = searchParams.get("text") || "";

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
        body: JSON.stringify({ text, userId, contentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}`);
      }

      if (!data.quiz || !Array.isArray(data.quiz)) {
        throw new Error("O backend não retornou um quiz válido.");
      }

      setQuestions(data.quiz);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro desconhecido ao gerar questões.");
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

  return (
    <>
      <Header user={null} />
      <main style={{ padding: "1rem" }}>
        <h1>🧩 Simulado</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {questions.length === 0 && (
          <button
            onClick={generateQuestions}
            disabled={loading || !text.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            {loading ? "Gerando questões..." : "Gerar Questões"}
          </button>
        )}

        {questions.length > 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            style={{ marginTop: "1rem" }}
          >
            {questions.map((q, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <p>
                  <strong>
                    {index + 1}. {q.question}
                  </strong>
                </p>

                {q.options.map((opt, i) => (
                  <label
                    key={i}
                    style={{
                      display: "block",
                      marginBottom: "0.25rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={i + 1}
                      checked={userAnswers[index] === i + 1}
                      onChange={() => handleOptionChange(index, i + 1)}
                      disabled={submitted}
                    />{" "}
                    {opt}
                  </label>
                ))}

                {submitted && (
                  <p
                    style={{
                      color:
                        userAnswers[index] === q.answer ? "green" : "crimson",
                      marginTop: "0.5rem",
                    }}
                  >
                    {userAnswers[index] === q.answer
                      ? "✅ Correto!"
                      : `❌ Errado. Resposta certa: ${q.options[q.answer - 1]}`}
                  </p>
                )}
              </div>
            ))}

            {!submitted ? (
              <button
                type="submit"
                style={{
                  padding: "0.75rem 1.5rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Enviar Respostas
              </button>
            ) : (
              <div style={{ marginTop: "1rem" }}>
                <h3>
                  🏁 Resultado: {score} de {questions.length} acertos (
                  {((score / questions.length) * 100).toFixed(0)}%)
                </h3>
                <button
                  onClick={generateQuestions}
                  style={{
                    padding: "0.75rem 1.5rem",
                    marginTop: "1rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    borderRadius: "8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                  }}
                >
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
