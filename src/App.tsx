import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "./Components/Header/Header";
import ChatInput from "./Components/ChatInput/ChatInput";
import FlashcardList from "./Components/FlashCards/FlashcardList";
import Overview from "./Components/Overview/Overview";
import { auth, db } from "./Components/Firebase/FirebaseConfig";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import StudyHistory from "./Components/Menu/StudyHistory";

function App() {
  const [material, setMaterial] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Monitora login do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Ao enviar o material
  const handleSendMaterial = async (text: string) => {
    setMaterial(text);

    if (!user) return;

    // Cria um novo contentId
    const newContentId = uuidv4();
    setContentId(newContentId);

    // Salva o texto original no Firestore
    const contentRef = doc(db, "users", user.uid, "contents", newContentId);
    await setDoc(contentRef, {
      text,
      title: text.slice(0, 30) + "...", // título para o menu
      overview: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  // Navega para a página de simulado
  const goToQuestions = () => {
    if (!user || !contentId || !material) return;

    const query = new URLSearchParams();
    query.set("userId", user.uid);
    query.set("contentId", contentId);
    query.set("text", material);

    navigate(`/questions?${query.toString()}`);
  };

  return (
    <>
<Header
  user={user}
  material={material}
  setMaterial={setMaterial}
  setContentId={setContentId}
/>

      <main>
        <h1>Seção de Flashcards</h1>

        {/* Input do usuário */}
        <ChatInput onSend={handleSendMaterial} />

        {/* Exibição direta sem carrossel */}
        {material && contentId && (
          <>
            <FlashcardList
              text={material}
              userId={user?.uid ?? "guest"}
              contentId={contentId}
            />

            <Overview
              text={material}
              userId={user?.uid ?? "guest"}
              contentId={contentId}
            />

            {/* Botão para ir ao simulado */}
            <button
              onClick={goToQuestions}
              style={{
                display: "block",
                margin: "2rem auto",
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Ir para Simulado
            </button>
          </>
        )}
      </main>
    </>
  );
}

export default App;
