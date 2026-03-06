import './RegisterPage.css'
import '../types.ts'
// 状態を管理するためのHooks．値を更新すると自動で再レンダリングされる．
import { useState } from "react"
// ボタンをクリックしたときに画面遷移を行う関数．．
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  // useStateを定義
  const [user_name, set_user_name] = useState("")
  const [password, set_password] = useState("")

  // 関数をnavigateに代入（以降navigate()で使用できる）．
  const navigate = useNavigate();

  // async → 関数内でawaitが使えるようになる
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
    e.preventDefault()

    // awaitにより，API通信が終了するまで待つ

    alert("登録完了")
    navigate("/")
  }

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
            onChange={(e) => set_user_name(e.target.value)}
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
            onChange={(e) => set_password(e.target.value)}
          />
        </div>
        {/* 登録ボタン */}
        <button className="btn-register" type="submit">登録</button>
      </form>
    </>
  )
}

export default RegisterPage