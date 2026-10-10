// src/pages/EditTodo.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function EditTodo() {
  const navigate = useNavigate();
  // 🌟 URLから `:id` の部分を抜き出すフック
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // 画面が開いたときに、編集対象のTodoデータを1件だけ取得する
  const fetchSingleTodo = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      // 特定のIDのTodoだけを取得 (GETメソッド)
      const response = await axios.get(`http://localhost:4000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 取得したデータをフォームの初期値としてセット！
      setTitle(response.data.title);
      setDescription(response.data.description);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "データの取得に失敗しました");
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSingleTodo();
  }, [fetchSingleTodo]);

  // フォームが送信された時の処理
  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // ⚠️ エラーの先回り：画面のリロードを防ぐための1行！
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      // ==========================================
      // 🚀 演習課題：ここに axios を使った PUT 処理を書こう！
      // ==========================================
      // [ヒント1] axios.put() を使います（バックエンドの仕様によっては patch の場合もあります）。
      // [ヒント2] URLは特定のTodoを指す `http://localhost:4000/api/todos/${id}` です。
      // [ヒント3] POSTの時と同様に、第2引数に { title, description } を渡します。
      // [ヒント4] 第3引数に headers: { Authorization: ... } を渡します。

      await axios.put(
        `http://localhost:4000/api/todos/${id}`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ==========================================

      // 成功したら一覧画面に戻る
      alert("更新しました！");
      navigate("/todos");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Todoの更新に失敗しました");
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>✏️ Todo編集</h2>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form
        onSubmit={handleUpdate}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label>タイトル</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div>
          <label>詳細</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", height: "100px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
          }}
        >
          更新する
        </button>
      </form>

      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/todos")}
          style={{
            border: "none",
            background: "none",
            color: "blue",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          キャンセルして戻る
        </button>
      </div>
    </div>
  );
}
