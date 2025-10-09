import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/FirebaseConfig";

export default function ContentPage({ userId }: { userId: string }) {
  const [text, setText] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const contentId = params.get("contentId");

  useEffect(() => {
    async function fetchContent() {
      if (!userId || !contentId) return;

      const contentRef = doc(db, "users", userId, "contents", contentId);
      const contentSnap = await getDoc(contentRef);

      if (contentSnap.exists()) {
        setText(contentSnap.data().text);
      }
    }

    fetchContent();
  }, [userId, contentId]);

  return (
    <div>
      <h2>Conteúdo</h2>
      <p>{text}</p>
    </div>
  );
}
