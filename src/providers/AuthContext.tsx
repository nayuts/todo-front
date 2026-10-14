// src/providers/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
// 🌟 useCallback を追加でインポート
import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export type AuthContextType = {
  isAuthenticated: boolean;
  userName: string;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get("token"));
  const [userName, setUserName] = useState<string>("ゲスト");

  // 🌟 useCallbackでAPI取得関数を安全に使い回せるようにする！
  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const res = await axios.get("http://localhost:4000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.name);
    } catch (error) {
      console.error("プロフィール取得失敗", error);
    }
  }, []);

  // 初回アクセス時（リロード時）の処理
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      // ⚠️ API通信による意図的なState更新のため、Lintの警告を無効化
      /* eslint-disable */
      fetchUserProfile(token);
    }
  }, [fetchUserProfile]);

  const login = async (token: string) => {
    Cookies.set("token", token, { expires: 7 });
    setIsAuthenticated(true);
    await fetchUserProfile(token);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUserName("ゲスト");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
