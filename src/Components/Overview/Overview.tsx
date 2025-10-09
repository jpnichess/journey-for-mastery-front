import { useEffect, useState } from "react";
import Slider from "react-slick";

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

        // Prompt específico para gerar resumo
        const prompt = `
Resuma o seguinte conteúdo em português, de forma concisa e objetiva, com até 300 caracteres:
"${text}"
`;

        const response = await fetch("http://localhost:3000/stream-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: prompt,
            sessionId: contentId, // pode usar contentId como sessionId para organizar por material
          }),
        });

        if (!response.ok) {
          console.error("Erro ao gerar summary:", response.statusText);
          setSummary("Erro ao gerar resumo.");
          return;
        }

        // Como é stream, vamos ler todo o texto de uma vez
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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
  };

  return (
    <div className="overview-container">
      {loading ? (
        <p>Gerando resumo...</p>
      ) : summary ? (
        <Slider {...settings} className="overview-slider">
          <div className="overview-slide">{summary}</div>
        </Slider>
      ) : (
        <p>Sem resumo disponível.</p>
      )}
    </div>
  );
}

export default Overview;
