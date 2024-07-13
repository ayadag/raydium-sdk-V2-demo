import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { getTokenMetadata } from '@solana/spl-token';
import web3, {
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

async function Token(tokenId: string) {
  // const token = new web3.PublicKey('So11111111111111111111111111111111111111112'); //SOL
  // const token = new web3.PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb'); //SALD
  const token = new web3.PublicKey(tokenId); //SALD
  // const umi = createUmi('https://api.devnet.solana.com', 'processed')
  // Use the RPC endpoint of your choice.
  // const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())
  const umi = createUmi('https://api.devnet.solana.com')
  // umi.programs.bind('splToken', 'splToken2022');

  const mint = fromWeb3JsPublicKey(token);
  const asset = await fetchDigitalAsset(umi, mint) 
  // console.log('asset: ', asset);
  const tokenData = {
    publicKey: asset.publicKey,
    owner: asset.mint.header.owner,
    mintAuthority: asset.mint.mintAuthority,
    updateAuthority: asset.metadata.updateAuthority,
    name: asset.metadata.name,
    symbol: asset.metadata.symbol,
    uri: asset.metadata.uri,
    decimals: asset.mint.decimals,
    supply: asset.mint.supply,
    executable: asset.mint.header.executable,
  }
  console.log('tokenData: ', tokenData)
}

async function splToken(tokenId:string) {
  // Retrieve and log the metadata state
const metadata = await getTokenMetadata(
  solanaConnection, // Connection instance
  new PublicKey(tokenId), // PubKey of the Mint Account
  'confirmed', // Commitment, can use undefined to use default
  // TOKEN_2022_PROGRAM_ID, //spl-2022 token
  TOKEN_PROGRAM_ID, //spl toke
)
console.log('metadata: ', metadata)
}
async function spl2022Token(tokenId:string) {
  // Retrieve and log the metadata state
const metadata = await getTokenMetadata(
  solanaConnection, // Connection instance
  new PublicKey(tokenId), // PubKey of the Mint Account
  'confirmed', // Commitment, can use undefined to use default
  TOKEN_2022_PROGRAM_ID, //spl-2022 token
  // TOKEN_PROGRAM_ID, //spl toke
)
console.log('metadata: ', metadata)
}

async function grtTokenList() {

  // let tokens:any[];
  async function getTokenAccounts(wallet: string, solanaConnection: Connection, dataSize: number) {
    let tokens:any[];
    const filters:GetProgramAccountsFilter[] = [
      {
        dataSize: dataSize,    //size of account (bytes) spl-token=165 spl-2022-token=182
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
  // console.log(`Found ${accounts.length} spl token account(s) for wallet ${wallet}.`);
  // accounts.forEach((account, i) => {
  //     //Parse the account data
  //     const parsedAccountInfo:any = account.account.data;
  //     const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
  //     const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
  //     //Log results
  //     // console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
  //     // console.log(`--Token Mint: ${mintAddress}`);
  //     // console.log(`--Token Balance: ${tokenBalance}`);
  //     tokens.push(
  //       {
  //         address: account.pubkey.toString(),
  //         mint: mintAddress,
  //         balance: tokenBalance
  //       }
  //     )
  // });

  for (let index = 0; index < accounts.length; index++) {
    const parsedAccountInfo:any = accounts[index].account.data;
    const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    tokens[index]= (
      {
        address: accounts[index].pubkey.toString(),
        mint: mintAddress,
        balance: tokenBalance,
      }
    )
    // tokens[index] = (accounts[index]);
    
  }
  console.log(String(tokens));
  return tokens;
  }
  await getTokenAccounts('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb', solanaConnection, 165)
  console.log(String(tokens));
  
}


// console.log('<--spl tokens-->')
// getTokenAccounts(walletToQuery,solanaConnection);
// console.log('<--spl-2022 tokens-->')
// getTokenAccounts2(walletToQuery,solanaConnection);
// splToken('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb')//SALD address 6vgZNorE36XPYvpGYVYSwXvnQiWAJYCDkfeVHKvPrMeS mint Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb
// spl2022Token('jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX')//SALD mint Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb Aly mint jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX
grtTokenList();
