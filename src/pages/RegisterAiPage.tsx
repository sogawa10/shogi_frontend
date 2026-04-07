import '../assets/RegisterAiPage.css';
// 状態を管理するためのHooks　値を更新すると自動で再レンダリングされる
import { useState } from "react";

function RegisterAiPage() { 
  // useStateを定義
  const [ai_name, setAiName] = useState<string>("");
  const [full_url, setFullUrl] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // タイムアウト付きのAPI呼び出し関数
  const fetchWithTimeout = async (url: string, options: RequestInit, timeout :number) => {
    // fetchを途中でキャンセルするためのオブジェクト
    const controller = new AbortController();
    // timeout秒後にcontroller.abort()が実行され，fetchが途中でキャンセルされる
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        // ...は中身を展開して張り付ける構文
        ...options,
        // このfetchはcontrollerで止められるようにするという設定
        signal: controller.signal,
      });
      return response;
    } finally {
      // タイマーを解除
      clearTimeout(id);
    }
  };

  // async → 関数内でawaitが使えるようになる
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const token = sessionStorage.getItem("access_token");

    // フォーム送信時のページリロードを防ぐ（SPAではAPI通信＋再レンダリングで処理するため）
    e.preventDefault();

    // メッセージをリセットする
    setMessage(null);

    // エラー表示をリセットする
    setError(null);

    try {
      let response1;
      try {
        // awaitにより，API通信が終了するまで待つ
        response1 = await fetchWithTimeout(full_url, {
          // リクエストメソッド
          method: "POST",
          // リクエストヘッダ
          headers: {
            "Content-Type": "application/json"
          },
          // JSON文字列に変換し，リクエストボディに格納
          body: JSON.stringify({
            kifu: ""
          })
        }, 10000);
      } catch {
        setError("⚠ URLが不正です。正しいURLを入力してください。");
        return;
      }

      // レスポンスボディを取り出す
      let data1;
      try {
        data1 = await response1.json();
      } catch {
        setError("⚠ URLが不正です。正しいURLを入力してください。");
        return;
      };

      if (response1.ok) {
        setError(null);
        if (!("move" in data1)) {
          setError("⚠ URLが不正です。正しいURLを入力してください。");
          return;
        };
      } else {
        setMessage(null);
        setError("⚠ URLが不正です。正しいURLを入力してください。");
        return;
      };

      // awaitにより，API通信が終了するまで待つ
      const response2 = await fetch(`${import.meta.env.VITE_API_URL}/ais`, {
        // リクエストメソッド
        method: "POST",
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
      const data2 = await response2.json();

      if (response2.ok) {
        setError(null);
        setMessage("✓ 登録が完了しました。");
      } else {
        setMessage(null);
        setError(data2.detail);
      };
    } catch (e: any) {
      if (e.name === "AbortError") {
        setError("⚠ APIサーバーからの応答がありません。");
      } else {
        setError("⚠ サーバーに接続できません。");
      }
    };
  };

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* AI名の入力 */}
        <div className="field register-ai-field">
          <label htmlFor="ai_name" className="label register-ai-label">AIの名前：</label>
          <input
            id="ai_name"
            className="input register-ai-input"
            type="text"
            required
            placeholder="AIの名前を入力"
            value={ai_name}
            onChange={(e) => setAiName(e.target.value)}
          />
        </div>
        {/* APIのフルurlの入力 */}
        <div className="field register-full_url-field">
          <label htmlFor="full_url" className="label register-full_url-label">APIのURL：</label>
          <input
            id="full_url"
            className="input register-full_url-input"
            type="text"
            required
            placeholder="URLを入力"
            value={full_url}
            onChange={(e) => setFullUrl(e.target.value)}
          />
        </div>
        {/* エラーの表示 */}
        {error && <p className="error">{error}</p>}
        {/* メッセージの表示 */}
        {message && <p className="message">{message}</p>}
        {/* 登録ボタン */}
        <button className="register-button" type="submit" disabled={ai_name === "" || full_url === ""}>登録</button>
      </form>
    </>
  );
};

export default RegisterAiPage;