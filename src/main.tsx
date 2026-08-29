import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 全ページ共通の基盤スタイル（リセット・デザイントークン・共通コンポーネント）
import './assets/theme.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
