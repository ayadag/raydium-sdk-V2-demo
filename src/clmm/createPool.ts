import BN from 'bn.js';
import Decimal from 'decimal.js';

// import { CLMM_PROGRAM_ID, DEVNET_PROGRAM_ID } from '@raydium-io/raydium-sdk-v2'
import { DEVNET_PROGRAM_ID } from '@raydium-io/raydium-sdk-v2';
import { PublicKey } from '@solana/web3.js';

import {
  initSdk,
  txVersion,
} from '../config';

export const createPool = async () => {
  const raydium = await initSdk({ loadToken: true })

  // you can call sdk api to get mint info or paste mint info from api: https://api-v3.raydium.io/mint/list
  // RAY: 4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R
  const mint1 = await raydium.token.getTokenInfo('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb')
  // USDT: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
  const mint2 = await raydium.token.getTokenInfo('So11111111111111111111111111111111111111112')
  //ayad: note: api doesn't support get devnet pool info
  const clmmConfigs = await raydium.api.getClmmConfigs()
  console.log(clmmConfigs)

  const { execute } = await raydium.clmm.createPool({
    programId: DEVNET_PROGRAM_ID.CLMM, // devnet: DEVNET_PROGRAM_ID.CLMM
    mint1,
    mint2,
    ammConfig: { ...clmmConfigs[0], id: new PublicKey(clmmConfigs[0].id), fundOwner: '' },
    initialPrice: new Decimal(10),
    startTime: new BN(0),
    txVersion,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  })
  const { txId } = await execute()
  console.log('clmm pool created:', { txId })
}

/** uncomment code below to execute */
createPool()
