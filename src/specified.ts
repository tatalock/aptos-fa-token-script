import { readFileSync } from "fs";
import Indexer from "./helper/Indexer.js";
import Token from "./helper/Token.js";

const filePath = "./token-type.json";

async function main() {
  const json: string = await readFileSync(filePath, "utf-8");
  const tokenTypes: string[] = JSON.parse(json).filter((t: string) =>
    t.startsWith("0x")
  );

  const indexer = new Indexer();
  tokenTypes.forEach(async (type: string) => {
    if (!type) return;
    const coinType: string = await indexer.getCoinTypeFromFa(type);

    const tokenMD: any = await Token.getTokenByAssetType(type || coinType);

    Token.SetType(tokenMD, [type, coinType]);
    const token = new Token(Token.paramsFormat(tokenMD));
    await token.upsert();
  });
}

main();
