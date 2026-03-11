import '../assets/GamePage.css';
// urlパスパラメータを取得する
import { useParams } from "react-router-dom";

function GamePage() {
  // パラメータからgame_idを取得
  const { game_id } = useParams();

  return (
    <>
      {game_id}
    </>
  );
};

export default GamePage;