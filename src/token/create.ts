import 'dotenv/config';

import bs58 from 'bs58';

import { addKeypairToEnvFile } from '@solana-developers/node-helpers';
import {
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  ExtensionType,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

// We establish a connection to the cluster
// const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
// const endPoint = JSON.parse(process.env.RPC? process.env.RPC : `https://api.devnet.solana.com/`)
const endPoint = process.env.RPC? process.env.RPC : `https://api.devnet.solana.com/`;
console.log('endPoint: ', endPoint)
const connection = new Connection(endPoint, 'confirmed')

// Next, we create and fund the payer account
// const payer = Keypair.generate();
// const PAYER = [
//   151, 250, 133, 160, 178, 197, 133, 103, 69, 122, 236, 210, 204, 163, 134, 138, 41, 3, 125, 57, 8, 168, 214, 17, 218,
//   120, 180, 227, 245, 234, 75, 72, 10, 76, 127, 170, 65, 248, 245, 58, 114, 27, 168, 242, 66, 37, 79, 216, 141, 207,
//   121, 134, 27, 72, 177, 85, 105, 137, 186, 168, 39, 146, 175, 38,
// ] //account11
// const payer = Keypair.fromSecretKey(
//   // new Uint8Array(JSON.parse(process.env.PAYER))
//   // Uint8Array.from(PAYER)
//   // new Uint8Array(JSON.parse(PAYER))
//   new Uint8Array(PAYER)
// )
// const PAYER = JSON.parse(process.env.PAYER? process.env.PAYER : `43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT`)
const PAYER = process.env.PAYER? process.env.PAYER : `43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT` 
const payer: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(PAYER)))
console.log('payer: ', payer.publicKey)
async function create() {
  console.log('Payer address:', payer.publicKey.toBase58())
  // await addKeypairToEnvFile(payer, 'PAYER');

  // const airdropSignature = await connection.requestAirdrop(
  //   payer.publicKey,
  //   LAMPORTS_PER_SOL
  // );

  // await connection.confirmTransaction({
  //   signature: airdropSignature,
  //   ...(await connection.getLatestBlockhash()),
  // });

  console.log('Payer Account Balance:', await connection.getBalance(payer.publicKey))

  // authority that can mint new tokens
  // const mintAuthority = Keypair.generate();
  // console.log('Mint Authority address:', mintAuthority.publicKey.toBase58());
  // await addKeypairToEnvFile(mintAuthority, 'MINT_AUTHORITY');
  // const mintAuthority = Keypair.fromSecretKey(new Uint8Array(PAYER))
  const mintAuthority = payer;
  // mint account, tokens come from here
  const mintKeypair = Keypair.generate()
  console.log('Mint address:', mintKeypair.publicKey.toBase58())
  await addKeypairToEnvFile(mintKeypair, 'MINT_KEYPAIR');
  console.log('mintKeypair: ', mintKeypair) //ayad
  const mint = mintKeypair.publicKey

  // authority that can modify the transfer fee
  // const transferFeeConfigAuthority = Keypair.generate();
  // await addKeypairToEnvFile(
  //   transferFeeConfigAuthority,
  //   'TRANSFER_FEE_CONFIG_AUTHORITY'
  // );
  // const transferFeeConfigAuthority = Keypair.fromSecretKey(new Uint8Array(PAYER))
  const transferFeeConfigAuthority = payer;
  console.log('Transfer Fee Config Authority address:', transferFeeConfigAuthority.publicKey.toBase58())

  // authority that can move tokens withheld on the mint or token accounts
  // const withdrawWithheldAuthority = Keypair.generate();
  // await addKeypairToEnvFile(
  //   withdrawWithheldAuthority,
  //   'WITHDRAW_WITHHELD_AUTHORITY'
  // );
  // const withdrawWithheldAuthority = Keypair.fromSecretKey(new Uint8Array(PAYER))
  const withdrawWithheldAuthority = payer;
  console.log('Withdraw Withheld Authority address:', withdrawWithheldAuthority.publicKey.toBase58())

  const decimals = 9
  // fee to collect on transfers in basis points, equivalent to 0.5%
  // Don't use ur brain, use https://www.omnicalculator.com/finance/basis-point
//   const feeBasisPoints = 50
  const feeBasisPoints = 500
// maximum fee to collect on transfers
//   const maxFee = BigInt(5_000)
  const maxFee = BigInt(50_000_000_000_000)
  const mintLen = getMintLen([ExtensionType.TransferFeeConfig])
  const mintLamports = await connection.getMinimumBalanceForRentExemption(mintLen)

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey, // account that will transfer lamports to created account
    newAccountPubkey: mint, // public key of the created account
    space: mintLen, // amount of bytes to allocate to the created account
    lamports: mintLamports, // amount of lamports to transfer to created account
    programId: TOKEN_2022_PROGRAM_ID, // public key of the program to assign as owner of created account
  })

  const initializeTransferFeeConfig = createInitializeTransferFeeConfigInstruction(
    mint, // token mint account
    transferFeeConfigAuthority.publicKey, // authority that can update fees
    withdrawWithheldAuthority.publicKey, // authority that can withdraw fees
    feeBasisPoints, // amount of transfer collected as fees
    maxFee, // maximum fee to collect on transfers
    TOKEN_2022_PROGRAM_ID // SPL token program id
  )

  const initializeMintInstruction = createInitializeMintInstruction(
    mint, // token mint
    decimals, // number of decimals
    mintAuthority.publicKey, // minting authority
    null, // optional authority that can freeze token accounts
    TOKEN_2022_PROGRAM_ID // SPL token program id
  )

  const mintTransaction = new Transaction().add(
    createAccountInstruction,
    initializeTransferFeeConfig,
    initializeMintInstruction
  )

  const mintTransactionSig = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mintKeypair],
    undefined
  )

  console.log('Token created!', `https://solana.fm/tx/${mintTransactionSig}?cluster=devnet-solana`)

  //ayad
  /*
  Payer address: j42hS9CvVecrMqA45tsHT3PzAj1zrCsQPZs72P1vcTF
  Payer Account Balance: 1000000000
  Mint Authority address: 13Mz89WY1YGapiX1MT2oNiPk5BeAuhefe9NATRX5ZhwV
  Mint address: CRVdwT6wNAQZnaJ23SsViMuFRALRkDu9yKMBzTesC5ez
  Transfer Fee Config Authority address: CjUN1Q6z6mdJdFD9zU7qm5DyoUPiXLazHzJem5fZzaGh
  Withdraw Withheld Authority address: GGrWneDg69gzDd9eA7LcGPXqBsuDwyD9bbawCBpRkYg2
  Token created! https://solana.fm/tx/56A9dAux9JDJYnB2kZJBgF9sBVenQVwPECjUU6F3G8FppDoX5g9LEKxwnuKTMoEdJ9ur72z9aszj3Vi3awfMqUWf?cluster=devnet-solana
  */

  /**
  Payer address: hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
  Payer Account Balance: 44682631259
  Mint address: GwgFHj6641WeNqcut5oSqDA9FZHhriDMEWvj1kD9KUd1
  mintKeypair:  Keypair {
    _keypair: {
      publicKey: Uint8Array(32) [
        236, 225,  11,  39, 207,  14, 199,  25,
        118, 213,  81,  30,  71,  43,  21,  11,
        245,  57, 221,  14, 247, 117,   1, 174,
         85,  77, 100, 147,  53, 173,  34, 132
      ],
      secretKey: Uint8Array(64) [
         45, 112,  12, 217,  77,  18,  43, 195, 180, 249,  30,
         16, 244, 196,  52, 133,  51, 244,  94,  78,   0, 184,
         53, 205,  34, 206, 128,  79, 242,  13, 230,  45, 236,
        225,  11,  39, 207,  14, 199,  25, 118, 213,  81,  30,
         71,  43,  21,  11, 245,  57, 221,  14, 247, 117,   1,
        174,  85,  77, 100, 147,  53, 173,  34, 132
      ]
    }
  }
  Transfer Fee Config Authority address: hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
  Withdraw Withheld Authority address: hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
  Token created! https://solana.fm/tx/2kakMLJJtCXMGGenihUB13ahpJi4Ma6JpNnLMH27kch4mKe5eQJGJn7nRiGHLoc2SCSVUr5cHUqucf5aDyVRYGTw?cluster=devnet-solana
   */
}

create();