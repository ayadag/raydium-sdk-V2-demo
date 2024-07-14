import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { getTokenMetadata } from '@solana/spl-token';
import web3, {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';

type token = {
  address: string,
  mint: string,
  owner: string,
  balance: number,
}

// const rpcEndpoint = 'https://example.solana-mainnet.quiknode.pro/000000/';
const rpcEndpoint = 'https://api.devnet.solana.com/';
const solanaConnection = new Connection(rpcEndpoint);
const walletKey = 'FR6qGWrrGAhtVNgUpiKyiwFEc62eoTJp3tjd67eBt2h6'; //hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus

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
  try{
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
  // console.log('tokenData: ', tokenData)
  return tokenData;
  } catch { return null }
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

class getTokenList {
  tokens: token[]= [];
  accounts: any[] = [];
  constructor(accounts: any[]){
    // const tokens:any[];
    this.accounts = accounts;
  }

//   async getTokenAccounts(wallet: string, solanaConnection: Connection, dataSize: number) {
    async getTokenAccounts() {
        // let tokens:any[];
    // const filters:GetProgramAccountsFilter[] = [
    //   {
    //     dataSize: dataSize,    //size of account (bytes) spl-token=165 spl-2022-token=182
    //   },
    //   {
    //     memcmp: {
    //       offset: 32,     //location of our query in the account (bytes)
    //       bytes: wallet,  //our search criteria, a base58 encoded string
    //     },            
    //   }];
    // const accounts = await solanaConnection.getParsedProgramAccounts(
    //   TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    //   {filters: filters}
    // );
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

  for (let index = 0; index < this.accounts.length; index++) {
    // this.accounts.forEach((account, i) => {
    const account = this.accounts[index] //for
    const parsedAccountInfo:any = account.account.data;
    const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    this.tokens.push(
      {
        address: String(account.pubkey.toString()),
        mint: String(mintAddress),
        owner: String(account.account.owner),
        balance: Number(tokenBalance),
      }
    )
    // tokens[index] = (accounts[index]);
    // console.log('${account.pubkey.toString()}: ', `${account.pubkey.toString()}`)
  }
//   )
  // console.log(this.tokens);
  return this.tokens;
  }
  // await getTokenAccounts('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb', solanaConnection, 165)
  // console.log(String(tokens));
  
}

async function get(wallet: string, solanaConnection: Connection, dataSize0: number, dataSize1: number) {
    const filters0:GetProgramAccountsFilter[] = [
        {
          dataSize: dataSize0,    //size of account (bytes) spl-token=165 spl-2022-token=182
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
    }];

    const filters1:GetProgramAccountsFilter[] = [
        {
          dataSize: dataSize1,    //size of account (bytes) spl-token=165 spl-2022-token=182
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
    }];

    const accounts0 = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters0}
    );
    // console.log('accounts0: ', accounts0)
    const accounts1 = await solanaConnection.getParsedProgramAccounts(
        TOKEN_2022_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters1}
    );

    const getTL0 = new getTokenList(accounts0);
    // const list = await getTL.getTokenAccounts('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb', solanaConnection, 165);
    const list0 = await getTL0.getTokenAccounts();

    const getTL1 = new getTokenList(accounts1);
    const list1 = await getTL1.getTokenAccounts();

    const totalList = [...list0,...list1];
    // console.log(totalList)
    return totalList
}



async function getTokensL() {
    let tokens: any[];
    async function get0(wallet: string, solanaConnection: Connection, dataSize: number) {
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
        return accounts
    }

    async function getT0(accounts: any[]) {
        for (let index = 0; index < accounts.length; index++) {
            // this.accounts.forEach((account, i) => {
            const account = accounts[index] //for
            const parsedAccountInfo:any = account.account.data;
            const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
            const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        
            tokens.push(
              {
                address: String(account.pubkey.toString()),
                mint: String(mintAddress),
                balance: Number(tokenBalance),
              }
            )
            // tokens[index] = (accounts[index]);
            console.log('${account.pubkey.toString()}: ', `${account.pubkey.toString()}`)
          }
        //   )
        //   console.log('tokens: ', tokens);
          return tokens;
    }

    const accounts = await get0('hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus', solanaConnection, 165); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
    const tokensL = await getT0(accounts);
    console.log(tokensL);
    // return tokensL
}

async function metadata(tokenId:string, programId:string) {
    // Retrieve and log the metadata state
  const metadata = await getTokenMetadata(
    solanaConnection, // Connection instance
    new PublicKey(tokenId), // PubKey of the Mint Account
    'confirmed', // Commitment, can use undefined to use default
    // TOKEN_2022_PROGRAM_ID, //spl-2022 token
    // TOKEN_PROGRAM_ID, //spl toke
    new PublicKey(programId),
  )
  // console.log('metadata: ', metadata)
  return metadata;
}

class geturi {
    tList: any[] = [];
    meta: any;
    // async tLF(){
    //     return await get('hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus', solanaConnection, 165, 182); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
    // }
    // totalList = await get('hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus', solanaConnection, 165, 182); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
    // totalList = await this.tLF();
    async getU0() {
        const totalList = await get('hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus', solanaConnection, 165, 182); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus

        for (let index = 0; index < totalList.length; index++) {
          const meta0: any = await metadata(totalList[index].mint, totalList[index].owner);
          const meta1: any = await Token(totalList[index].mint);
          const meta3 = {
            name: '',
            symbol: '',
            uri: '',
          }
          let meta: any = meta0 != null? meta0: meta1 != null? meta1: meta3
            // this.tList.push(totalList[index], await Token(totalList[index].mint));     
            // this.tList.push(totalList[index], await metadata(totalList[index].mint, totalList[index].owner));
            this.tList.push({
              address: totalList[index].address, 
              mint: totalList[index].mint, 
              owner: totalList[index].owner, 
              balance: totalList[index].balance, 
              name: String(meta.name) || '',
              symbol: String(meta.symbol) || '',
              uri: String(meta.uri) || '',
            });
        }
        return this.tList;
    }

    // const TList = await getU0();
    // console.log(TList);
}
async function getUri() {
    const gU = new geturi();
    const tL = await gU.getU0();
    console.log(tL)
}

async function test() {
  const totalList = await get('hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus', solanaConnection, 165, 182); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
  for (let index = 0; index < totalList.length; index++) {
    const meta0: any = await metadata(totalList[index].mint, totalList[index].owner);
          // const meta1: any = await Token(totalList[index].mint);
    let meta: any = meta0!= null? meta0: await Token(totalList[index].mint)
    console.log(`meta.uri(${index}) :${meta.uri}`)
  }
}

class getTokensList {
  tokens: token[]= [];
  accounts: any[] = [];
  tList: any[] = [];
  meta: any;

  // constructor(accounts: any[]){
  //   // const tokens:any[];
  //   this.accounts = accounts;
  // }

  async getTokenAccounts() {
    for (let index = 0; index < this.accounts.length; index++) {
    // this.accounts.forEach((account, i) => {
    const account = this.accounts[index] //for
    const parsedAccountInfo:any = account.account.data;
    const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

    this.tokens.push(
    {
      address: String(account.pubkey.toString()),
      mint: String(mintAddress),
      owner: String(account.account.owner),
      balance: Number(tokenBalance),
    }
    )
    // tokens[index] = (accounts[index]);
    // console.log('${account.pubkey.toString()}: ', `${account.pubkey.toString()}`)
    }
    //   )
    // console.log(this.tokens);
    return this.tokens;
  }

  

  async metadata0(tokenId: string) {
    // const token = new web3.PublicKey('So11111111111111111111111111111111111111112'); //SOL
    // const token = new web3.PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb'); //SALD
    const token = new web3.PublicKey(tokenId); //SALD
    // const umi = createUmi('https://api.devnet.solana.com', 'processed')
    // Use the RPC endpoint of your choice.
    // const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())
    const umi = createUmi('https://api.devnet.solana.com')
    // umi.programs.bind('splToken', 'splToken2022');
  
    const mint = fromWeb3JsPublicKey(token);
    try{
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
    // console.log('tokenData: ', tokenData)
    return tokenData;
    } catch { return null }
  }

  async  metadata1(tokenId:string, programId:string) {
    // Retrieve and log the metadata state
    const metadata = await getTokenMetadata(
      solanaConnection, // Connection instance
      new PublicKey(tokenId), // PubKey of the Mint Account
      'confirmed', // Commitment, can use undefined to use default
      // TOKEN_2022_PROGRAM_ID, //spl-2022 token
      // TOKEN_PROGRAM_ID, //spl toke
      new PublicKey(programId),
    )
    // console.log('metadata: ', metadata)
    return metadata;
  }

  async get(wallet: string, solanaConnection: Connection, dataSize0: number, dataSize1: number) {
    const filters0:GetProgramAccountsFilter[] = [
        {
          dataSize: dataSize0,    //size of account (bytes) spl-token=165 spl-2022-token=182
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
    }];

    const filters1:GetProgramAccountsFilter[] = [
        {
          dataSize: dataSize1,    //size of account (bytes) spl-token=165 spl-2022-token=182
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: wallet,  //our search criteria, a base58 encoded string
          },            
    }];

    const accounts0 = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters0}
    );
    // console.log('accounts0: ', accounts0)
    const accounts1 = await solanaConnection.getParsedProgramAccounts(
        TOKEN_2022_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters1}
    );

    // const getTL0 = new getTokenList(accounts0);
    // const list = await getTL.getTokenAccounts('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb', solanaConnection, 165);
    this.accounts = accounts0;
    const list0 = await this.getTokenAccounts();

    // const getTL1 = new getTokenList(accounts1);
    this.accounts = accounts1;
    const list1 = await this.getTokenAccounts();

    const totalList = [...list0,...list1];
    // console.log(totalList)
    return totalList
  }

  async getU0() {
    const totalList = await this.get(walletKey, solanaConnection, 165, 182); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus

    for (let index = 0; index < totalList.length; index++) {
      const meta0: any = await this.metadata1(totalList[index].mint, totalList[index].owner);
      const meta1: any = await this.metadata0(totalList[index].mint);
      const meta3 = {
        name: '',
        symbol: '',
        uri: '',
      }
      let meta: any = meta0 != null? meta0: meta1 != null? meta1: meta3
        // this.tList.push(totalList[index], await Token(totalList[index].mint));     
        // this.tList.push(totalList[index], await metadata(totalList[index].mint, totalList[index].owner));
        this.tList.push({
          address: totalList[index].address, 
          mint: totalList[index].mint, 
          owner: totalList[index].owner, 
          balance: totalList[index].balance, 
          name: String(meta.name) || '',
          symbol: String(meta.symbol) || '',
          uri: String(meta.uri) || '',
        });
    }
    return this.tList;
  }

  async getUri() {
    // const gU = new geturi();
    const tL = await this.getU0();
    // console.log(tL)
    return tL;
  }
}

async function mData() {
  const mData = new getTokensList;
  const data= await mData.getUri();
  console.log(data)
}

// console.log('<--spl tokens-->')
// getTokenAccounts(walletToQuery,solanaConnection);
// console.log('<--spl-2022 tokens-->')
// getTokenAccounts2(walletToQuery,solanaConnection);
// splToken('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb')//SALD address 6vgZNorE36XPYvpGYVYSwXvnQiWAJYCDkfeVHKvPrMeS mint Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb
// spl2022Token('jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX')//SALD mint Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb Aly mint jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX
// get('hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus', solanaConnection, 165, 182); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
// getTokensL();
// Token('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb');
// Token('jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX');
// getUri();
// test();
// metadata('D9DdQmL4ddany7CUby41QN4mPrLPBcAmwrmsHa7HfZvM', 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
// Token('D9DdQmL4ddany7CUby41QN4mPrLPBcAmwrmsHa7HfZvM');
// metadata('jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
// Token('jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX');
mData();

