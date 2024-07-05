import {
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
const WSOLprogramId = new PublicKey('So11111111111111111111111111111111111111112');
const programId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const GREETING_SIZE = 165;

async function checkProgram(): Promise<void> {
    
  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
    const GREETING_SEED = 'hello';
    const greetedPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    WSOLprogramId,
    );

    // Check if the greeting account has already been created
  const greetedAccount = await connection.getAccountInfo(greetedPubkey);
  if (greetedAccount === null) {
    console.log(
      'Creating account',
      greetedPubkey.toBase58(),
      'to say hello to',
    );
    const lamports = await connection.getMinimumBalanceForRentExemption(
      GREETING_SIZE,
    );
    // const lamports = 0.0010093 * 1000000000; //0.0010092 SOL

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports,
        space: GREETING_SIZE,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [payer]);
  }
}

checkProgram();
