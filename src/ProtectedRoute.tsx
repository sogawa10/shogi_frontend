// ログインしていない人がページにアクセスするのを防ぐ

// 画面遷移を行うコンポーネント
import { Navigate } from "react-router-dom"

// childrenは，<ProtectedRoute></ProtectedRoute>の中に書かれたコンポーネント
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("access_token")

  // トークンが無い場合はリダイレクト
  if (!token) {
    return <Navigate to="/" />
  }

  // トークンがある場合はchildrenを表示
  return children
}

export default ProtectedRoute