interface StudyHistoryProps {
  conversations: Conversation[];
  onSelect: (content: { id: string; text: string }) => void;
}

export default function StudyHistory({ conversations, onSelect }: StudyHistoryProps) {
  return (
    <div className="study-history">
      {conversations.length === 0 && <p>Nenhum histórico encontrado.</p>}
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className="history-item"
          onClick={() =>
            onSelect({ id: conv.id, text: conv.title }) // passa id e conteúdo para o App
          }
        >
          <p>{conv.title}</p>
          <small>{new Date(conv.updatedAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
