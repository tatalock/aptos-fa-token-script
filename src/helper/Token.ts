import dotenv from "dotenv";
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
import { findTokenByCoinAssetType } from "../data/staticTokenList.js";

dotenv.config();

interface TokenParam {
  name: string;
  symbol: string;
  decimals: number;
  hyperfluidSymbol: string;
  logoUrl: string;
  coingeckoId: string;
  coinMarketcapId: string;
  assetType: string;

  faType: string;
  coinType: string;
  isBanned: boolean;
  txnVersion: number;
}

class Token {
  name = "";
  symbol = "";
  decimals = 8;
  hyperfluidSymbol = "";
  logoUrl = "";

  coingeckoId = "";
  coinMarketcapId = "";

  coinType = "";
  faType = "";
  assetType = "";
  isBanned = false;

  txnVersion = 0;

  constructor(args: TokenParam) {
    Object.assign(this, args);
  }

  async upsert() {
    if (!END_POINTER_URL) return;

    let staticCoinData = await findTokenByCoinAssetType(this.coinType);
    let staticFaData = {};
    if (!staticCoinData) {
      staticFaData = await findTokenByCoinAssetType(this.faType);
    }
    let staticData = staticCoinData || staticFaData;
    const objects: any = {
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
      hyperfluidSymbol: this.hyperfluidSymbol,

      // chain data > static data
      logoUrl: this.logoUrl || staticData?.logoUrl || "",
      coinMarketcapId:
        this.coinMarketcapId || staticData?.coinMarketCapId?.toString() || "",
      coingeckoId:
        this.coingeckoId || staticData?.coingeckoId?.toString() || "",

      coinType: this.coinType,
      faType: this.faType,
      assetType: this.assetType,
      isBanned: this.isBanned,

      txnVersion: this.txnVersion,
    };

    // for db
    if (!this.faType) {
      delete objects.faType;
    }

    if (!this.coinType) {
      delete objects.coinType;
    }

    await request({
      url: END_POINTER_URL,
      document: upsertTokenMutation,
      variables: {
        objects,
      },
      requestHeaders: {
        "x-hasura-admin-secret": process.env.ADMIN_HEADERS,
      },
    });
  }

  static SetType(token: any, types: string[]) {
    if (types?.length < 2) return;

    if (types[0]!.indexOf("::") >= 0) {
      token.coinType = types[0];
      token.faType = types[1];
    } else {
      token.coinType = types[1];
      token.faType = types[0];
    }
  }

  static paramsFormat(token: any) {
    return {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      hyperfluidSymbol: token.symbol,

      logoUrl: token.icon_uri || token.logoUrl || "",
      coingeckoId: "",
      coinMarketcapId: "",

      coinType: token.coinType || token.coin_type,
      faType: token.faType || token.fa_type,
      assetType: token.asset_type,
      isBanned: false,

      txnVersion: token.last_transaction_version.toString(),
    };
  }

  static async getTokenByAssetType(assetType: string) {
    if (!OFFICIAL_END_POINTER_URL) return;

    const result: any = await request({
      url: OFFICIAL_END_POINTER_URL,
      document: getMetadataFromTypeQuery,
      variables: {
        assetType: typeToLong(assetType),
      },
    });

    return result?.fungible_asset_metadata?.[0];
  }
}

export default Token;
