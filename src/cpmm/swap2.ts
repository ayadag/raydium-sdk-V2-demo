import BN from 'bn.js';

// import {
//   ApiV3PoolInfoStandardItemCpmm,
//   CurveCalculator,
//   ApiV3Token,
// } from '@raydium-io/raydium-sdk-v2';
import { CurveCalculator } from '@raydium-io/raydium-sdk-v2';

import { initSdk } from '../config';
import { isValidCpmm } from './utils';

// export interface ApiV3PoolInfoBaseItem {
//   programId: string;
//   id: string;
//   mintA: ApiV3Token;
//   mintB: ApiV3Token;
//   rewardDefaultInfos: PoolFarmRewardInfo[];
//   rewardDefaultPoolInfos: "Ecosystem" | "Fusion" | "Raydium" | "Clmm";
//   price: number;
//   mintAmountA: number;
//   mintAmountB: number;
//   feeRate: number;
//   openTime: string;
//   tvl: number;

//   day: ApiV3PoolInfoCountItem;
//   week: ApiV3PoolInfoCountItem;
//   month: ApiV3PoolInfoCountItem;
//   pooltype: PoolTypeItem[];

//   farmUpcomingCount: number;
//   farmOngoingCount: number;
//   farmFinishedCount: number;
// }

// export type ApiV3PoolInfoStandardItemCpmm = ApiV3PoolInfoBaseItem & {
//   type: "Standard";
//   lpMint: ApiV3Token;
//   lpPrice: number;
//   lpAmount: number;
//   config: ApiCpmmConfigV3;
// };

// export type ApiV3Token = {
//   chainId: number;
//   address: string;
//   programId: string;
//   logoURI: string;
//   symbol: string;
//   name: string;
//   decimals: number;
//   tags: string[]; // "hasFreeze" | "hasTransferFee" | "token-2022" | "community" | "unknown" ..etc
//   extensions: ExtensionsItem;
// };

export const swap = async () => {
  const raydium = await initSdk()

  // SOL - USDC pool
  // note: api doesn't support get devnet pool info
  const data = await raydium.api.fetchPoolById({ ids: 'CnoKYnj3GNdTxQfKKBxmq33rJMShyt3eC1zWGgfptzkT' })
  // const poolInfo = data[0] as ApiV3PoolInfoStandardItemCpmm

  // if (!isValidCpmm(poolInfo.programId)) throw new Error('target pool is not CPMM pool')
  // const rpcData = await raydium.cpmm.getRpcPoolInfo(poolInfo.id, true)

  // const minta: ApiV3Token ={
    const minta = {
    name: 'WSOL',
    symbol: 'WSOL',
    address: 'So11111111111111111111111111111111111111112',
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    decimals: 9
  }
  // const mintb: ApiV3Token = {
    const mintb = {
    name: 'SALD',
    symbol: 'SALD',
    address: 'Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb',
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    decimals: 9
  }

  // const poolInfo2: ApiV3PoolInfoStandardItemCpmm = {
    const poolInfo2 = {
    programId: '97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo',
    id: '9qVb7iFiAoTyFoEYM2ZSBULeHRvBYUhPkpswoESjyUZV',
    mintA: minta,
    mintB: mintb
  }

  const poolInfo = poolInfo2;
  
  if (!isValidCpmm(poolInfo.programId)) throw new Error('target pool is not CPMM pool')
    const rpcData = await raydium.cpmm.getRpcPoolInfo(poolInfo.id, true)

  const inputAmount = new BN(1)
  const inputMint = poolInfo.mintA.address
  const baseIn = inputMint === poolInfo.mintA.address

  // swap pool mintA for mintB
  const swapResult = CurveCalculator.swap(
    inputAmount,
    baseIn ? rpcData.baseReserve : rpcData.quoteReserve,
    baseIn ? rpcData.quoteReserve : rpcData.baseReserve,
    rpcData.configInfo!.tradeFeeRate
  )

  /**
   * swapResult.sourceAmountSwapped -> input amount
   * swapResult.destinationAmountSwapped -> output amount
   * swapResult.tradeFee -> this swap fee, charge input mint
   */

  const { execute } = await raydium.cpmm.swap({
    poolInfo,
    swapResult,
    slippage: 0.1, // range: 1 ~ 0.0001, means 100% ~ 0.01%
    baseIn,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  })

  const { txId } = await execute()
  console.log(`swapped: ${poolInfo.mintA.symbol} to ${poolInfo.mintB.symbol}:`, { txId })
}

/** uncomment code below to execute */
// swap()


async function test() {
  const poolId = '9qVb7iFiAoTyFoEYM2ZSBULeHRvBYUhPkpswoESjyUZV'
  const raydium = await initSdk()
  const rpcData = await raydium.cpmm.getRpcPoolInfo(poolId, true)
  console.log('rpcData: ',rpcData)

  // rpcData:  {
  //   configId: PublicKey [PublicKey(Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK)] {
  //     _bn: <BN: af3a14a67c821b7cb2e2524481c7e0002f4d14b5c963983ad573a20ec9c76d34>
  //   },
  //   poolCreator: PublicKey [PublicKey(hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus)] {
  //     _bn: <BN: a4c7faa41f8f53a721ba8f242254fd88dcf79861b48b1556989baa82792af26>
  //   },
  //   vaultA: PublicKey [PublicKey(Hq3SerZ6uptsaKYiVuL5Xy61ARwm81sHjdByBr7WfKGx)] {
  //     _bn: <BN: fa09a193b7faa2f997302f50cfa403bd4f1f57ea13ab80d31d48a7a79ff045e5>
  //   },
  //   vaultB: PublicKey [PublicKey(BBDBRP1KtJLssQYatYM6fyx4VmJG5YmWBi7365sJT9BG)] {
  //     _bn: <BN: 973272edc8dc52c4e82a46a36a13e3d8b776ad2e1df2ca83787aafb5a253ba53>
  //   },
  //   mintLp: PublicKey [PublicKey(Fhs7bAXDrQa3XVTWjbaGDYLUKAMPC6ALTE4xFMkg9Thv)] {
  //     _bn: <BN: da7b8351a7fee259ff846c14dc88f972ed6b2dc1a68394bb9e72bafffeaad87d>
  //   },
  //   mintA: PublicKey [PublicKey(So11111111111111111111111111111111111111112)] {
  //     _bn: <BN: 69b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001>
  //   },
  //   mintB: PublicKey [PublicKey(Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb)] {
  //     _bn: <BN: bfd59403f7b4900bf11b554ec83a635f7cae6fd3c0b317af42aaba3a0f0b772e>
  //   },
  //   mintProgramA: PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
  //     _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
  //   },
  //   mintProgramB: PublicKey [PublicKey(TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)] {
  //     _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>
  //   },
  //   observationId: PublicKey [PublicKey(BMybyajCy2U776QizNaNREtDHGHKccZvYV5G49J3DeVY)] {
  //     _bn: <BN: 99f47c97cc3bf31b42808e0d43e9cc48e2cafbc3b0114a0b8550f1d6f2c870cb>
  //   },
  //   bump: 254,
  //   status: 0,
  //   lpDecimals: 9,
  //   mintDecimalA: 9,
  //   mintDecimalB: 9,
  //   lpAmount: <BN: 64>,
  //   protocolFeesMintA: <BN: 0>,
  //   protocolFeesMintB: <BN: 0>,
  //   fundFeesMintA: <BN: 0>,
  //   fundFeesMintB: <BN: 0>,
  //   openTime: <BN: 66880147>,
  //   baseReserve: <BN: 1>,
  //   quoteReserve: <BN: 2710>,
  //   configInfo: {
  //     bump: 254,
  //     disableCreatePool: false,
  //     index: 0,
  //     tradeFeeRate: <BN: a>,
  //     protocolFeeRate: <BN: 3e8>,
  //     fundFeeRate: <BN: 61a8>,
  //     createPoolFee: <BN: 0>,
  //     protocolOwner: PublicKey [PublicKey(oB7FMyPBtTxCq3CoQktmo25kL3UqHRL4DkQX4GdPrEc)] {
  //       _bn: <BN: bd425638905f30a05e0db11906c40fa5a1962b94a6f025136ae417917b93bc9>
  //     },
  //     fundOwner: PublicKey [PublicKey(oB7FMyPBtTxCq3CoQktmo25kL3UqHRL4DkQX4GdPrEc)] {
  //       _bn: <BN: bd425638905f30a05e0db11906c40fa5a1962b94a6f025136ae417917b93bc9>
  //     }
  //   },
  //   poolPrice: 10000
  // }
}
test();