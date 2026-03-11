import '../assets/InitGamePage.css';
import type { AI } from '../type.ts';
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react";

function InitGamePage() { 
    // useStateを定義
    const [mode, setMode] = useState<string | null>(null);
    const [player1, setPlayer1] = useState<string | null>(null);
    const [player2, setPlayer2] = useState<string | null>(null);
    const [ai_name1, setAiName1] = useState<string>("");
    const [ai_list1, setAiList1] = useState<AI[]>([]);
    const [selected_ai_id1, setSelectedAiId1] = useState<string | null>(null);
    const [ai_name2, setAiName2] = useState<string>("");
    const [ai_list2, setAiList2] = useState<AI[]>([]);
    const [selected_ai_id2, setSelectedAiId2] = useState<string | null>(null);
    const [turn, setTurn] = useState<string>("RANDOM");
    const [error, setError] = useState<string | null>(null);

    // トークンを取得
    const token = sessionStorage.getItem("access_token");

    // async → 関数内でawaitが使えるようになる
    const handleSubmitAi1 = async (e: React.MouseEvent<HTMLButtonElement>) => {
      // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
      e.preventDefault();

      // エラー表示をリセットする
      setError(null);

      // AIリストを初期化
      setAiList1([]);

      try {
        // awaitにより，API通信が終了するまで待つ
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ais/${ai_name1}`, {
          // リクエストメソッド
          method: "GET",
          // リクエストヘッダ
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        
        // レスポンスボディを取り出す
        const data = await response.json();

        if (response.ok) {
          if (data.length === 0) {
            setError("⚠ AIが見つかりませんでした。");
          } else {
            setAiList1(data);
          };
        } else {
          setError(data.detail);
        };
      } catch {
        setError("⚠ サーバーに接続できません。");
      };
    }

    // async → 関数内でawaitが使えるようになる
    const handleSubmitAi2 = async (e: React.MouseEvent<HTMLButtonElement>) => {
      // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
      e.preventDefault();

      // エラー表示をリセットする
      setError(null);

      // AIリストを初期化
      setAiList2([]);

      try {
        // awaitにより，API通信が終了するまで待つ
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ais/${ai_name2}`, {
          // リクエストメソッド
          method: "GET",
          // リクエストヘッダ
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
        
        // レスポンスボディを取り出す
        const data = await response.json();

        if (response.ok) {
          if (data.length === 0) {
            setError("⚠ AIが見つかりませんでした。");
          } else {
            setAiList2(data);
          };
        } else {
          setError(data.detail);
        };
      } catch {
        setError("⚠ サーバーに接続できません。");
      };
    }

    // async → 関数内でawaitが使えるようになる
    const handleSubmitGame = async (e: React.FormEvent<HTMLFormElement>) => {
      // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
      e.preventDefault();

      // エラー表示をリセットする
      setError(null);


    }

  return (
    <>
      <form className="register-form" onSubmit={handleSubmitGame}>
        {/* 対局モードの選択 */}
        <div className="field register-mode-field">
          <p className="register-mode-title">対局モードを選択：</p>
          <div
            className={`mode-card ${mode === "HUMAN VS AI" ? "selected" : ""}`}
            onClick={() => {
              setMode("HUMAN VS AI");
              setPlayer1("USER");
              setPlayer2(null);
              setTurn("RANDOM");
            }}
          >
            人間  対  AI
          </div>
          <div
            className={`mode-card ${mode === "AI VS AI" ? "selected" : ""}`}
            onClick={() => {
              setMode("AI VS AI");
              setPlayer1("THIRD_PARTY_AI");
              setPlayer2(null);
              setTurn("RANDOM");
            }}
          >
            AI  対  AI
          </div>
        </div>
        {/* プレーヤーの選択（人間 VS AIの場合） */}
        {mode === "HUMAN VS AI" && (
          <div className="field register-player-field">
            <p className="player1-title">プレイヤー1の種別：あなた</p>
            <p className="register-player2-title">プレイヤー2の種別：</p>
            <div
              className={`player2-card ${player2 === "FIRST_PARTY_AI" ? "selected" : ""}`}
              onClick={() => setPlayer2("FIRST_PARTY_AI")}
            >
              デフォルトAI
            </div>
            <div
              className={`player2-card ${player2 === "THIRD_PARTY_AI" ? "selected" : ""}`}
              onClick={() => setPlayer2("THIRD_PARTY_AI")}
            >
              ユーザーが作成したAI
            </div>
            {/* THIRD_PARTY_AIの選択 */}
            {player2 === "THIRD_PARTY_AI" && (
              <div className="field search-ai-field">
                <label className="label search-ai-label">ユーザーが作成したAIの名前：</label>
                <input
                  className="input search-ai-input"
                  type="text"
                  required
                  placeholder="ユーザーが作成したAIの名前を入力 "
                  value={ai_name2}
                  onChange={(e) => setAiName2(e.target.value)}
                />
                <button className="search-ai-button" type="button" disabled={ai_name2 === ""} onClick={handleSubmitAi2}>ユーザーが作成したAIを検索</button>
                {ai_list2 && (
                  <div className="field ai-list">
                    {ai_list2.map((ai) => (
                      <div
                        key={ai.ai_id}
                        className={`ai-card ${selected_ai_id2 === ai.ai_id ? "selected" : ""}`}
                        onClick={() => setSelectedAiId2(ai.ai_id)}
                      >
                        <p className="ai_name">AIの名前：{ai.ai_name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* プレーヤーの選択（AI VS AIの場合） */}
        {mode === "AI VS AI" && (
          <div className="field register-player-field">
            <p className="player1-title">プレイヤー1の種別：ユーザーが作成したAI</p>
            {/* THIRD_PARTY_AIの選択 */}
            <div className="field search-ai-field">
              <label className="label search-ai-label">ユーザーが作成したAIの名前：</label>
              <input
                className="input search-ai1-input"
                type="text"
                required
                placeholder="ユーザーが作成したAIの名前を入力 "
                value={ai_name1}
                onChange={(e) => setAiName1(e.target.value)}
              />
              <button className="search-ai-button" type="button" disabled={ai_name1 === ""} onClick={handleSubmitAi1}>ユーザーが作成したAIを検索</button>
              {ai_list1 && (
                <div className="field ai-list">
                  {ai_list1.map((ai) => (
                    <div
                      key={ai.ai_id}
                      className={`ai-card ${selected_ai_id1 === ai.ai_id ? "selected" : ""}`}
                      onClick={() => setSelectedAiId1(ai.ai_id)}
                    >
                      <p className="ai_name">AIの名前：{ai.ai_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selected_ai_id1 && (
              <>
                <p className="register-player2-title">プレイヤー2の種別：</p>
                <div
                  className={`player2-card ${player2 === "FIRST_PARTY_AI" ? "selected" : ""}`}
                  onClick={() => setPlayer2("FIRST_PARTY_AI")}
                >
                  デフォルトAI
                </div>
                <div
                  className={`player2-card ${player2 === "THIRD_PARTY_AI" ? "selected" : ""}`}
                  onClick={() => setPlayer2("THIRD_PARTY_AI")}
                >
                  ユーザーが作成したAI
                </div>
                {/* THIRD_PARTY_AIの選択 */}
                {player2 === "THIRD_PARTY_AI" && (
                  <div className="field search-ai-field">
                    <label className="label search-ai-label">ユーザーが作成したAIの名前：</label>
                    <input
                      className="input search-ai-input"
                      type="text"
                      required
                      placeholder="ユーザーが作成したAIの名前を入力 "
                      value={ai_name2}
                      onChange={(e) => setAiName2(e.target.value)}
                    />
                    <button className="search-ai-button" type="button" disabled={ai_name2 === ""} onClick={handleSubmitAi2}>ユーザーが作成したAIを検索</button>
                    {ai_list2 && (
                      <div className="field ai-list">
                        {ai_list2.map((ai) => (
                          <div
                            key={ai.ai_id}
                            className={`ai-card ${selected_ai_id2 === ai.ai_id ? "selected" : ""}`}
                            onClick={() => setSelectedAiId2(ai.ai_id)}
                          >
                            <p className="ai_name">AIの名前：{ai.ai_name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {/* 手番の選択 */}
        {mode && player1 && player2 && !(player1 === "THIRD_PARTY_AI" && selected_ai_id1 === null) && !(player2 === "THIRD_PARTY_AI" && selected_ai_id2 === null) &&(
          <div className="field register-turn-field">
            <p className="register-turn-title">手番を選択：</p>
            <div
              className={`turn-card ${turn === "RANDOM" ? "selected" : ""}`}
              onClick={() => setTurn("RANDOM")}
            >
              先手と後手をランダムで選択
            </div>
            <div
              className={`turn-card ${turn === "PLAYER1" ? "selected" : ""}`}
              onClick={() => setTurn("PLAYER1")}
            >
              プレイヤー1が先手
            </div>
            <div
              className={`turn-card ${turn === "PLAYER2" ? "selected" : ""}`}
              onClick={() => setTurn("PLAYER2")}
            >
              プレイヤー2が先手
            </div>
          </div>
        )}
        {/* エラーの表示 */}
        {error && <p className="error">{error}</p>}
        {/* 登録ボタン */}
        <button
          className="register-button-"
          type="submit"
          disabled={
            mode === null
            || player1 === null
            || (player1 === "THIRD_PARTY_AI" && selected_ai_id1 === null)
            || player2 === null
            || (player2 === "THIRD_PARTY_AI" && selected_ai_id2 === null)
            || turn === null
          }
        >
          対局開始
        </button>
      </form>
    </>
  );
};

export default InitGamePage;
