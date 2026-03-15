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
  sente_player_type: "USER" | "FIRST_PARTY_AI" | "THIRD_PARTY_AI"
  sente_name: string
  sente_ai_url: string | null
  gote_player_type: "USER" | "FIRST_PARTY_AI" | "THIRD_PARTY_AI"
  gote_name: string
  gote_ai_url: string | null
  kifu: string
  status: "PLAYING" | "FINISHED" | "ABORTED"
  result: "SENTE_WIN" | "GOTE_WIN" | "DRAW" | null
};

export type KomaType =
  | "OU"
  | "KIN"
  | "GIN"
  | "KEI"
  | "KYOU"
  | "HISHA"
  | "KAKU"
  | "FU"

export type MochigomaType = Exclude<KomaType, "OU">

export type Koma = {
  type: KomaType
  owner: "sente" | "gote"
  promoted: boolean
}

export type Board = (Koma | null)[][]

export type Mochigoma = {
  sente: Record<MochigomaType, number>
  gote: Record<MochigomaType, number>
}
