import './App.css'
// BrowserRouter → URLの変更を監視．
// Routes → 複数のRouteをまとめるためのコンテナ．
// Route → pathに一致するURLが呼ばれると，指定したコンポーネントを表示．
import { BrowserRouter, Routes, Route } from "react-router-dom"
// コンポーネントをインポート．
import AuthPage from './pages/AuthPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
