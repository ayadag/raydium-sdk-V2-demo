import { toBufferBE } from 'bigint-buffer';
import BN from 'bn.js';

// import {
//   MARKET_STATE_LAYOUT_V3,
//   AMM_V4,
//   OPEN_BOOK_PROGRAM,
//   FEE_DESTINATION_ID,
//   DEVNET_PROGRAM_ID,
// } from '@raydium-io/raydium-sdk-v2'
import {
  DEVNET_PROGRAM_ID,
  MARKET_STATE_LAYOUT_V3,
} from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';

import {
  initSdk,
  txVersion,
} from '../config';

function calcNonDecimalValue(value: number, decimals: number): number {
  return Math.trunc(value * (Math.pow(10, decimals)))
}

export const createAmmPool = async () => {
  const raydium = await initSdk()
  const marketId = new PublicKey(`5ScZV64utxB36Ga2VAvUSLgXTHsas3Dywaq2fxhRCPQe`)

  // if you are confirmed your market info, don't have to get market info from rpc below
  const marketBufferInfo = await raydium.connection.getAccountInfo(new PublicKey(marketId))
  const { baseMint, quoteMint } = MARKET_STATE_LAYOUT_V3.decode(marketBufferInfo!.data)

  // check mint info here: https://api-v3.raydium.io/mint/list
  // or get mint info by api: await raydium.token.getTokenInfo('mint address')

  const baseMintInfo = await raydium.token.getTokenInfo(baseMint)
  const quoteMintInfo = await raydium.token.getTokenInfo(quoteMint)

  const { execute, extInfo } = await raydium.liquidity.createPoolV4({
    // programId: AMM_V4,
    programId: DEVNET_PROGRAM_ID.AmmV4, // devnet
    marketInfo: {
      marketId,
      // programId: OPEN_BOOK_PROGRAM,
      programId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devent
    },
    baseMintInfo: {
      mint: baseMint,
      decimals: baseMintInfo.decimals, // if you know mint decimals here, can pass number directly
    },
    quoteMintInfo: {
      mint: quoteMint,
      decimals: quoteMintInfo.decimals, // if you know mint decimals here, can pass number directly
    },
    // baseAmount: new BN(1),
    // quoteAmount: new BN(1),
    baseAmount: new BN(toBufferBE(BigInt(calcNonDecimalValue(100, baseMintInfo.decimals).toString()), 8)),
    quoteAmount: new BN(toBufferBE(BigInt(calcNonDecimalValue(0.1, baseMintInfo.decimals).toString()), 8)),

    // sol devnet faucet: https://faucet.solana.com/
    // baseAmount: new BN(4 * 10 ** 9), // if devent pool with sol/wsol, better use amount >= 4*10**9
    // quoteAmount: new BN(4 * 10 ** 9), // if devent pool with sol/wsol, better use amount >= 4*10**9

    startTime: new BN(0), // unit in seconds
    ownerInfo: {
      useSOLBalance: true,
    },
    associatedOnly: false,
    txVersion,
    // feeDestinationId: FEE_DESTINATION_ID,
    feeDestinationId: DEVNET_PROGRAM_ID.FEE_DESTINATION_ID, // devnet
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 10000000,
    // },
  })

  const { txId } = await execute()
  console.log(
    'amm pool created! txId: ',
    txId,
    ', poolKeys:',
    Object.keys(extInfo.address).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
      }),
      {}
    )
  )
}

/** uncomment code below to execute */
createAmmPool()
