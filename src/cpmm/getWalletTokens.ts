// import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';

// const rpcEndpoint = 'https://example.solana-mainnet.quiknode.pro/000000/';
const rpcEndpoint = 'https://api.devnet.solana.com/';
const solanaConnection = new Connection(rpcEndpoint);

let TOKEN_PROGRAM_ID = new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);
let TOKEN_2022_PROGRAM_ID = new PublicKey(
    'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);
// TOKEN_PROGRAM_ID = TOKEN_2022_PROGRAM_ID;

// const walletToQuery = 'hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus'; //example: vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg
const walletToQuery = '7My9e9nVJZZ6yxN7u4dWfVjJrUhRGkkmaqU2cKYSqGRJ'; //7My9e9nVJZZ6yxN7u4dWfVjJrUhRGkkmaqU2cKYSqGRJ

// get spl-tokens
async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
    const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
        }];
    const accounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters}
    );
    console.log(`Found ${accounts.length} spl token account(s) for wallet ${wallet}.`);
    accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
        console.log(`--Token Mint: ${mintAddress}`);
        console.log(`--Token Balance: ${tokenBalance}`);
    });
}

//get spl-2022 tokens
async function getTokenAccounts2(wallet: string, solanaConnection: Connection) {
    const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 182,    //size of account (bytes) 182  for spl-2022 token
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
        }
    ];
    const accounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_2022_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters}
    );
    console.log(`Found ${accounts.length} spl-2022 token account(s) for wallet ${wallet}.`);
    accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
        console.log(`--Token Mint: ${mintAddress}`);
        console.log(`--Token Balance: ${tokenBalance}`);
    });
}

// console.log('<--spl tokens-->')
getTokenAccounts(walletToQuery,solanaConnection);
// console.log('<--spl-2022 tokens-->')
getTokenAccounts2(walletToQuery,solanaConnection);