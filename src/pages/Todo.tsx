// src/pages/Todo.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

type TodoItem = {
  id: number;
  title: string;
  description: string;
};

export function Todo() {
  const navigate = useNavigate();
  // 取得したTodoを保存する箱（最初は空っぽの配列）
  const [todos, setTodos] = useState<TodoItem[]>([]);
  // エラーメッセージを表示するための箱
  const [error, setError] = useState("");

  // 🌟 useCallback で関数全体を包み込み、「メモ化（保存）」する！
  const fetchTodos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      // ⚠️ エラーの先回り：トークンがない場合はログイン画面へ弾く
      if (!token) {
        navigate("/login");
        return;
      }

      // axiosでサーバーにリクエストを送信 (GETメソッド)
      const response = await axios.get("http://localhost:4000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 取得したデータを箱に入れる
      setTodos(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Todoの取得に失敗しました");
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  }, [navigate]); // 🌟 fetchTodos の中で使っている外部の変数（navigate）をここに指定します

  // 🌟 画面が表示された「最初の一回だけ」実行する
  useEffect(() => {
    // ⚠️ エラーの先回り：最新のLintルールの誤検知を防ぐコメント
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, [fetchTodos]); // 🌟 useCallbackのおかげで、ここに入れても無限ループになりません！

  // ログアウト処理
  const handleLogout = () => {
    // 1. localStorageからトークンを削除（シュレッダーにかけるイメージです）
    localStorage.removeItem("token");
    // 2. ログイン画面へ強制移動
    navigate("/login");
  };

  // 🗑️ 削除処理を追加
  const handleDelete = async (id: number) => {
    // ⚠️ エラーの先回り：誤操作防止のために確認ダイアログを出す
    if (!window.confirm("本当に削除しますか？")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // 🌟 axiosでサーバーに削除リクエスト（DELETEメソッド）を送信
      // URLの末尾に「どのIDを消すか」を指定します
      await axios.delete(`http://localhost:4000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 💡 画面上のリストからも該当のTodoを消す（再取得しなくて済むエコな書き方！）
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Todoの削除に失敗しました");
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📋 Todo一覧</h2>
        <button
          onClick={handleLogout}
          style={{ padding: "5px 10px", backgroundColor: "gray", color: "white" }}
        >
          ログアウト
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/todos/new">
          <button
            style={{ padding: "10px", backgroundColor: "blue", color: "white", width: "100%" }}
          >
            新しいTodoを追加
          </button>
        </Link>
      </div>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{todo.title}</h3>
            <p style={{ margin: "0 0 15px 0", color: "#555" }}>{todo.description}</p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              {/* ✏️ 編集画面へのリンク（3-2で使用します） */}
              <Link to={`/todos/${todo.id}/edit`}>
                <button
                  style={{
                    padding: "5px 15px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  編集
                </button>
              </Link>

              {/* 🗑️ 削除ボタンを追加 */}
              <button
                onClick={() => handleDelete(todo.id)}
                style={{
                  padding: "5px 15px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
