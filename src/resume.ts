import prompts from "prompts";
import Indexer from "./helper/Indexer.js";
import { AptosClient } from "./utils/client.js";
import { sleep } from "@aptos-labs/ts-sdk";
import { BigNumber } from "bignumber.js";
import Token from "./helper/Token.js";

let startVersion = 0;
let endVersion = 0;

const run = async (version: number) => {
  const indexer = new Indexer();
  const tokens: any[] = await indexer.getTokenMetadataFromVersion(version);

  if (tokens) {
    const results: any = await Promise.all(
      tokens.map((token: any) => {
        return indexer.getCoinTypeFromFa(token.asset_type);
      })
    );

    results.forEach(async (type: string, i: number) => {
      let token = tokens[i];

      Token.SetType(token, [type, token.asset_type]);
      const t = new Token(Token.paramsFormat(token));

      try {
        await t.upsert();
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

    if (new BigNumber(tokens[tokens.length - 1].txn_version).gte(endVersion)) {
      console.log(`All Done, And Stop at: ${endVersion}`);
      return;
    }

    console.log("sleep 2s and continue");
    await sleep(2000);
    return run(tokens[tokens.length - 1].last_transaction_version);
  }
};
async function main() {
  // fetch latest version

  const indexer = new Indexer();

  const stopVersion: any = await indexer.getLastTxnVersion();
  const latestVersionOnChain: any = (
    await AptosClient.getIndexerLastSuccessVersion()
  ).toString();

  const result: any = await prompts([
    {
      type: "text",
      name: "start",
      message:
        "Set Start Version(default: latest version of exist token metadata)",
      initial: stopVersion,
    },
    {
      type: "text",
      name: "end",
      message: "Set End Version(default: latest success version on chain)",
      initial: latestVersionOnChain,
    },
  ]);
  startVersion = result.start;
  endVersion = result.end;

  if (new BigNumber(startVersion).gt(new BigNumber(endVersion))) {
    console.log("start version should be less than end version");
    return;
  }

  run(startVersion);
}

main();
