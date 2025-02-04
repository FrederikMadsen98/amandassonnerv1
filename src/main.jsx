import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { auth } from "./firebase"; // Importér Firebase Auth

console.log("Firebase Auth: ", auth); // Debugging

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
