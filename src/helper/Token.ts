import {
  getMetadataFromTypeQuery,
  upsertTokenMutation,
} from "../query/index.js";
import request from "graphql-request";
import {
  END_POINTER_URL,
  OFFICIAL_END_POINTER_URL,
  typeToLong,
} from "../utils/index.js";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import { findTokenByCoinAssetType } from "../data/staticTokenList.js";

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

  constructor(args: TokenParam) {
    Object.assign(this, args);
  }

  async upsert() {
    if (!END_POINTER_URL) return;

    let staticCoinData = await findTokenByCoinAssetType(this.coin_type);
    let staticFaData = {};
    if (!staticCoinData) {
      staticFaData = await findTokenByCoinAssetType(this.fa_type);
    }
    let staticData = staticCoinData || staticFaData;
    const objects: any = {
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      hyperfluid_symbol: this.hyperfluid_symbol,

      // chain data > static data
      logo_url: this.logo_url || staticData?.logoUrl || "",
      coin_marketcap_id:
        this.coin_marketcap_id || staticData?.coinMarketCapId?.toString() || "",
      coingecko_id:
        this.coingecko_id || staticData?.coingeckoId?.toString() || "",

      coin_type: this.coin_type,
      fa_type: this.fa_type,
      asset_type: this.asset_type,
      is_banned: this.is_banned,

      txn_version: this.txn_version,
    };

    // for db
    if (!this.fa_type) {
      delete objects.fa_type;
    }

    if (!this.coin_type) {
      delete objects.coin_type;
    }

    await request({
      url: END_POINTER_URL,
      document: upsertTokenMutation,
      variables: {
        objects,
      },
    });
  }

  static SetType(token: any, types: string[]) {
    if (types?.length < 2) return;

    if (types[0]!.indexOf("::") >= 0) {
      token.coin_type = types[0];
      token.fa_type = types[1];
    } else {
      token.coin_type = types[1];
      token.fa_type = types[0];
    }
  }

  static paramsFormat(token: any) {
    return {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      hyperfluid_symbol: token.symbol,

      logo_url: token.icon_uri || token.logoUrl || "",
      coingecko_id: "",
      coin_marketcap_id: "",

      coin_type: token.coin_type,
      fa_type: token.fa_type,
      asset_type: token.asset_type,
      is_banned: false,

      txn_version: token.last_transaction_version.toString(),
    };
  }

  static async getTokenByAssetType(asset_type: string) {
    if (!OFFICIAL_END_POINTER_URL) return;

    const result: any = await request({
      url: OFFICIAL_END_POINTER_URL,
      document: getMetadataFromTypeQuery,
      variables: {
        asset_type: typeToLong(asset_type),
      },
    });

    return result?.fungible_asset_metadata?.[0];
  }
}

export default Token;
