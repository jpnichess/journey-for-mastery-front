import "./header.scss";
import Login from "../Auth/Login";
import Logout from "../Auth/Logout";
import { useState, useEffect } from "react";
import { IoReorderThree } from "react-icons/io5";
import StudyHistory from "../Menu/StudyHistory";
import { auth } from "../Firebase/FirebaseConfig";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    if (openMenu) {
      document.body.classList.add("menu-open-body");
    } else {
      document.body.classList.remove("menu-open-body");
    }
  }, [openMenu]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) fetchHistory(user.uid);
    });

    return () => unsubscribe();
  }, []);

  async function fetchHistory(uid: string) {
    try {
      const res = await fetch(`http://localhost:3000/history/${uid}`);
      const data = await res.json();
      setConversations(data.history);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    }
  }

  return (
    <header className="header">
      <div className={`header-wrapper ${openMenu ? "menu-open" : ""}`}>
        <button className="menu-button" onClick={() => setOpenMenu(!openMenu)}>
          <IoReorderThree />
        </button>
        <h1 className="title">Chat JP</h1>
        <div className="login-section">
          {currentUser ? <Logout user={currentUser} /> : <Login />}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${openMenu ? "open" : ""}`}>
        <StudyHistory conversations={conversations} />
      </div>

      <div
        className={`overlay ${openMenu ? "active" : ""}`}
        onClick={() => setOpenMenu(false)}
      />
    </header>
  );
}
