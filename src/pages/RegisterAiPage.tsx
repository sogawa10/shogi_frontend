import '../assets/RegisterAiPage.css'
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react"

function RegisterAiPage() { 
  // useStateを定義
  const [ai_name, set_ai_name] = useState<string>("")
  const [full_url, set_full_url] = useState<string>("")
  const [message, set_message] = useState<string | null>(null)
  const [error, set_error] = useState<string | null>(null)

  // async → 関数内でawaitが使えるようになる
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const token = sessionStorage.getItem("access_token")

    // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
    e.preventDefault()

    // メッセージをリセットする
    set_message(null)

    // エラー表示をリセットする
    set_error(null)

    try {
      // awaitにより，API通信が終了するまで待つ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ais`, {
        // リクエストメソッド
        method: 'POST',
        // リクエストヘッダ
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        // JSON文字列に変換し，リクエストボディに格納
        body: JSON.stringify({
          ai_name,
          full_url
        })
      })
      
      // レスポンスボディを取り出す
      const data = await response.json()

      if (response.ok) {
        set_error(null)
        set_message("✓ 登録が完了しました。")
      } else {
        set_error(data.detail)
      }
    } catch {
      set_error("⚠ サーバーに接続できません。")
    }
  }

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* AI名の入力 */}
        <div className="field register-ai-field">
          <label htmlFor="ai_name" className="label register-ai-label">AIの名前：</label>
          <input
            id="ai_name"
            className="input register-ai-input"
            type="text"
            required
            placeholder="AIの名前を入力"
            value={ai_name}
            onChange={(e) => set_ai_name(e.target.value)}
          />
        </div>
        {/* APIのフルurlの入力 */}
        <div className="field register-full_url-field">
          <label htmlFor="full_url" className="label register-full_url-label">APIのURL：</label>
          <input
            id="full_url"
            className="input register-full_url-input"
            type="text"
            required
            placeholder="URLを入力"
            value={full_url}
            onChange={(e) => set_full_url(e.target.value)}
          />
        </div>
        {/* エラーの表示 */}
        {error && <p className="error">{error}</p>}
        {/* メッセージの表示 */}
        {message && <p className="message">{message}</p>}
        {/* 登録ボタン */}
        <button className="register-button-" type="submit">登録</button>
      </form>
    </>
  )
}

export default RegisterAiPage