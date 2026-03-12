export type AI = {
    ai_id: string
    created_by_user_id: string
    created_by_user_name: string
    ai_name: string
    full_url: string
};

export type Game = {
  game_id: string
  created_by_user_id: string
  sente_player_type: string
  sente_name: string
  sente_ai_url: string | null
  gote_player_type: string
  gote_name: string
  gote_ai_url: string | null
  kifu: string
  status: string
  result: string | null
};