import '../assets/RegisterUserPage.css';
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react";
// 画面遷移を行う関数
import { useNavigate } from 'react-router-dom';

function RegisterUserPage() { 
  // useStateを定義
  const [user_name, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // 関数をnavigateに代入（以降navigate()で使用できる）
  const navigate = useNavigate();

  // async → 関数内でawaitが使えるようになる
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
    e.preventDefault();

    // エラー表示をリセットする
    setError(null);

    try {
      // awaitにより，API通信が終了するまで待つ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        // リクエストメソッド
        method: "POST",
        // リクエストヘッダ
        headers: {
          "Content-Type": "application/json"
        },
        // JSON文字列に変換し，リクエストボディに格納
        body: JSON.stringify({
          user_name,
          password
        })
      });
      
      // レスポンスボディを取り出す
      const data = await response.json();

      if (response.ok) {
        setError(null);
        navigate("/login", {
          state: {
            message: "✓ 登録が完了しました。"
          }
        });
      } else {
        setError(data.detail);
      };
    } catch {
      setError("⚠ サーバーに接続できません。");
    };
  };

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* ユーザー名の入力 */}
        <div className="field register-user-field">
          <label htmlFor="user_name" className="label register-user-label">ユーザー名：</label>
          <input
            id="user_name"
            className="input register-user-input"
            type="text"
            required
            placeholder="ユーザー名を入力"
            value={user_name}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        {/* パスワードの入力 */}
        <div className="field register-password-field">
          <label htmlFor="password" className="label register-password-label">パスワード：</label>
          <input
            id="password"
            className="input register-password-input"
            type="password"
            required
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* エラーの表示 */}
        {error && <p className="error">{error}</p>}
        {/* 登録ボタン */}
        <button className="register-button" type="submit" disabled={user_name === "" || password === ""}>登録</button>
      </form>
    </>
  );
};

export default RegisterUserPage;