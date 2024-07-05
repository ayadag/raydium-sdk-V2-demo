import { createInitializeAccountInstruction } from '@solana/spl-token';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import {
  connection,
  fee4 as payer,
} from '../../config';

// const programId = payer.publicKey;
// const WSOLprogramId = new PublicKey('So11111111111111111111111111111111111111112');
const programId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
// const WSOLprogramId = programId
// const programId = WSOLprogramId;
// const programId = SystemProgram.programId;
const WSOL = new PublicKey('So11111111111111111111111111111111111111112');
const rentSysvar = new PublicKey('SysvarRent111111111111111111111111111111111');
const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');



const GREETING_SIZE = 165;

export async function establishPayer(): Promise<any> {
    let fees = 0;
    // if (!payer) {
      const {feeCalculator} = await connection.getRecentBlockhash();
  
      // Calculate the cost to fund the greeter account
      fees += await connection.getMinimumBalanceForRentExemption(GREETING_SIZE);
  
      // Calculate the cost of sending transactions
      fees += feeCalculator.lamportsPerSignature * 100; // wag
  
    //   payer = payer.publicKey;
    // }
  
    let lamports = await connection.getBalance(payer.publicKey);
    if (lamports < fees) {
      // If current balance is not enough to pay for fees, request an airdrop
      const sig = await connection.requestAirdrop(
        payer.publicKey,
        fees - lamports,
      );
      await connection.confirmTransaction(sig);
      lamports = await connection.getBalance(payer.publicKey);
    }
  
    console.log(
      'Using account',
      payer.publicKey.toBase58(),
      'containing',
      lamports / LAMPORTS_PER_SOL,
      'SOL to pay for fees',
    );

    return fees;
    // return lamports / LAMPORTS_PER_SOL;
  }

async function checkProgram(): Promise<void> {
    
  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
    // const GREETING_SEED = 'hello';
    const GREETING_SEED = 'hi';
    const greetedPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    // WSOLprogramId,
    tokenProgram,
    );

    // Check if the greeting account has already been created
  const greetedAccount = await connection.getAccountInfo(greetedPubkey);
  if (greetedAccount === null) {
    console.log(
      'Creating account',
      greetedPubkey.toBase58(),
      'to say hello to',
    );

    // const lamports = await connection.getMinimumBalanceForRentExemption(
    //   GREETING_SIZE,
    // );

    // const lamports = 0.0010093 * 1000000000; //0.0010092 SOL

    const lamports = await establishPayer();

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports,
        space: GREETING_SIZE,
        programId,
        // WSOLprogramId
      }),

      //Token Program: Initialize Account
      createInitializeAccountInstruction(greetedPubkey ,WSOL, payer.publicKey, programId),
    );
    await sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log('transaction: ',transaction)
  }
}
establishPayer();
checkProgram();
