import '../assets/LoginPage.css'
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react"
// 画面遷移を行う関数
import { useNavigate } from 'react-router-dom';
// 遷移元のページから渡されたstateを取得できる
import { useLocation } from "react-router-dom"

function LoginPage() {
  // useStateを定義
  const [user_name, set_user_name] = useState<string>("")
  const [password, set_password] = useState<string>("")
  const [error, set_error] = useState<string | null>(null)

  // 関数をnavigateに代入（以降navigate()で使用できる）
  const navigate = useNavigate();

  // ?.により，stateが存在する場合だけmessageが代入される
  const location = useLocation()
  const message = location.state?.message

  // async → 関数内でawaitが使えるようになる
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
    e.preventDefault()

    // エラー表示をリセットする
    set_error(null)
    
    try {
      // awaitにより，API通信が終了するまで待つ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
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
      })
      
      // レスポンスボディを取り出す
      const data = await response.json()

      if (response.ok) {
        set_error(null)
        // レスポンスの内容を，ブラウザのSession Storageに保存
        sessionStorage.setItem("user_id", data.user_id)
        sessionStorage.setItem("user_name", user_name)
        sessionStorage.setItem("access_token", data.access_token)
        sessionStorage.setItem("exp", data.exp)
        navigate("/home")
      } else {
        set_error(data.detail)
      }
    } catch {
      set_error("⚠ サーバーに接続できません。")
    }
  }

  return (
    <>
      {/* 新規登録が成功した場合の表示 */}
      {message && <p className="success">{message}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* ユーザー名の入力 */}
        <div className="field login-user-field">
          <label htmlFor="user_name" className="label login-user-label">ユーザー名：</label>
          <input
            id="user_name"
            className="input login-user-input"
            type="text"
            required
            placeholder="ユーザー名を入力"
            value={user_name}
            onChange={(e) => set_user_name(e.target.value)}
          />
        </div>
        {/* パスワードの入力 */}
        <div className="field login-password-field">
          <label htmlFor="password" className="label login-password-label">パスワード：</label>
          <input
            id="password"
            className="input login-password-input"
            type="password"
            required
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => set_password(e.target.value)}
          />
        </div>
        {/* エラーの表示 */}
        {error && <p className="error">{error}</p>}
        {/* ログインボタン */}
        <button className="login-button" type="submit">ログイン</button>
      </form>
    </>
  )
}

export default LoginPage