import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

// import { createTransferInstruction } from '@solana/spl-token';

const TOKEN_PROGRAM_ID = new PublicKey(
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);
const TOKEN_2022_PROGRAM_ID = new PublicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);
const walletPublicKey = new PublicKey('hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus'); // insert your key
const connection = new Connection('https://api.devnet.solana.com/', 'confirmed');

async function fetchTokens0() {
    const tokenAccounts = await connection.getTokenAccountsByOwner(
        walletPublicKey, { programId: TOKEN_PROGRAM_ID }
    );
    console.log('tokenAccounts.value[0].pubkey.toString: ', tokenAccounts.value[0].pubkey.toString())
    console.log('tokenAccounts.value[0].account.data.toString: ', tokenAccounts.value[0].account.data.toJSON())
    console.log('tokenAccounts.value[0].account.lamports: ', tokenAccounts.value[0].account.lamports)

    const token2022Accounts = await connection.getTokenAccountsByOwner(
        walletPublicKey, { programId: TOKEN_2022_PROGRAM_ID }
    ); 
    console.log('token2022Accounts: ', token2022Accounts)
}

// async function fetchTokens() {
//     const tokenAccounts = await connection.getTokenAccountsByOwner(
//         walletPublicKey, { programId: TOKEN_PROGRAM_ID }
//     );
//     const token2022Accounts = await connection.getTokenAccountsByOwner(
//         walletPublicKey, { programId: TOKEN_2022_PROGRAM_ID }
//     );
//     const accountsWithProgramId:any[] = [...tokenAccounts.value, ...token2022Accounts.value].map(
//         ({ account, pubkey }) =>
//           {
//             {account}
//             {pubkey}
//             {account.data.program === 'spl-token' ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID}
//           }
//     );
      
//       // later on...
//     const accountWithProgramId = accountsWithProgramId[0];
//     const instruction = createTransferInstruction(
//         accountWithProgramId.pubkey,    // source
//         accountWithProgramId.pubkey,    // destination
//         walletPublicKey,                // owner
//         1,                              // amount
//         [],                             // multisigners
//         accountWithProgramId.programId, // token program id
//     );
// }

fetchTokens0();