// src/hooks/useTodos.ts
import axios from "axios";
import Cookies from "js-cookie";
// 🌟 React Query の強力なフックたち
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type TodoType = {
  id: number;
  title: string;
  description: string;
};

// ヘッダーを生成する便利関数
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("token")}` },
});

export function useTodos() {
  const queryClient = useQueryClient();

  // ==========================================
  // 1. 取得 (GET): useQuery
  // ==========================================
  // 🌟 データの取得、ローディング状態(isLoading)、エラー状態(isError)をすべて自動管理！
  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"], // このデータの「名札」
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/api/todos", getHeaders());
      return res.data as TodoType[];
    },
  });

  // ==========================================
  // 2. 追加 (POST): useMutation
  // ==========================================
  const addTodoMutation = useMutation({
    mutationFn: async (newTodo: { title: string; description: string }) => {
      await axios.post("http://localhost:4000/api/todos", newTodo, getHeaders());
    },
    // 🌟 成功したら、['todos']という名札のデータを古いとみなし、自動でGETをやり直させる！
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  // ==========================================
  // 3. 削除 (DELETE): useMutation
  // ==========================================
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      if (!window.confirm("本当に削除しますか？")) throw new Error("Canceled");
      await axios.delete(`http://localhost:4000/api/todos/${id}`, getHeaders());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // ==========================================
  // 4. 更新 (PUT): useMutation
  // ==========================================
  const updateTodoMutation = useMutation({
    mutationFn: async (todo: { id: number; title: string; description: string }) => {
      await axios.put(
        `http://localhost:4000/api/todos/${todo.id}`,
        { title: todo.title, description: todo.description },
        getHeaders(),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // 🌟 コンポーネント側で使いやすいように、必要なものだけをreturnする
  return {
    todos,
    isLoading, // 👈 ロード中かどうかが一瞬でわかる！
    isError,
    // mutateAsync を渡すことで、今まで通り await addTodo(...) として使える
    addTodo: addTodoMutation.mutateAsync,
    deleteTodo: deleteTodoMutation.mutateAsync,
    updateTodo: updateTodoMutation.mutateAsync,
  };
}
