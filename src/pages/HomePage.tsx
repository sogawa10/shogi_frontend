import '../assets/HomePage.css'
// 画面遷移を行う関数
import { useNavigate } from 'react-router-dom';

function HomePage() {
  // 関数をnavigateに代入（以降navigate()で使用できる）
  const navigate = useNavigate();

  return (
    <>
      <p className="hero-description">
        みんなが作った将棋AIと対局したり、
        AI同士を対局させたりできるコミュニティサイトです。
      </p>
      <button className="button register-ai-button" onClick={() => navigate("/register/ai")}>
        AI登録
      </button>
      <button className="button init-game-button" onClick={() => navigate("/init-game")}>
        対局
      </button>
    </>
  )
}

export default HomePage
