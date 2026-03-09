import '../assets/SettingAiPage.css';
import type { AI } from '../type.ts';
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react";
// 任意のタイミングで関数を実行するためのHooks　※リロード時と，第二引数（ [] ）に指定した変数の値が変更された時
import { useEffect } from 'react';

function SettingAiPage() { 
  // useStateを定義
  const [ai_list, setAiList] = useState<AI[]>([]);
  const [selected_ai_id, setSelectedAiId] = useState<string | null>(null)
  const [ai_name, setAiName] = useState<string>("");
  const [full_url, setFullUrl] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // トークンを取得
  const token = sessionStorage.getItem("access_token");

  // async → 関数内でawaitが使えるようになる
  const fetchAiList = async () => {
    try {
      // awaitにより，API通信が終了するまで待つ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me/ais`, {
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
        if (data.length === 0) {
          setError("⚠ AIが登録されていません。");
        } else {
          setAiList(data);
        };
      } else {
        setError(data.detail);
      };
    } catch {
      setError("⚠ サーバーに接続できません。");
    };
  };

  // useEffectを定義
  useEffect(() => {
    fetchAiList();
  }, [selected_ai_id]);

  // async → 関数内でawaitが使えるようになる
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
    e.preventDefault();

    // エラー表示をリセットする
    setError(null);

    try {
      // awaitにより，API通信が終了するまで待つ
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ais/${selected_ai_id}`, {
        // リクエストメソッド
        method: "PUT",
        // リクエストヘッダ
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        // JSON文字列に変換し，リクエストボディに格納
        body: JSON.stringify({
          ai_name,
          full_url
        })
      });
      
      // レスポンスボディを取り出す
      const data = await response.json();

      if (response.ok) {
        setSelectedAiId(null);
        setError(null);
        setMessage("✓ 登録が完了しました。");
      } else {
        setSelectedAiId(null);
        setMessage(null);
        setError(data.detail);
      };
    } catch {
      setSelectedAiId(null);
      setError("⚠ サーバーに接続できません。");
    };
  };

  return (
    <>
      <form className="setting-form" onSubmit={handleSubmit}>
        {/* 変更するAIを選択 */}
        <div className="ai-setting">
          <p className="ai-setting-title">どのAI情報を変更しますか？</p>
          {ai_list.map((ai) => (
            <div
              key={ai.ai_id}
              className={`ai-card ${selected_ai_id === ai.ai_id ? "selected" : ""}`}
              onClick={() => setSelectedAiId(ai.ai_id)}
            >
              <p className="ai_name">AIの名前：{ai.ai_name}</p>
              <p className="full_url">APIのURL：{ai.full_url}</p>
            </div>
          ))}
        </div>
        {/* AI名の入力 */}
        <div className="field setting-ai-field">
          <label htmlFor="ai_name" className="label setting-ai-label">変更後のAIの名前：</label>
          <input
            id="ai_name"
            className="input setting-ai-input"
            type="text"
            required
            placeholder="AIの名前を入力 (変更しない場合は元のAIの名前)"
            value={ai_name}
            onChange={(e) => setAiName(e.target.value)}
          />
        </div>
        {/* APIのフルurlの入力 */}
        <div className="field setting-full_url-field">
          <label htmlFor="full_url" className="label setting-full_url-label">変更後のAPIのURL：</label>
          <input
            id="full_url"
            className="input setting-full_url-input"
            type="text"
            required
            placeholder="APIのURLを入力 (変更しない場合は元のAPIのURL)"
            value={full_url}
            onChange={(e) => setFullUrl(e.target.value)}
          />
        </div>
        {/* エラーの表示 */}
        {error && <p className="error">{error}</p>}
        {/* メッセージの表示 */}
        {message && <p className="message">{message}</p>}
        {/* 変更ボタン */}
        <button className="setting-button-" type="submit" disabled={selected_ai_id === null || ai_name === "" || full_url === ""}>変更する</button>
      </form>
    </>
  );
};

export default SettingAiPage;