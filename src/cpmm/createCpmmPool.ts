import BN from 'bn.js';

import { PublicKey } from '@solana/web3.js';

import {
  initSdk,
  txVersion,
} from '../config';

export const createPool = async () => {
  const raydium = await initSdk({ loadToken: true })

  // check token list here: https://api-v3.raydium.io/mint/list
  // RAY
  // const mintA = await raydium.token.getTokenInfo('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb')
  // USDC
  // const mintB = await raydium.token.getTokenInfo('So11111111111111111111111111111111111111112')

  /**
   * you also can provide mint info directly like below, then don't have to call token info api
   *  {
      address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
      decimals: 6,
    } 
   */
  const mintA = {
    address: 'So11111111111111111111111111111111111111112',
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    decimals: 9,
  } 
  const mintB = {
    address: 'Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb',
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    decimals: 9,
  } 

  // const token0 = new PublicKey('715ogP3WbNGSk5QanRTPq9eKXHbsUXaCCv3yrTqoCfR3');
  // const token0Program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  // const token1 = new PublicKey('974UHNCzEitqC39ituERbMR8EawL5pLZYFyfHXZUs33q');
  // const token1Program = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

  // const mintA = {
  //   address: '715ogP3WbNGSk5QanRTPq9eKXHbsUXaCCv3yrTqoCfR3',
  //   programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  //   decimals: 9,
  // } 
  // const mintB = {
  //   address: '974UHNCzEitqC39ituERbMR8EawL5pLZYFyfHXZUs33q',
  //   programId: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
  //   decimals: 9,
  // } 

  const { execute, extInfo } = await raydium.cpmm.createPool({
    // programId: CREATE_CPMM_POOL_PROGRAM, // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
    // poolFeeAccount: CREATE_CPMM_POOL_FEE_ACC, // devnet: CREATE_CPMM_POOL_FEE_ACC.CREATE_CPMM_POOL_PROGRAM
    // programId: new PublicKey('y14apbXKQPC257fK2r6mf6X1m6uYXtXjRyKmiU8rJJe'), // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
    // poolFeeAccount: new PublicKey('HGt6hRAEmpTdkTdMnshmcjZYN1JVRrhHPtVGbk4Br8Zx'),  // devnet HGt6hRAEmpTdkTdMnshmcjZYN1JVRrhHPtVGbk4Br8Zx
    programId: new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo'), // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
    // poolFeeAccount: new PublicKey('8niFqtDg5vk6ANcw8pQEq6MB8gKMqRsRy8gM41QkxJhQ'),  // devnet HGt6hRAEmpTdkTdMnshmcjZYN1JVRrhHPtVGbk4Br8Zx
    poolFeeAccount: new PublicKey('DWSb1UKCzFBAu9rNccuUqheEG46VdrLHNhBVGKA4xyqh'),  // devnet HxKiEkhNNcifMj3Jz22QbXcD7mNg3PCm1cNe3WYjYeR9

    
    // poolFeeAccount: new PublicKey('G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2'), // Ayad you shold change that!
    mintA,
    mintB,
    mintAAmount: new BN(1),
    // mintBAmount: new BN(1000),
    mintBAmount: new BN(10000),
    startTime: new BN(0),
    associatedOnly: false,
    ownerInfo: {
      // feePayer: owner.publicKey, //ayad
      useSOLBalance: true,
    },
    txVersion,
    // optional: set up priority fee here
    // computeBudgetConfig: {
    //   units: 600000,
    //   microLamports: 100000000,
    // },
  })

  const { txId } = await execute()
  console.log('pool created', {
    txId,
    poolKeys: Object.keys(extInfo.address).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: extInfo.address[cur as keyof typeof extInfo.address].toString(),
      }),
      {}
    ),
  })
}

/** uncomment code below to execute */
createPool();
