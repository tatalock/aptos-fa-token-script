import request from "graphql-request";
import {
  getLastTxnVersionQuery,
  getMetadataFromFAQuery,
} from "../query/index.js";
import { AptosClient } from "../utils/client.js";
import {
  END_POINTER_URL,
  OFFICIAL_END_POINTER_URL,
  pairedCoinToAssetType,
} from "../utils/index.js";
import { BigNumber } from "bignumber.js";

class Indexer {
  constructor() {}

  /**
   * Get other type from origin type
   * coin type <===> fa type
   *
   * @param asset_type origin type
   * @returns
   */
  async getCoinTypeFromFa(asset_type: string) {
    if (asset_type.indexOf("::") >= 0) {
      try {
        const result: any = await AptosClient.view({
          payload: {
            function: "0x1::coin::paired_metadata",
            typeArguments: [asset_type],
            functionArguments: [],
          },
        });
        return result?.[0].vec?.[0]?.inner || "";
      } catch (e: any) {
        console.log("asset_type", e.message);
        return "";
      }
    } else {
      try {
        const result: any = await AptosClient.view({
          payload: {
            function: "0x1::coin::paired_coin",
            typeArguments: [],
            functionArguments: [asset_type],
          },
        });
        return pairedCoinToAssetType(result?.[0].vec?.[0]);
      } catch (e: any) {
        console.log("asset_type", e.message);
        return "";
      }
    }
  }

  /**
   * Get Token metadata from specified version
   *
   * @param version start version
   * @returns
   */
  async getTokenMetadataFromVersion(version: number) {
    if (!OFFICIAL_END_POINTER_URL) return;

    console.log("fetch tokens from txn version: ", version);
    const result: any = await request({
      url: OFFICIAL_END_POINTER_URL,
      document: getMetadataFromFAQuery,
      variables: {
        last_transaction_version: version,
      },
    });

    return result?.fungible_asset_metadata;
  }

  async getLastTxnVersion() {
    if (!END_POINTER_URL) return;
    const result: any = await request({
      url: END_POINTER_URL,
      document: getLastTxnVersionQuery,
    });

    return result?.token?.[0]?.txn_version || "0";
  }
}

export default Indexer;
