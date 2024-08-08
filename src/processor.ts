import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as erc721 from "./abi/erc721";

export const processor = new EvmBatchProcessor()
  .setGateway('https://v2.archive.subsquid.io/network/arthera-mainnet')
  // Chain RPC endpoint is required for
  //  - indexing unfinalized blocks https://docs.subsquid.io/basics/unfinalized-blocks/
  //  - querying the contract state https://docs.subsquid.io/evm-indexing/query-state/
  .setRpcEndpoint({
    // Set the URL via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    url: assertNotNull(process.env.RPC_ETH_HTTP, 'No RPC endpoint supplied'),
    // More RPC connection options at https://docs.subsquid.io/evm-indexing/configuration/initialization/#set-data-source
    rateLimit: 10
  })
  .addTrace({
    type: ["create"],
    transaction: true,
  })
  .addLog({
    topic0: [erc721.events.Transfer.topic],
  })
  .setFields({
    trace: {
      createResultCode: true, // for checking ERC721 compliance
      createResultAddress: true,
    },
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
