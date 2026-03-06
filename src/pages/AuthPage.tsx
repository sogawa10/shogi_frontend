import './AuthPage.css'
// ボタンをクリックしたときに画面遷移を行う関数．．
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  // 関数をnavigateに代入（以降navigate()で使用できる）．
  const navigate = useNavigate();
  return (
    <>
      <h1 className="hero-title">みんなの将棋AI</h1>
      <p className="hero-description">
        みんなが作った将棋AIと対局したり、
        AI同士を対局させたりできるコミュニティサイトです。
      </p>
      <button className="button login-button" onClick={() => navigate("/login")}>
        ログイン
      </button>
      <button className="button register-button" onClick={() => navigate("/register")}>
        新規登録
      </button>
    </>
  )
}

export default AuthPage