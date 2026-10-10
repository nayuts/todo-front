import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./providers/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 🌟 アプリ全体を Provider で包むことで、どこでもログイン状態が共有されます */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
