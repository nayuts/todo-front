// src/pages/Todo.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTodos, type TodoType } from "../hooks/useTodos";

export function TodoModal() {
  const { logout } = useAuth();
  const { todos, error, fetchTodos, addTodo, deleteTodo, updateTodo } = useTodos();

  // 🌟 モーダルの開閉状態を切り替えるためのState（最初はどちらも非表示の false）
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null); // nullなら編集モーダルは閉じている状態

  // 🌟 フォームへの入力内容を一時保存するState
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // 新規追加モーダルの「追加する」ボタンが押された時の処理
  const handleAddSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addTodo(formTitle, formDesc);
    setIsAddModalOpen(false); // 登録が終わったらモーダルをスッと閉じる
    setFormTitle("");
    setFormDesc(""); // 入力欄を綺麗にお掃除（リセット）
  };

  // 編集モーダルの「更新する」ボタンが押された時の処理
  const handleEditSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTodo) return;
    await updateTodo(editingTodo.id, formTitle, formDesc);
    setEditingTodo(null); // 更新が終わったらモーダルを閉じる
  };

  // 既存のTodoの「編集」ボタンを押した時の処理
  const openEditModal = (todo: TodoType) => {
    // 💡 新たにAPI通信をせず、手元にあるデータをそのままフォームにセットしてモーダルを開く！
    setFormTitle(todo.title);
    setFormDesc(todo.description);
    setEditingTodo(todo);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📋 Todo一覧</h2>
        <button
          onClick={logout}
          style={{ padding: "5px 10px", backgroundColor: "gray", color: "white" }}
        >
          ログアウト
        </button>
      </div>

      {/* クリックされたら、追加用モーダルのフラグを true にしてフォームを空にする */}
      <button
        onClick={() => {
          setIsAddModalOpen(true);
          setFormTitle("");
          setFormDesc("");
        }}
        style={{ margin: "20px 0", padding: "10px", backgroundColor: "blue", color: "white" }}
      >
        + 新規Todo追加
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Todoリストの表示 */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "15px",
              backgroundColor: "white",
            }}
          >
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => openEditModal(todo)}>編集</button>
              <button onClick={() => deleteTodo(todo.id)} style={{ color: "red" }}>
                削除
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* ==================================================
          🚀 新規追加モーダル（isAddModalOpen が true の時だけ画面に現れる）
          ================================================== */}
      {isAddModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>✨ 新規Todo追加</h3>
            <form
              onSubmit={handleAddSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}
            >
              <div>
                <label style={{ fontWeight: "bold" }}>タイトル</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="タスクのタイトル"
                  required
                  style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                />
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>詳細</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="タスクの詳細を入力してください"
                  rows={4}
                  required
                  style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: "blue",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  追加する
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          🚀 編集モーダル（editingTodo にデータが入っている時だけ画面に現れる）
          ================================================== */}
      {editingTodo && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h3 style={{ textAlign: "center" }}>✏️ Todo編集</h3>
            <form
              onSubmit={handleEditSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}
            >
              <div>
                <label style={{ fontWeight: "bold" }}>タイトル</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="タスクのタイトル"
                  required
                  style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                />
              </div>
              <div>
                <label style={{ fontWeight: "bold" }}>詳細</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="タスクの詳細を入力してください"
                  rows={4}
                  required
                  style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: "green",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  更新する
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
