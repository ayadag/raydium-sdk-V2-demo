import bs58 from 'bs58';

import {
  parseTokenAccountResp,
  Raydium,
  TxVersion,
} from '@raydium-io/raydium-sdk-v2';
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
} from '@solana/web3.js';

// export const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from([179,3,16,89,75,94,147,146,107,142,137,163,66,234,236,82,65,183,254,245,47,110,215,216,72,127,119,46,215,249,199,241,11,212,37,99,137,5,243,10,5,224,219,17,144,108,64,250,90,25,98,185,74,111,2,81,54,174,65,121,23,185,59,201])) //adin3
export const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
export const keyPair: Keypair = Keypair.fromSecretKey(Uint8Array.from([
  179,   3,  16,  89,  75,  94, 147, 146, 107, 142, 137,
  163,  66, 234, 236,  82,  65, 183, 254, 245,  47, 110,
  215, 216,  72, 127, 119,  46, 215, 249, 199, 241,  11,
  212,  37,  99, 137,   5, 243,  10,   5, 224, 219,  17,
  144, 108,  64, 250,  90,  25,  98, 185,  74, 111,   2,
   81,  54, 174,  65, 121,  23, 185,  59, 201
])) //new Keypair()

export const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>
// export const connection = new Connection(clusterApiUrl('devnet')) //<YOUR_RPC_URL>
// export const connection = new Connection('https://boldest-necessary-telescope.solana-devnet.quiknode.pro/d84334700a69839dc8ef8f3f17f82dc0541ed9df/')//https://boldest-necessary-telescope.solana-devnet.quiknode.pro/d84334700a69839dc8ef8f3f17f82dc0541ed9df/
export const txVersion = TxVersion.V0 // or TxVersion.LEGACY

let raydium: Raydium | undefined
export const initSdk = async (params?: { loadToken?: boolean }) => {
  if (raydium) return raydium
  raydium = await Raydium.load({
    owner,
    connection,
    cluster: 'devnet', // 'mainnet' | 'devnet'
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: 'finalized',
    // urlConfigs: {
    //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
    // },
  })

  /**
   * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
   * if you want to handle token account by yourself, set token account data after init sdk
   * code below shows how to do it.
   * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
   */

  /*  
  raydium.account.updateTokenAccount(await fetchTokenAccountData())
  connection.onAccountChange(owner.publicKey, async () => {
    raydium!.account.updateTokenAccount(await fetchTokenAccountData())
  })
  */

  return raydium
}

export const fetchTokenAccountData = async () => {
  const solAccountResp = await connection.getAccountInfo(owner.publicKey)
  const tokenAccountResp = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_PROGRAM_ID })
  const token2022Req = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_2022_PROGRAM_ID })
  const tokenAccountData = parseTokenAccountResp({
    owner: owner.publicKey,
    solAccountResp,
    tokenAccountResp: {
      context: tokenAccountResp.context,
      value: [...tokenAccountResp.value, ...token2022Req.value],
    },
  })
  return tokenAccountData
}
