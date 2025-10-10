import "./header.scss";
import Login from "../Auth/Login";
import Logout from "../Auth/Logout";
import { useState, useEffect } from "react";
import { auth } from "../Firebase/FirebaseConfig";
import logo from "../../../assets/jfm-logo.png";

export default function Header() {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);


  return (
    <header className="header">
      <div className="header-wrapper">
        <a href="" className="about-section">Sobre</a>

        <h1 className="logo">
          <img src={logo} alt="Logo JFM" />
        </h1>

        <div className="login-section">
          {currentUser ? <Logout user={currentUser} /> : <Login />}
        </div>
      </div>
    </header>
  );
}
