import '../assets/SettingUserPage.css'
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react"
// 画面遷移を行う関数
import { useNavigate } from "react-router-dom"

function SettingUserPage() { 
  // useStateを定義
  const [user_name, set_user_name] = useState<string>("")
  const [password, set_password] = useState<string>("")
  const [error, set_error] = useState<string | null>(null)

  // 関数をnavigateに代入（以降navigate()で使用できる）
  const navigate = useNavigate();

  // async → 関数内でawaitが使えるようになる
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const token = sessionStorage.getItem("access_token")

    // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
    e.preventDefault()

    // エラー表示をリセットする
    set_error(null)

    try {
      // awaitにより，API通信が終了するまで待つ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        // リクエストメソッド
        method: "PUT",
        // リクエストヘッダ
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
        sessionStorage.clear()
        navigate("/login", {
          state: {
            message: "✓ ユーザー情報の修正が完了しました。"
          }
        })
      } else {
        set_error(data.detail)
      }
    } catch {
      set_error("⚠ サーバーに接続できません。")
    }
  }

  return (
    <>
      <form className="setting-form" onSubmit={handleSubmit}>
        {/* ユーザー名の入力 */}
        <div className="field setting-user-field">
          <label htmlFor="user_name" className="label setting-user-label">変更後のユーザー名：</label>
          <input
            id="user_name"
            className="input setting-user-input"
            type="text"
            required
            placeholder="ユーザー名を入力 (変更しない場合は元のユーザー名)"
            value={user_name}
            onChange={(e) => set_user_name(e.target.value)}
          />
        </div>
        {/* パスワードの入力 */}
        <div className="field setting-password-field">
          <label htmlFor="password" className="label setting-password-label">変更後のパスワード：</label>
          <input
            id="password"
            className="input setting-password-input"
            type="password"
            required
            placeholder="パスワードを入力 (変更しない場合は元のパスワード)"
            value={password}
            onChange={(e) => set_password(e.target.value)}
          />
        </div>
        {/* エラーの表示 */}
        {error && <p className="error">{error}</p>}
        {/* 変更ボタン */}
        <button className="setting-button-" type="submit">変更する</button>
      </form>
    </>
  )
}

export default SettingUserPage