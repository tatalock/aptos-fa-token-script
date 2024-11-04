import { gql } from "graphql-request";

export const insertTokenMutation = gql`
  mutation insertTokenMutation($objects: [token_insert_input!] = {}) {
    insert_token(objects: $objects) {
      affected_rows
    }
  }
`;

export const getLastTxnVersionQuery = gql`
  query getLastTxnVersionQuery {
    token(order_by: { txn_version: desc }, limit: 1) {
      txn_version
    }
  }
`;

export const getMetadataFromFAQuery = gql`
  query getMetadataFromFAQuery($last_transaction_version: bigint = "") {
    fungible_asset_metadata(
      order_by: { last_transaction_version: asc }
      where: { last_transaction_version: { _gte: $last_transaction_version } }
    ) {
      decimals
      name
      symbol
      token_standard
      icon_uri
      last_transaction_version
      creator_address
      asset_type
      supply_v2
    }
  }
`;
