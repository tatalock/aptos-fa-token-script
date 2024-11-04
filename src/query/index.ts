import { gql } from "graphql-request";

export const insertTokenMutation = gql`
  mutation insertTokenMutation($objects: [token_insert_input!] = {}) {
    insert_token(
      objects: $objects
      on_conflict: {
        update_columns: [txn_version, logo_url, coingecko_id, coin_marketcap_id]
        constraint: token_testnet_fa_type_coin_type_key
      }
    ) {
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

export const tokenMetadataFragment = gql`
  fragment TokenMetadata on fungible_asset_metadata {
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
`;

export const getMetadataFromFAQuery = gql`
  ${tokenMetadataFragment}
  query getMetadataFromFAQuery($last_transaction_version: bigint = "") {
    fungible_asset_metadata(
      order_by: { last_transaction_version: asc }
      where: { last_transaction_version: { _gte: $last_transaction_version } }
    ) {
      ...TokenMetadata
    }
  }
`;

export const getMetadataFromTypeQuery = gql`
  ${tokenMetadataFragment}
  query getMetadataFromFAQuery($asset_type: String = "") {
    fungible_asset_metadata(where: { asset_type: { _eq: $asset_type } }) {
      ...TokenMetadata
    }
  }
`;
