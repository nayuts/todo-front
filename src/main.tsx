// src/main.tsx
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AuthProvider } from "./providers/AuthContext";

// 🌟 React Queryのツールをインポート
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 🌟 アプリ全体でデータを管理する「貯蔵庫（クライアント）」を作成
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 🌟 アプリ全体を QueryClientProvider で包み込む！ */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
