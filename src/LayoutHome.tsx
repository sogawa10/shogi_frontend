// ログイン後のヘッダーやフッターを定義

import './assets/LayoutHome.css'
// 画面遷移を行うリンクのコンポーネントと画面遷移を行う関数
import { Link, useNavigate } from "react-router-dom"

function Layout({ children }: { children: React.ReactNode }) {
  // 関数をnavigateに代入（以降navigate()で使用できる）
  const navigate = useNavigate();

  const user_name = sessionStorage.getItem("user_name")

  const handleLogout = () => {
    sessionStorage.clear()
    navigate("/")
  }
  
  return (
    <>
      <header className="header">
        <h1 className="logo">みんなの将棋AI</h1>
        <div className="header-right">
          <p className="user-name">{user_name}</p>
          <Link className="home-link" to="/home">Home</Link>
          <Link className="init-game-link" to="/init-game"> 対局</Link>
          <Link className="register-ai-link" to="/register/ai">AI登録</Link>
          <Link className="ai-setting-link" to="/setting/ai">AI情報の変更</Link>
          <Link className="user-setting-link" to="/setting/user">ユーザー情報の変更</Link>
          <button className="logout-button" type="button" onClick={handleLogout}>ログアウト</button>
        </div>
      </header>
      <main className="main">
        {children}
      </main>
    </>
  )
}

export default Layout