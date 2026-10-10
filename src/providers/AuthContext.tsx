// src/providers/AuthContext.tsx
import { createContext, useState } from "react";
import type { ReactNode } from "react"; // 🌟 型だけをインポートする最新のクリーンな書き方
import Cookies from "js-cookie";

// 四次元ポケットの中身（型）を定義
export type AuthContextType = {
  isAuthenticated: boolean; // 現在ログイン中かどうか
  login: (token: string) => void;
  logout: () => void;
};

// 🌟 ポケット（Context）の実体を作成して外部に公開する
// （※フックから参照するため、頭に export をつけます）
// ⚠️ エラーの先回り：Viteの開発環境（Fast Refresh）が「コンポーネント以外のexport」に過剰反応するため、この1行だけLintを無効化します
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 🌟 アプリ全体を包み込んでデータを提供するラッパーコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  // 初期値は「Cookieにトークンが存在するかどうか（存在すれば true、なければ false）」
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get("token"));

  const login = (token: string) => {
    Cookies.set("token", token, { expires: 7 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
