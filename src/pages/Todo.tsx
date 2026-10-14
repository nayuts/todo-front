// src/pages/Todo.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🌟 ログアウト後の画面移動用
import { useAuth } from "../hooks/useAuth";
import { useTodos, type TodoType } from "../hooks/useTodos";

// 🌟 React Icons と 自作の Button コンポーネントをインポート！
import {
  FaPenToSquare,
  FaListUl,
  FaPlus,
  FaArrowRightFromBracket,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa6";
import { Button } from "../components/Button";

// 🌟 作成した CSS Modules を styles という名前で読み込む
import styles from "./Todo.module.css";

export function Todo() {
  const { logout, userName } = useAuth();
  const navigate = useNavigate();
  const { todos, error, fetchTodos, addTodo, deleteTodo, updateTodo } = useTodos();

  // 🌟 4-5と同じ：トークンの破棄は Context、画面移動はこの画面の担当
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
    // 🌟 styles.appContainer のように呼び出してモジュールクラスを適用する
    <div className={styles.appContainer}>
      {/* 🌟 サイドバー */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>
            <FaPenToSquare /> MY TODOS
          </h2>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            <li className={styles.active}>
              <FaListUl /> Todo一覧
            </li>
            <li
              onClick={() => {
                setIsAddModalOpen(true);
                setFormTitle("");
                setFormDesc("");
              }}
            >
              <FaPlus /> 新規Todo追加
            </li>
          </ul>
        </nav>
        <div className={styles.sidebarFooter}>
          {/* 🌟 自作したButtonコンポーネントを使用！ */}
          <Button onClick={handleLogout} fullWidth>
            ログアウト
          </Button>
        </div>
      </aside>

      {/* 🌟 メインコンテンツ */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          {/* 🌟 APIから取得した最新のユーザー名を表示！ */}
          <h1>Hello, {userName}!</h1>

          <div className={styles.userProfile}>
            {/* variant="danger" を指定するだけでスタイルが適用される！ */}
            <Button
              variant="danger"
              onClick={handleLogout}
              className={styles.mobileLogoutBtn}
              title="ログアウト"
            >
              <FaArrowRightFromBracket />
            </Button>
          </div>
        </header>

        <section className={styles.todoSection}>
          <div className={styles.sectionHeader}>
            <h2>TODO LIST</h2>
            <Button
              onClick={() => {
                setIsAddModalOpen(true);
                setFormTitle("");
                setFormDesc("");
              }}
            >
              <FaPlus /> 新規Task
            </Button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className={styles.todoList}>
            {todos.length > 0 && (
              <div className={styles.todoHeader}>
                <span>タイトル</span>
                <span>詳細</span>
                <span style={{ textAlign: "right" }}>アクション</span>
              </div>
            )}

            {todos.map((todo) => (
              <div key={todo.id} className={styles.todoItem}>
                <div className={styles.todoTitle}>{todo.title}</div>
                <div className={styles.todoDesc}>{todo.description}</div>
                <div className={styles.todoActions}>
                  <Button variant="secondary" onClick={() => openEditModal(todo)}>
                    編集
                  </Button>
                  <Button variant="danger" onClick={() => deleteTodo(todo.id)}>
                    <FaTrash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ==================================================
          🚀 新規追加モーダル（isAddModalOpen が true の時だけ画面に現れる）
          ================================================== */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              type="button"
              className={styles.btnClose}
              onClick={() => setIsAddModalOpen(false)}
            >
              <FaArrowLeft />
            </button>
            <h3 style={{ textAlign: "center" }}>✨ 新規Todo追加</h3>
            <form
              onSubmit={handleAddSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}
            >
              <div className={styles.formGroup}>
                <label style={{ fontWeight: "bold" }}>タイトル</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="タスクのタイトル"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label style={{ fontWeight: "bold" }}>詳細</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="タスクの詳細を入力してください"
                  rows={4}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <Button type="submit">追加する</Button>
                <Button type="button" variant="light" onClick={() => setIsAddModalOpen(false)}>
                  キャンセル
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          🚀 編集モーダル（editingTodo にデータが入っている時だけ画面に現れる）
          ================================================== */}
      {editingTodo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button type="button" className={styles.btnClose} onClick={() => setEditingTodo(null)}>
              <FaArrowLeft />
            </button>
            <h3 style={{ textAlign: "center" }}>✏️ Todo編集</h3>
            <form
              onSubmit={handleEditSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}
            >
              <div className={styles.formGroup}>
                <label style={{ fontWeight: "bold" }}>タイトル</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="タスクのタイトル"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label style={{ fontWeight: "bold" }}>詳細</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="タスクの詳細を入力してください"
                  rows={4}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <Button type="submit">更新する</Button>
                <Button type="button" variant="light" onClick={() => setEditingTodo(null)}>
                  キャンセル
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
