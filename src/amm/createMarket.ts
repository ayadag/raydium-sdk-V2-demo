// import { RAYMint, USDCMint, OPEN_BOOK_PROGRAM, DEVNET_PROGRAM_ID, WSOLMint } from '@raydium-io/raydium-sdk-v2'
import {
  DEVNET_PROGRAM_ID,
  WSOLMint,
} from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';

import {
  initSdk,
  txVersion,
} from '../config';

export const createMarket = async () => {
  const raydium = await initSdk()

  // check mint info here: https://api-v3.raydium.io/mint/list
  // or get mint info by api: await raydium.token.getTokenInfo('mint address')

  const { execute, extInfo, transactions } = await raydium.marketV2.create({
    baseInfo: {
      // mint: RAYMint,
      mint: new PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb'),
      decimals: 9,
    },
    quoteInfo: {
      // mint: USDCMint,
      mint: WSOLMint,
      decimals: 9,
    },
    lotSize: 0.001,
    tickSize: 0.001,
    // dexProgramId: OPEN_BOOK_PROGRAM, //mainnet
    dexProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET, // devnet
    txVersion,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  })

  console.log(
    `create market total ${transactions.length} txs, market info: `,
    Object.keys(extInfo.address).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
      }),
      {}
    )
  )

  const txIds = await execute({
    // set sequentially to true means tx will be sent when previous one confirmed
    sequentially: true,
  })

  console.log('create market txIds:', txIds)
}

/** uncomment code below to execute */
createMarket()
