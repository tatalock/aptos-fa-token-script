import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { AccountAddress } from "@aptos-labs/ts-sdk";
dotenv.config();

export const OFFICIAL_END_POINTER_URL = process.env.OFFICIAL_END_POINTER_URL;
export const END_POINTER_URL = process.env.END_POINTER_URL;

function hex2a(hexx: number | string) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
export const pairedCoinToAssetType = (data: any) => {
  if (!data?.account_address) return "";
  return [
    data.account_address,
    hex2a(data.module_name.replace("0x", "")),
    hex2a(data.struct_name.replace("0x", "")),
  ].join("::");
};

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
export const dirname = path.dirname(__filename);

export const typeToLong = (type: string) => {
  if (type.split("::").length == 3) {
    const [account_address, module_name, token_name]: string[] =
      type.split("::");
    if (!account_address) return "";
    return `${AccountAddress.from(
      account_address
    ).toStringLong()}::${module_name}::${token_name}`;
  } else if (type) {
    return AccountAddress.from(type).toStringLong();
  }
};
