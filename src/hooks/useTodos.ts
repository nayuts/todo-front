// src/hooks/useTodos.ts
import { useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export type TodoType = {
  id: number;
  title: string;
  description: string;
};

// 🌟 Todoに関する操作（CRUD）をすべてまとめた自分専用のカスタムフック
export function useTodos() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState("");

  // 毎回ヘッダーにトークンを乗せる処理を自動化する便利関数
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${Cookies.get("token")}` },
  });

  // 1. 全件取得（GET）
  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/todos", getHeaders());
      setTodos(res.data);
    } catch (err) {
      if (axios.isAxiosError(err)) setError("データの取得に失敗しました");
    }
  }, []);

  // 2. 1件だけ取得（GET: 既存の編集画面用）
  const fetchTodo = useCallback(async (id: string) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/todos/${id}`, getHeaders());
      return res.data; // コンポーネント側で直接データを受け取るため、値をそのまま返す
    } catch (err) {
      if (axios.isAxiosError(err)) setError("データの取得に失敗しました");
      return null;
    }
  }, []);

  // 3. 追加（POST）
  const addTodo = async (title: string, description: string) => {
    try {
      await axios.post("http://localhost:4000/api/todos", { title, description }, getHeaders());
      fetchTodos(); // 追加に成功したら、自動で最新の一覧を取り直して画面を更新する
    } catch (err) {
      if (axios.isAxiosError(err)) setError("Todoの追加に失敗しました");
    }
  };

  // 4. 削除（DELETE）
  const deleteTodo = async (id: number) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await axios.delete(`http://localhost:4000/api/todos/${id}`, getHeaders());
      // 💡 画面のリストからも削除したIDのものを除外してあげる
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) setError("Todoの削除に失敗しました");
    }
  };

  // 5. 更新（PUT）
  // ==========================================
  // 🚀 演習課題：ここに updateTodo 関数を作成しよう！
  // ==========================================
  // [ヒント1] 引数は (id: number, title: string, description: string) を受け取ります
  // [ヒント2] axios.put() を使って特定のURL `.../api/todos/${id}` へデータを送信します
  // [ヒント3] 第2引数に送るデータ、第3引数に getHeaders() を渡します
  // [ヒント4] 成功したら fetchTodos() を呼んで最新の一覧に更新します

  const updateTodo = async (id: number, title: string, description: string) => {
    try {
      await axios.put(
        `http://localhost:4000/api/todos/${id}`,
        { title, description },
        getHeaders(),
      );
      fetchTodos();
    } catch (err) {
      if (axios.isAxiosError(err)) setError("Todoの更新に失敗しました");
    }
  };

  // フックの外側（コンポーネント）で自由に使いたいものだけを厳選して return する
  return {
    todos,
    error,
    fetchTodos,
    fetchTodo,
    addTodo,
    deleteTodo,
    updateTodo,
  };
}
