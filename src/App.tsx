import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "./Components/Firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Header from "./Components/Header/Header";
import ChatInput from "./Components/ChatInput/ChatInput";
import StudyMaterial from "./Components/StudyMaterial/StudyMaterial";
import type { User } from "firebase/auth";

function App() {
  const [material, setMaterial] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleSendMaterial = async (text: string) => {
    setMaterial(text);
    if (!user) return alert("Entre com sua conta do Google para começar.");

    const newContentId = uuidv4();
    setContentId(newContentId);

    const contentRef = doc(db, "users", user.uid, "contents", newContentId);
    await setDoc(contentRef, {
      text,
      title: text.slice(0, 30) + "...",
      overview: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <>
      <Header/>
      <main>
        <ChatInput onSend={handleSendMaterial} />
        {material && contentId && user && (
          <StudyMaterial
            material={material}
            userId={user.uid}
            contentId={contentId}
          />
        )}
      </main>
    </>
  );
}

export default App;
