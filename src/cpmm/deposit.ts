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

  const uiInputAmount = '0.0001'
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
// deposit()
