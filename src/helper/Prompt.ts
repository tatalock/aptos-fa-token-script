import { readFileSync } from "fs";
import Indexer from "./Indexer.js";

class Prompt {
  static async UpdateSpecifiedToken(filePath: string) {
    const json: string = await readFileSync(filePath, "utf-8");
    const tokenTypes: string[] = JSON.parse(json).filter((t: string) =>
      t.startsWith("0x")
    );

    const indexer = new Indexer();
    console.log(tokenTypes);
    tokenTypes.forEach(async (type: string) => {
      const coinType = await indexer.getCoinTypeFromFa(type);
    });
  }
}

export default Prompt;
