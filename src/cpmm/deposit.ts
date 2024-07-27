import BN from 'bn.js';
import Decimal from 'decimal.js';

import {
  ApiV3PoolInfoStandardItemCpmm,
  Percent,
} from '@raydium-io/raydium-sdk-v2';

import {
  initSdk,
  txVersion,
} from '../config';

export const deposit = async () => {
  // const raydium = await initSdk()
  const raydium = await initSdk({ loadToken: false }) //ayad

  // SOL - USDC pool
  // note: api doesn't support get devnet pool info
  // const data = await raydium.api.fetchPoolById({ ids: '7JuwJuNU88gurFnyWeiyGKbFmExMWcmRZntn9imEzdny' })
  // console.log('data: ', data)

  // const poolInfo = data[0] as ApiV3PoolInfoStandardItemCpmm
  // if (!isValidCpmm(poolInfo.programId)) throw new Error('target pool is not CPMM pool')

  let poolInfo: ApiV3PoolInfoStandardItemCpmm;

  poolInfo = {
    type: "Standard",
    // lpMint: ApiV3Token;
    lpMint: {
      chainId:101,
      address:"Fhs7bAXDrQa3XVTWjbaGDYLUKAMPC6ALTE4xFMkg9Thv",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"",
      symbol:"",
      name:"",
      decimals:9,
      tags:[],
      extensions:{} 
    },
    // lpPrice: number;
    lpPrice: 10000,
    // lpAmount: number;
    lpAmount: 64,
    // config: ApiCpmmConfigV3;
    config: {
      id:"Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK",
      index:0,
      protocolFeeRate:120000,
      tradeFeeRate:2500,
      fundFeeRate:40000,
      createPoolFee:"150000000"
    },
    // programId: string;
    // id: string;
    // mintA: ApiV3Token;
    // mintB: ApiV3Token;
    programId:"97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo",
    id:"9qVb7iFiAoTyFoEYM2ZSBULeHRvBYUhPkpswoESjyUZV",
    mintA:{
      chainId:101,
      address:"So11111111111111111111111111111111111111112",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png",
      symbol:"WSOL",
      name:"Wrapped SOL",
      decimals:9,
      tags:[],
      extensions:{}
    },
    mintB:{
      chainId:101,
      address:"Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"",
      symbol:"SALD",
      name:"SALD",
      decimals:9,
      tags:[],
      extensions:{}
    },

    // rewardDefaultInfos: PoolFarmRewardInfo[];
    rewardDefaultInfos: [],
    // rewardDefaultPoolInfos: "Ecosystem" | "Fusion" | "Raydium" | "Clmm";
    rewardDefaultPoolInfos: "Raydium",
    // price: number;
    price: 1,
    // mintAmountA: number;
    mintAmountA: 1,
    // mintAmountB: number;
    mintAmountB: 1,
    // feeRate: number;
    feeRate: 1,
    // openTime: string;
    openTime:"66880147",
    // tvl: number;
    tvl: 1,
  
    // day: ApiV3PoolInfoCountItem;
    day: {
      volume: 1,
      volumeQuote: 1,
      volumeFee: 1,
      apr: 1,
      feeApr: 1,
      priceMin: 1,
      priceMax: 1,
      rewardApr: [1]
    },
    // week: ApiV3PoolInfoCountItem;
    week: {
      volume: 1,
      volumeQuote: 1,
      volumeFee: 1,
      apr: 1,
      feeApr: 1,
      priceMin: 1,
      priceMax: 1,
      rewardApr: [1]
    },
    // month: ApiV3PoolInfoCountItem;
    month: {
      volume: 1,
      volumeQuote: 1,
      volumeFee: 1,
      apr: 1,
      feeApr: 1,
      priceMin: 1,
      priceMax: 1,
      rewardApr: [1]
    },
    // pooltype: PoolTypeItem[];
    pooltype : ["StablePool"],
  
    // farmUpcomingCount: number;
    // farmOngoingCount: number;
    // farmFinishedCount: number;
    farmUpcomingCount: 1,
    farmOngoingCount: 1,
    farmFinishedCount: 1,
  }

// pool1Info:  {
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
//   configInfo: undefined,
//   poolPrice: 10000
// }

  let poolInfo3 = {
    type: "Standard",
    // lpMint: ApiV3Token;
    lpMint: {
      chainId:101,
      address:"BDjLBazjFbqRwiQWQz3zeZNzj2z9GDweNpDkn2Hjo6yZ",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"",
      symbol:"",
      name:"",
      decimals:9,
      tags:[],
      extensions:{} 
    },
    // lpPrice: number;
    lpPrice: 1,
    // lpAmount: number;
    lpAmount: 1,
    // config: ApiCpmmConfigV3;
    config: {
      id:"D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2",
      index:0,
      protocolFeeRate:120000,
      tradeFeeRate:2500,
      fundFeeRate:40000,
      createPoolFee:"150000000"
    },
    // programId: string;
    // id: string;
    // mintA: ApiV3Token;
    // mintB: ApiV3Token;
    programId:"CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C",
    id:"EwBdhByEJ2w9nZ8aHghYrtcZ3DZBEQrot5wAv6bxuZv",
    mintA:{
      chainId:101,
      address:"So11111111111111111111111111111111111111112",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png",
      symbol:"WSOL",
      name:"Wrapped SOL",
      decimals:9,
      tags:[],
      extensions:{}
    },
    mintB:{
      chainId:101,
      address:"HCLiq7LWktm6X7vPUyD2fFCQE5GSyW6DKCGPVkL4addr",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"https://img-v1.raydium.io/icon/HCLiq7LWktm6X7vPUyD2fFCQE5GSyW6DKCGPVkL4addr.png",
      symbol:"L2",
      name:"L2",
      decimals:6,
      tags:[],
      extensions:{}
    },

    // rewardDefaultInfos: PoolFarmRewardInfo[];
    rewardDefaultInfos: [],
    // rewardDefaultPoolInfos: "Ecosystem" | "Fusion" | "Raydium" | "Clmm";
    rewardDefaultPoolInfos: "Raydium",
    // price: number;
    price: 1,
    // mintAmountA: number;
    mintAmountA: 1,
    // mintAmountB: number;
    mintAmountB: 1,
    // feeRate: number;
    feeRate: 1,
    // openTime: string;
    openTime:"1721665399",
    // tvl: number;
    tvl: 1,
  
    // day: ApiV3PoolInfoCountItem;
    day: {
      volume: 1,
      volumeQuote: 1,
      volumeFee: 1,
      apr: 1,
      feeApr: 1,
      priceMin: 1,
      priceMax: 1,
      rewardApr: [1]
    },
    // week: ApiV3PoolInfoCountItem;
    week: {
      volume: 1,
      volumeQuote: 1,
      volumeFee: 1,
      apr: 1,
      feeApr: 1,
      priceMin: 1,
      priceMax: 1,
      rewardApr: [1]
    },
    // month: ApiV3PoolInfoCountItem;
    month: {
      volume: 1,
      volumeQuote: 1,
      volumeFee: 1,
      apr: 1,
      feeApr: 1,
      priceMin: 1,
      priceMax: 1,
      rewardApr: [1]
    },
    // pooltype: PoolTypeItem[];
    pooltype : ["StablePool"],
  
    // farmUpcomingCount: number;
    // farmOngoingCount: number;
    // farmFinishedCount: number;
    farmUpcomingCount: 1,
    farmOngoingCount: 1,
    farmFinishedCount: 1,
  }

  let poolInfo2 = {
    programId:"CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C",
    id:"EwBdhByEJ2w9nZ8aHghYrtcZ3DZBEQrot5wAv6bxuZv",
    mintA:{
      chainId:101,
      address:"So11111111111111111111111111111111111111112",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png",
      symbol:"WSOL",
      name:"Wrapped SOL",
      decimals:9,
      tags:[],
      extensions:{}
    },
    mintB:{
      chainId:101,
      address:"HCLiq7LWktm6X7vPUyD2fFCQE5GSyW6DKCGPVkL4addr",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"https://img-v1.raydium.io/icon/HCLiq7LWktm6X7vPUyD2fFCQE5GSyW6DKCGPVkL4addr.png",
      symbol:"L2",
      name:"L2",
      decimals:6,
      tags:[],
      extensions:{}
    },
    openTime:"1721665399",
    vault:{
      A:"CUapjJ6AGW8pGRxpdhucU8WpdDLXvHPsfy7H8pDDug9n",
      B:"8YQMzpreDwaHCknU8rjFePPVxsTw9npKVwcBvyWQRLtg"
    },
    authority:"GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL",
    config:{
      id:"D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2",
      index:0,
      protocolFeeRate:120000,
      tradeFeeRate:2500,
      fundFeeRate:40000,
      createPoolFee:"150000000"
    },
    mintLp:{
      chainId:101,
      address:"BDjLBazjFbqRwiQWQz3zeZNzj2z9GDweNpDkn2Hjo6yZ",
      programId:"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      logoURI:"",
      symbol:"",
      name:"",
      decimals:9,
      tags:[],
      extensions:{}
    }
  }

  let poolInfo1 = {
    "programId":"CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C",
    "id":"EwBdhByEJ2w9nZ8aHghYrtcZ3DZBEQrot5wAv6bxuZv",
    "mintA":{
      "chainId":101,
      "address":"So11111111111111111111111111111111111111112",
      "programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "logoURI":"https://img-v1.raydium.io/icon/So11111111111111111111111111111111111111112.png",
      "symbol":"WSOL",
      "name":"Wrapped SOL",
      "decimals":9,
      "tags":[],
      "extensions":{}
    },
    "mintB":{
      "chainId":101,
      "address":"HCLiq7LWktm6X7vPUyD2fFCQE5GSyW6DKCGPVkL4addr",
      "programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "logoURI":"https://img-v1.raydium.io/icon/HCLiq7LWktm6X7vPUyD2fFCQE5GSyW6DKCGPVkL4addr.png",
      "symbol":"L2",
      "name":"L2",
      "decimals":6,
      "tags":[],
      "extensions":{}
    },
    "openTime":"1721665399",
    "vault":{
      "A":"CUapjJ6AGW8pGRxpdhucU8WpdDLXvHPsfy7H8pDDug9n",
      "B":"8YQMzpreDwaHCknU8rjFePPVxsTw9npKVwcBvyWQRLtg"
    },
    "authority":"GpMZbSM2GgvTKHJirzeGfMFoaZ8UR2X7F4v8vHTvxFbL",
    "config":{
      "id":"D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2",
      "index":0,
      "protocolFeeRate":120000,
      "tradeFeeRate":2500,
      "fundFeeRate":40000,
      "createPoolFee":"150000000"
    },
    "mintLp":{
      "chainId":101,
      "address":"BDjLBazjFbqRwiQWQz3zeZNzj2z9GDweNpDkn2Hjo6yZ",
      "programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "logoURI":"",
      "symbol":"",
      "name":"",
      "decimals":9,
      "tags":[],
      "extensions":{}
    }
  }

  // const uiInputAmount = '0.0001'
  const uiInputAmount = '1'
  const inputAmount = new BN(new Decimal(uiInputAmount).mul(10 ** poolInfo.mintA.decimals).toFixed(0))
  const slippage = new Percent(1, 100) // 1%
  const baseIn = true

  // computePairAmount is not necessary, addLiquidity will compute automatically,
  // just for ui display
  /*
  const computeRes = await raydium.cpmm.computePairAmount({
    poolInfo,
    amount: uiInputAmount,
    slippage,
    baseIn,
    epochInfo: await raydium.fetchEpochInfo()
  })

  computeRes.anotherAmount.amount -> pair amount needed to add liquidity
  computeRes.anotherAmount.fee -> token2022 transfer fee, might be undefined if isn't token2022 program
  */

  const { execute } = await raydium.cpmm.addLiquidity({
    poolInfo,
    inputAmount,
    slippage,
    baseIn,
    txVersion,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  })
  const { txId } = await execute()
  console.log('pool deposited', { txId })
}

/** uncomment code below to execute */
deposit()
