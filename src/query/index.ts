import { gql } from "graphql-request";

export const upsertTokenMutation = gql`
  mutation insertTokenMutation($objects: [FaMetaInsertInput!] = {}) {
    insertFaMeta(
      objects: $objects
      onConflict: {
        updateColumns: [
          txnVersion
          faType
          coinType
          logoUrl
          coingeckoId
          coinMarketcapId
        ]
        constraint: fa_meta_asset_type_key
      }
    ) {
      affectedRows
    }
  }
`;

export const getLastTxnVersionQuery = gql`
  query getLastTxnVersionQuery {
    faMeta(orderBy: { txnVersion: DESC }, limit: 1) {
      txnVersion
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
  query getMetadataFromFAQuery($assetType: String = "") {
    fungible_asset_metadata(where: { asset_type: { _eq: $assetType } }) {
      ...TokenMetadata
    }
  }
`;
