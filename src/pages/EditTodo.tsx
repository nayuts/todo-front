// src/pages/EditTodo.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTodos } from "../hooks/useTodos";

export function EditTodo() {
  const navigate = useNavigate();
  // 🌟 URLから `:id` の部分を抜き出すフック
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { fetchTodo, updateTodo, error } = useTodos();

  // 画面が開いたときに、編集対象のTodoデータを1件だけ取得する
  useEffect(() => {
    const loadTodo = async () => {
      if (!id) return;
      const data = await fetchTodo(id);
      if (data) {
        setTitle(data.title);
        setDescription(data.description);
      }
    };
    loadTodo();
  }, [id, fetchTodo]);

  // フォームが送信された時の処理
  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // ⚠️ エラーの先回り：画面のリロードを防ぐための1行！
    e.preventDefault();

    await updateTodo(Number(id), title, description);
    alert("更新しました！");
    navigate("/todos");
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
