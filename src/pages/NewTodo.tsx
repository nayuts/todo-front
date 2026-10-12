// src/pages/NewTodo.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTodos } from "../hooks/useTodos";
// import axios from "axios";

export function NewTodo() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { addTodo, error } = useTodos();

  // フォームが送信（Submit）された時の処理
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // ⚠️ エラーの先回り：画面リロードを防ぐための1行
    e.preventDefault();

    await addTodo(title, description);
    navigate("/todos");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>✨ 新規Todo追加</h2>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
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
          style={{ padding: "10px", backgroundColor: "blue", color: "white", fontSize: "16px" }}
        >
          追加する
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
