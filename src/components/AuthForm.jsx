import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/dashboard"); // 👈 Automatiske redirect efter login/oprettelse
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    
      // Hent brugerens rolle
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userRole = userDoc.exists() ? userDoc.data().role : null;
    
      if (userRole) {
        navigate("/dashboard"); // Sørg for at både admin og spiller sendes videre
      }
    } catch (err) {
      setError(err.message);
    }    
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Opret ny konto" : "Har du allerede en konto? Login"}
      </button>
    </div>
  );
};

export default AuthForm;