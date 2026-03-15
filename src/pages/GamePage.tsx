import '../assets/GamePage.css';
import type { Game, Koma, Board, Mochigoma } from '../type.ts';
// urlパスパラメータを取得する
import { useParams } from "react-router-dom";
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react";
// 任意のタイミングで関数を実行するためのHooks　※リロード時と，第二引数（ [] ）に指定した変数の値が変更された時
import { useEffect } from 'react';

function GamePage() {
  // useStateを定義
  const [game_state, setGameState] = useState<Game>();
  const [board, setBoard] = useState<Board>();
  const [mochigoma, setMochigoma] = useState<Mochigoma>();
  const [turn, setTurn] = useState<"sente" | "gote">("sente");
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

  // 盤面を初期化
  const initBoard = () => {
    // board[y][x]
    const board: Board = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null));

    // 後手の駒(1行目)
    board[0][0] = { type: "KYOU", owner: "gote", promoted: false };
    board[0][1] = { type: "KEI", owner: "gote", promoted: false };
    board[0][2] = { type: "GIN", owner: "gote", promoted: false };
    board[0][3] = { type: "KIN", owner: "gote", promoted: false };
    board[0][4] = { type: "OU", owner: "gote", promoted: false };
    board[0][5] = { type: "KIN", owner: "gote", promoted: false };
    board[0][6] = { type: "GIN", owner: "gote", promoted: false };
    board[0][7] = { type: "KEI", owner: "gote", promoted: false };
    board[0][8] = { type: "KYOU", owner: "gote", promoted: false };
    // 後手の駒(2行目)
    board[1][1] = { type: "KAKU", owner: "gote", promoted: false };
    board[1][7] = { type: "HISHA", owner: "gote", promoted: false };
    // 後手の駒(3行目)
    board[2][0] = { type: "FU", owner: "gote", promoted: false };
    board[2][1] = { type: "FU", owner: "gote", promoted: false };
    board[2][2] = { type: "FU", owner: "gote", promoted: false };
    board[2][3] = { type: "FU", owner: "gote", promoted: false };
    board[2][4] = { type: "FU", owner: "gote", promoted: false };
    board[2][5] = { type: "FU", owner: "gote", promoted: false };
    board[2][6] = { type: "FU", owner: "gote", promoted: false };
    board[2][7] = { type: "FU", owner: "gote", promoted: false };
    board[2][8] = { type: "FU", owner: "gote", promoted: false };

    // 先手の駒(9行目)
    board[8][0] = { type: "KYOU", owner: "sente", promoted: false };
    board[8][1] = { type: "KEI", owner: "sente", promoted: false };
    board[8][2] = { type: "GIN", owner: "sente", promoted: false };
    board[8][3] = { type: "KIN", owner: "sente", promoted: false };
    board[8][4] = { type: "OU", owner: "sente", promoted: false };
    board[8][5] = { type: "KIN", owner: "sente", promoted: false };
    board[8][6] = { type: "GIN", owner: "sente", promoted: false };
    board[8][7] = { type: "KEI", owner: "sente", promoted: false };
    board[8][8] = { type: "KYOU", owner: "sente", promoted: false };
    // 先手の駒(8行目)
    board[7][7] = { type: "KAKU", owner: "sente", promoted: false };
    board[7][1] = { type: "HISHA", owner: "sente", promoted: false };
    // 先手の駒(7行目)
    board[6][0] = { type: "FU", owner: "sente", promoted: false };
    board[6][1] = { type: "FU", owner: "sente", promoted: false };
    board[6][2] = { type: "FU", owner: "sente", promoted: false };
    board[6][3] = { type: "FU", owner: "sente", promoted: false };
    board[6][4] = { type: "FU", owner: "sente", promoted: false };
    board[6][5] = { type: "FU", owner: "sente", promoted: false };
    board[6][6] = { type: "FU", owner: "sente", promoted: false };
    board[6][7] = { type: "FU", owner: "sente", promoted: false };
    board[6][8] = { type: "FU", owner: "sente", promoted: false };

    setBoard(board);
  };

  // 持ち駒を初期化
  const initMochigoma = () => {
    const mochigoma: Mochigoma = {
      sente: {
        FU: 0,
        KIN: 0,
        GIN: 0,
        KEI: 0,
        KYOU: 0,
        HISHA: 0,
        KAKU: 0
      },
      gote: {
        FU: 0,
        KIN: 0,
        GIN: 0,
        KEI: 0,
        KYOU: 0,
        HISHA: 0,
        KAKU: 0
      }
    };

    setMochigoma(mochigoma);
  };

  // useEffectを定義
  useEffect(() => {
    fetchGame();
    initBoard();
    initMochigoma();
  }, []);

  return (
    <>
      <div className="game">
        {/* 上部のPlayerBar */}
        <div className="player-bar">
          <div className="player-name">
            {game_state && <h1>{game_state.gote_name}</h1>}
          </div>
          <div className="player-time">
            {/* 時間 */}
          </div>
          <div className="player-koma">
            {mochigoma && mochigoma.gote && Object.entries(mochigoma.gote).map(([koma, num], idx) => num !== 0 &&
              <div key={idx} className="mochigoma">
                <img
                  src={`/gote_${koma}.png`}
                  className={`koma koma-${koma}`}
                />
                <p className="moshigoma-num">{num}</p>
              </div>
            )}
          </div>
        </div>
        {/* 盤面と対局情報 */}
        <div className="game-center">
          <div className="board">
            {board && board.map((row, y)=>
              row.slice().reverse().map((koma, x) =>
                <div key={`${8-x}-${y}`} className="masu">
                  {koma && 
                    <img
                      src={`/${koma.owner}_${koma.type}${koma.promoted ? "_nari" : ""}.png`}
                      className={`koma koma-${koma.type}`}
                    />
                  }
                </div>
            ))}
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
            {game_state && <h1>{game_state.sente_name}</h1>}
          </div>
          <div className="player-time">
            {/* 時間 */}
          </div>
          <div className="player-koma">
            {mochigoma && mochigoma.sente && Object.entries(mochigoma.sente).map(([koma, num], idx) => num !== 0 &&
              <div key={idx} className="mochigoma">
                <img
                  src={`/sente_${koma}.png`}
                  className={`koma koma-${koma}`}
                />
                <p className="moshigoma-num">{num}</p>
              </div>
            )}
          </div>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default GamePage;