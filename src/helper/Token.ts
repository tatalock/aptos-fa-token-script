import dotenv from "dotenv";
import { insertTokenMutation } from "../query/index.js";
import request from "graphql-request";
dotenv.config();

const END_POINTER_URL = process.env.END_POINTER_URL;

interface TokenParam {
  name: string;
  symbol: string;
  decimals: number;
  hyperfluid_symbol: string;
  logo_url: string;
  coingecko_id: string;
  coin_marketcap_id: string;
  asset_type: string;

  fa_type: string;
  coin_type: string;
  is_banned: boolean;
  txn_version: number;
  created_at: string;
  updated_at: string;
}

class Token {
  name = "";
  symbol = "";
  decimals = 8;
  hyperfluid_symbol = "";
  logo_url = "";

  coingecko_id = "";
  coin_marketcap_id = "";

  coin_type = "";
  fa_type = "";
  asset_type = "";
  is_banned = false;

  txn_version = 0;
  created_at = "";
  updated_at = "";

  constructor(args: TokenParam) {
    Object.assign(this, args);
  }

  async insert() {
    if (!END_POINTER_URL) return;

    await request({
      url: END_POINTER_URL,
      document: insertTokenMutation,
      variables: {
        objects: {
          name: this.name,
          symbol: this.symbol,
          decimals: this.decimals,
          hyperfluid_symbol: this.hyperfluid_symbol,

          logo_url: this.logo_url,
          coin_marketcap_id: this.coin_marketcap_id,
          coingecko_id: this.coingecko_id,

          coin_type: this.coin_type,
          fa_type: this.fa_type,
          asset_type: this.asset_type,
          is_banned: this.is_banned,

          txn_version: this.txn_version,
          created_at: this.created_at,
          updated_at: this.updated_at,
        },
      },
    });
  }
}

export default Token;
