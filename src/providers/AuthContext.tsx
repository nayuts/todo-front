// src/providers/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
// 🌟 React Query のフックをインポート
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export type AuthContextType = {
  isAuthenticated: boolean;
  userName: string;
  login: (token: string) => void; // 🌟 同期処理に戻るため Promise<void> から void に変更
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 🌟 APIを叩く純粋な関数（Contextの外に出してスッキリ！）
const fetchUserProfile = async (token: string): Promise<string> => {
  const res = await axios.get("http://localhost:4000/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.name;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // isAuthenticated という独立したStateを廃止し、tokenの有無だけで管理する安全な設計へ！
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  const queryClient = useQueryClient();

  // 🌟 ここがReact Query（useQuery）！
  // tokenが存在する(enabled: !!token)時だけ、自動的に fetchUserProfile が実行されます。
  // useEffect を使った手動のバケツリレーはもう不要です。
  const { data: userName = "ゲスト" } = useQuery({
    queryKey: ["userProfile", token], // tokenが変わるたびに自動で再取得
    queryFn: () => fetchUserProfile(token!),
    enabled: !!token,
  });

  const login = (newToken: string) => {
    Cookies.set("token", newToken, { expires: 7 });
    setToken(newToken); // 🌟 Stateが変わると、上のuseQueryが自動でプロフィールを取りに行ってくれる！
  };

  const logout = () => {
    Cookies.remove("token");
    setToken(undefined);
    // 🌟 ログアウト時は、React Queryのキャッシュ（記憶）も綺麗にお掃除する
    queryClient.removeQueries({ queryKey: ["userProfile"] });
  };

  return (
    // !!token で「tokenがあればtrue、なければfalse」という真偽値に変換
    <AuthContext.Provider value={{ isAuthenticated: !!token, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
