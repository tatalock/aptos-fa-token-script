import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const AptosClient = new Aptos(
  new AptosConfig({
    network: Network.TESTNET,
  })
);
