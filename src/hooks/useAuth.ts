// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext"; // 土台をインポート

// 🌟 どこからでもポケットの中身を取り出せるCustom Hook
export function useAuth() {
  return useContext(AuthContext);
}
