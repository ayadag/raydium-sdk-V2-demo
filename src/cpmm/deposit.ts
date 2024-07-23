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
    
  }
  let poolInfo1 = {
    "programId":"675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    "id":"9LNQQnJ5tGbuetZkPaKB5NRSN4r2P2SuvyXm2owFkJC7",
    "mintA":{
      "chainId":101,
      "address":"B6DuEXoYuzqYTTscrGUGDCK1t9tGkH7Ud1yQq65AC6A8",
      "programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "logoURI":"",
      "symbol":"PSYHOBIDEN",
      "name":"PSYHOBIDEN",
      "decimals":8,
      "tags":["hasFreeze"],
      "extensions":{}
    },
    "mintB":{
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
    "openTime":"1721588958",
    "vault":{
      "A":"3njfibCyfAXFkDCswMTuvpigNQdx2ixK6E8Upu67DGbV",
      "B":"DvH1m4SoPV2opFqzfNGRsn1KB6ZKr4w3CZM3q8yaf2Fr"
    },
    "authority":"5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
    "openOrders":"5ceMD92omPto6LXH7TmFmHjA6epjXpwWGsGbXE7xvMuz",
    "targetOrders":"CWixj5gD2ov6QTMFDYVrKPMXtxaRcH5odcWZjkUSJSbh",
    "mintLp":{
      "chainId":101,
      "address":"2HpAYQ3qoeigL9TTJDqUcXFkGk5MfhEWPGTm9aVPc8ve",
      "programId":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "logoURI":"",
      "symbol":"",
      "name":"",
      "decimals":8,
      "tags":[],
      "extensions":{}
    },
    "marketProgramId":"srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
    "marketId":"E1jLcYg9HvhQuejyQmnBPsiUiYHDfthG8sDqSg7iLC9P",
    "marketAuthority":"7xpCwHsfaPzSgBk5YcVTyHdY9g1khZfqCtQQSV5fGpy2",
    "marketBaseVault":"FpcPokCsJWsY93ReGSmAPLraBWjy97jy5MdFWhEKLpN3",
    "marketQuoteVault":"8AMFVgxRa5W9DPpDDUVTGszUuZowEmv7m4qQ3ZymnfSx",
    "marketBids":"AyvJyhkfwgiqtmaGwiUvt52ngDVx91f36GwRhWyyahnh",
    "marketAsks":"E2vRcZr5sbHQf9qCLq3YqWDVnTonL1sZCJ3DY8xtEJ3i",
    "marketEventQueue":"AeV5AUg1C7zKnYSVq43WPi9g1mhPayeEB8XeFUSW5MMv"
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
