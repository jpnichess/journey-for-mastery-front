import { auth } from "../Firebase/FirebaseConfig.ts";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./auth.scss";

function Login() {
  const LoginGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário Logado:", result.user);
    } catch (error) {
      console.log("Erro ao logar na conta", error);
    }
  };
  return (
    <div className="auth">
      <button onClick={LoginGoogle} className="login_btn">
        Entrar com Google
      </button>
    </div>
  );
}

export default Login;
