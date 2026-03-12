import '../assets/GamePage.css';
import type { Game } from '../type.ts';
// urlパスパラメータを取得する
import { useParams } from "react-router-dom";
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react";
// 任意のタイミングで関数を実行するためのHooks　※リロード時と，第二引数（ [] ）に指定した変数の値が変更された時
import { useEffect } from 'react';

function GamePage() {
  // useStateを定義
  const [game_state, setGameState] = useState<Game>();
  const [error, setError] = useState<string | null>(null);

  // パラメータからgame_idを取得
  const { game_id } = useParams();

  // トークンを取得
  const token = sessionStorage.getItem("access_token");

  // async → 関数内でawaitが使えるようになる
  const fetchGame = async () => {
    try {
      // awaitにより，API通信が終了するまで待つ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/games/${game_id}`, {
        // リクエストメソッド
        method: "GET",
        // リクエストヘッダ
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      // レスポンスボディを取り出す
      const data = await response.json();

      if (response.ok) {
        setGameState(data);
      } else {
        setError(data.detail);
      };
    } catch {
      setError("⚠ サーバーに接続できません。");
    };
  };

  // useEffectを定義
  useEffect(() => {
    fetchGame();
  }, []);

  return (
    <>
      <div className="game">
        {/* 上部のPlayerBar */}
        <div className="player-bar">
          <div className="player-name">
            {/* 名前 */}
          </div>
          <div className="player-time">
            {/* 時間 */}
          </div>
          <div className="player-koma">
            {/* 持ち駒 */}
          </div>
        </div>
        {/* 盤面と対局情報 */}
        <div className="game-center">
          <div className="board">
            {/* 盤面 */}
          </div>
          <div className="information">
            <div className="move-number">
              {/* 手数 */}
            </div>
            <div className="kifu">
              {/* 棋譜 */}
            </div>
          </div>
        </div>
        {/* 下部のPlayerBar */}
        <div className="player-bar">
          <div className="player-name">
            {/* 名前 */}
          </div>
          <div className="player-time">
            {/* 時間 */}
          </div>
          <div className="player-koma">
            {/* 持ち駒 */}
          </div>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default GamePage;