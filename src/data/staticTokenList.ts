import { PanoraTokenListURL } from "../config/index.js";

let tokens: any = [];
const getStaticToken = async () => {
  const result: any = await fetch(PanoraTokenListURL);
  tokens = await result.json();
};

export const findTokenByCoinAssetType = async (asset_type: string) => {
  if (tokens.length === 0) {
    await getStaticToken();
  }
  return tokens.find((token: any) => token.tokenAddress === asset_type);
};
