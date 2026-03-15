import '../assets/GamePage.css';
import type { Game, KomaType, Koma, Board, Mochigoma } from '../type.ts';
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

    return board;
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

    return mochigoma;
  };

  // 棋譜から対局を復元
  const applyKifu = () => {
    let currentBoard = initBoard(); 
    let currentMochigoma = initMochigoma();
    let last_turn: "sente" | "gote" = "gote";

    if (!game_state?.kifu || game_state.kifu.trim() === "") {
      setTurn("sente");
      setBoard(currentBoard);
      setMochigoma(currentMochigoma);
      return;
    }

    // 棋譜を手に分割
    const moves = game_state.kifu.trim().split(" ");

    for (let move of moves) {
      let turn_from_kifu: "sente" | "gote";
      let move_koma: KomaType;
      let cap_koma: Koma | null = null;
      let tx: number; 
      let ty: number;
      let fx: number | null = null; 
      let fy: number | null = null;

      // 手番の確認
      if (move[0] === "▲") {
          turn_from_kifu = "sente";
      } else if (move[0] === "△") {
          turn_from_kifu = "gote";
      } else {
          setError("⚠ 棋譜が不正です。");
          return;
      };
      if (last_turn === turn_from_kifu){
          setError("⚠ 棋譜が不正です。");
          return;
      }
      last_turn = turn_from_kifu;

      // 移動先の座標を取得
      if ((1 <= Number(move[1]) && Number(move[1]) <= 9) && (1 <= Number(move[2]) && Number(move[2]) <= 9)) {
        tx = Number(move[1]) - 1;
        ty = Number(move[2]) - 1;
      } else {
        setError("⚠ 棋譜が不正です。");
        return;
      };

      // 移動させる駒を取得
      if (move[3] === "王" || move[3] === "玉") {
        move_koma = "OU";
      } else if (move[3] === "金") {
        move_koma = "KIN";
      } else if (move[3] === "銀" || move[3] === "全") {
        move_koma = "GIN";
      } else if (move[3] === "桂" || move[3] === "圭") {
        move_koma = "KEI";
      } else if (move[3] === "香" || move[3] === "杏") {
        move_koma = "KYOU";
      } else if (move[3] === "飛" || move[3] === "龍") {
        move_koma = "HISHA";
      } else if (move[3] === "角" || move[3] === "馬") {
        move_koma = "KAKU";
      } else if (move[3] === "歩" || move[3] === "と") {
        move_koma = "FU";
      } else {
        setError("⚠ 棋譜が不正です。");
        return;
      };

      if (move.length === 8) {        // 移動（成らず）
        // 移動元の座標を取得
        if ((1 <= Number(move[5]) && Number(move[5]) <= 9) && (1 <= Number(move[6]) && Number(move[6]) <= 9)) {
          fx = Number(move[5]) - 1;
          fy = Number(move[6]) - 1;
        } else {
          setError("⚠ 棋譜が不正です。");
          return;
        };

        // 取る駒があれば取得
        if (currentBoard[ty][tx] !== null) {
          cap_koma = currentBoard[ty][tx];
        };

        // 駒を動かす
        if (move_koma === currentBoard[fy][fx]?.type) {
          const from_koma = currentBoard[fy][fx];
          if (from_koma) {
            currentBoard[ty][tx] = from_koma;
          };
          currentBoard[fy][fx] = null;
          if (cap_koma && cap_koma.type !== "OU") {
            currentMochigoma[turn_from_kifu][cap_koma.type] = currentMochigoma[turn_from_kifu][cap_koma.type] + 1;
          };
        } else {
          setError("⚠ 棋譜が不正です。");
          return;
        };

      } else if (move.length === 9) { // 移動（成る）
        // 成るかどうかの確認
        if (move[4] !== "成") {
          setError("⚠ 棋譜が不正です。");
          return;
        };

        // 移動元の座標を取得
        if ((1 <= Number(move[6]) && Number(move[6]) <= 9) && (1 <= Number(move[7]) && Number(move[7]) <= 9)) {
          fx = Number(move[6]) - 1;
          fy = Number(move[7]) - 1;
        } else {
          setError("⚠ 棋譜が不正です。");
          return;
        };

        // 取る駒があれば取得
        if (currentBoard[ty][tx] !== null) {
          cap_koma = currentBoard[ty][tx];
        };

        // 駒を動かす
        if (move_koma === currentBoard[fy][fx]?.type) {
          const from_koma = currentBoard[fy][fx];
          if (from_koma) {
            from_koma.promoted = true;
            currentBoard[ty][tx] = from_koma;
          };
          currentBoard[fy][fx] = null;
          if (cap_koma && cap_koma.type !== "OU") {
            currentMochigoma[turn_from_kifu][cap_koma.type] = currentMochigoma[turn_from_kifu][cap_koma.type] + 1;
          };
        } else {
          setError("⚠ 棋譜が不正です。");
          return;
        };

      } else if (move.length === 5) { // 打ち
        // 打ちかどうかの確認
        if (move[4] !== "打") {
          setError("⚠ 棋譜が不正です。");
          return;
        };

        // 移動
        if (move_koma !== "OU" && currentMochigoma[turn_from_kifu][move_koma] >= 1) {
          currentBoard[ty][tx] = { type: move_koma, owner: turn_from_kifu, promoted: false };
          currentMochigoma[turn_from_kifu][move_koma] = currentMochigoma[turn_from_kifu][move_koma] - 1;
        };

      } else {
        setError("⚠ 棋譜が不正です。");
        return;
      }; 
    };

    // useStateに反映
    setTurn(last_turn === "sente" ? "gote" : "sente");
    setBoard(currentBoard);
    setMochigoma(currentMochigoma);
  };

  // useEffectを定義
  useEffect(() => {
    setError(null);
    fetchGame();
  }, []);

  useEffect(() => {
    setError(null);
    applyKifu();
  }, [game_state]);

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
                <p className="mochigoma-num">{num}</p>
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
                <p className="mochigoma-num">{num}</p>
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