import path from "path";
import { AptosClient } from "./client.js";
import { findTokenByCoinAssetType } from "./data/staticTokenList.js";
import Indexer from "./helper/Indexer.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { sleep } from "@aptos-labs/ts-sdk";
import Token from "./helper/Token.js";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);
const targetFile = path.resolve(__dirname, "json/tokens.json");

const indexer = new Indexer();

const run = async (version: number) => {
  const tokens: any[] = await indexer.getTokenMetadataFromVersion(version);

  if (tokens) {
    const results: any = await Promise.all(
      tokens.map((token: any) => {
        return indexer.getCoinTypeFromFa(token.asset_type);
      })
    );

    results.forEach(async (type: string, i: number) => {
      let token = tokens[i];
      if (type.indexOf("::") >= 0) {
        token = {
          ...token,
          coin_type: type,
          fa_type: token.asset_type,
        };
      } else {
        token = {
          ...token,
          fa_type: type,
          coin_type: token.asset_type,
        };
      }

      const time = new Date().toISOString();
      const t = new Token({
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        hyperfluid_symbol: token.symbol,

        logo_url: token.icon_uri,
        coingecko_id: "",
        coin_marketcap_id: "",

        coin_type: token.coin_type,
        fa_type: token.fa_type,
        asset_type: token.asset_type,
        is_banned: false,

        txn_version: token.last_transaction_version,
        created_at: time,
        updated_at: time,
      });

      try {
        await t.insert();
        console.log(
          "Token ",
          token.symbol,
          " + ",
          token.asset_type,
          ". Insert Done"
        );
      } catch (e: any) {
        console.log("\n");
        console.error(
          token.asset_type,
          " ",
          token.symbol,
          ":",
          e.response?.errors?.[0]?.message
        );
        console.log("\n");
      }
    });

    if (tokens.length < 100) {
      console.log("all done");
      return;
    }

    console.log("sleep 2s and continue");
    await sleep(2000);
    return run(tokens[tokens.length - 1].last_transaction_version);
  }
};
const main = async () => {
  run(0);
};

// TODO: update specific tokens
// TODO: update all tokens
main();
