// src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export function Signup() {
  // 1. 入力された文字を管理するState
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 画面遷移を行うためのフック
  const navigate = useNavigate();

  // 🌟 <HTMLFormElement> を指定して、フォーム専用のイベントであることをTypeScriptに教えます
  const handleSignup = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // 🌟 超重要：フォーム送信時の画面リロード（チラつき）を防ぎます
    setError("");

    try {
      // 🌟 axiosを使ってバックエンドにデータを送信！
      // axiosなら JSON.stringify や Headers の設定を自動でやってくれます
      const response = await axios.post("http://localhost:4000/api/auth/signup", {
        name,
        email,
        password,
      });

      Cookies.set("token", response.data.token, { expires: 7 });
      alert("登録成功！Todo画面へ移動します。");

      // Todo画面へ自動で移動する
      navigate("/todos");

      // 🌟 any ではなく unknown（中身がわからない安全な箱）としてエラーを受け取ります
    } catch (err: unknown) {
      // 🌟 「これはAxiosが受け取ったエラーだ」と安全確認（型ガード）してからメッセージを取り出します
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "登録に失敗しました");
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>📝 新規登録画面</h2>

      {/* エラーがある時だけ赤文字で表示 */}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {/* フォーム全体を <form> で囲み、送信時に handleSignup を動かす */}
      <form
        onSubmit={handleSignup}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label>お名前</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>メールアドレス</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div>
          <label>パスワード</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          style={{ padding: "10px", backgroundColor: "blue", color: "white", fontSize: "16px" }}
        >
          新規登録
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* Linkコンポーネントを使って画面遷移させる */}
        <Link to="/login">ログインはこちら</Link>
      </div>
    </div>
  );
}
