import './assets/App.css'
// BrowserRouter → URLの変更を監視
// Routes → 複数のRouteをまとめるためのコンテナ
// Route → pathに一致するURLが呼ばれると，指定したコンポーネントを表示
import { BrowserRouter, Routes, Route } from "react-router-dom"
// コンポーネントをインポート
import ProtectedRoute from './ProtectedRoute.tsx';
import AuthPage from './pages/AuthPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterUserPage from './pages/RegisterUserPage.tsx';
import HomePage from './pages/HomePage.tsx';
import LayoutAuth from './LayoutAuth.tsx';
import LayoutHome from './LayoutHome.tsx';
import RegisterAiPage from './pages/RegisterAiPage.tsx';
import InitGamePage from './pages/InitGamePage.tsx';
import SettingUserPage from './pages/SettingUserPage.tsx';
import SettingAiPage from './pages/SettingAiPage.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LayoutAuth>
              <AuthPage />
            </LayoutAuth>
          }
        />
        <Route
          path="/login"
          element={
            <LayoutAuth>
              <LoginPage />
            </LayoutAuth>
          }
        />
        <Route
        path="/register/user"
        element={
          <LayoutAuth>
            <RegisterUserPage />
          </LayoutAuth>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <LayoutHome>
                <HomePage />
              </LayoutHome>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register/ai"
          element={
            <ProtectedRoute>
              <LayoutHome>
                <RegisterAiPage />
              </LayoutHome>
            </ProtectedRoute>
          }
        />
        <Route
          path="/init-game"
          element={
            <ProtectedRoute>
              <LayoutHome>
                <InitGamePage />
              </LayoutHome>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting/user"
          element={
            <ProtectedRoute>
              <LayoutHome>
                <SettingUserPage />
              </LayoutHome>
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting/ai"
          element={
            <ProtectedRoute>
              <LayoutHome>
                <SettingAiPage />
              </LayoutHome>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
