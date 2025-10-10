import { useEffect, useState } from "react";
import "./overview.scss";

interface OverviewProps {
  text: string;
  userId: string;
  contentId: string;
}

function Overview({ text, userId, contentId }: OverviewProps) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text) return;

    const fetchSummary = async () => {
      try {
        setLoading(true);

        const prompt = `
Você é um assistente de estudos. Receba o conteúdo que vou enviar e gere um resumo objetivo.

Instruções:
- Use somente o texto fornecido — não adicione informações externas.
- Destaque os principais pontos.
- Organize em parágrafos curtos ou tópicos numerados.
- Aponte curiosidades quando houver.
- Use uma linguagem muito simples, clara e fácil de entender por qualquer pessoa, inclusive quem não tem conhecimento prévio sobre o assunto.
- Use uma linguagem muito simples, clara e fácil de entender por qualquer pessoa, principalmente para artigos científicos.
- Evite termos técnicos, jargões ou palavras complexas.
- Não inclua cumprimentos, comentários pessoais ou qualquer texto extra; apenas gere o conteúdo puro.
Conteúdo a ser resumido:
"${text}"
`;

        const response = await fetch("https://chatbot-api-wz81.onrender.com/overview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: prompt,
            sessionId: contentId,
          }),
        });

        if (!response.ok) {
          console.error("Erro ao gerar resumo:", response.statusText);
          setSummary("Erro ao gerar resumo.");
          return;
        }

        const summaryText = await response.text();
        setSummary(summaryText);
      } catch (err) {
        console.error(err);
        setSummary("Erro ao gerar resumo.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [text, userId, contentId]);

  return (
    <div className="overview-wrapper">
      <h2 className="overview-title">Resumo do Conteúdo</h2>

      <div className="overview-card">
        {loading ? (
          <p className="overview-loading">Gerando resumo...</p>
        ) : summary ? (
          <p
            className="overview-text"
            dangerouslySetInnerHTML={{
              __html: summary.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
            }}
          ></p>
        ) : (
          <p className="overview-empty">Nenhum resumo disponível.</p>
        )}
      </div>
    </div>
  );
}

export default Overview;
