import bs58 from 'bs58';

import {
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';

import { initSdk } from '../config';
import { PoolCoordinator } from './coordinators/poolCoordinator';

const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>

const programId = new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');
// const poolId = '9qVb7iFiAoTyFoEYM2ZSBULeHRvBYUhPkpswoESjyUZV';
const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const fetchRpcPoolInfo = async (pool1: string) => {
  const raydium = await initSdk()
  // SOL-RAY
  // const pool1 = '4y81XN75NGct6iUYkBp2ixQKtXdrQxxMVgFbFF9w5n4u'
  // const pool1 = 'HMa1rFjBY35jW6KvpLJf79XFsThSj1ZJBp8KoVe8nHkB'

  const res = await raydium.cpmm.getRpcPoolInfos([pool1])

  const pool1Info = res[pool1]

  // console.log('pool id: ', pool1)
  // console.log('SOL-RAY pool price:', pool1Info.poolPrice)
  // // console.log('cpmm pool infos:', res)
  // console.log('SOL-SALD pool poolCreator:', `${pool1Info.poolCreator}`) //poolCreator:
  // console.log('pool1Info.mintA, pool1Info.mintB, pool1Info.mintLp :', 
  //   `${pool1Info.mintA}`, 
  //   `${pool1Info.mintB}`, 
  //   `${pool1Info.mintLp}`
  // )

  const poolInfo = {
    poolId: pool1,
    // programId: `${programId}`,
    programId: String(programId),  //Or
    poolCreator: `${pool1Info.poolCreator}`,
    configId: `${pool1Info.configId}`,
    mintA: `${pool1Info.mintA}`,
    mintProgramA: `${pool1Info.mintProgramA}`,
    vaultA: `${pool1Info.vaultA}`,
    mintB: `${pool1Info.mintB}`,
    mintProgramB: `${pool1Info.mintProgramB}`,
    vaultB: `${pool1Info.vaultB}`,
    bump: pool1Info.bump,
    status: pool1Info.status,
    lpAmount: Number(pool1Info.lpAmount),
    openTime: Number(pool1Info.openTime),
    poolPrice: pool1Info.poolPrice,
  }

  // console.log('poolInfo: ', poolInfo)
  return poolInfo
}

const fetchRpcPoolInfo2 = async (pool1: string) => {
  const raydium = await initSdk()
  // SOL-RAY
  // const pool1 = '4y81XN75NGct6iUYkBp2ixQKtXdrQxxMVgFbFF9w5n4u'
  // const pool1 = 'HMa1rFjBY35jW6KvpLJf79XFsThSj1ZJBp8KoVe8nHkB'

  const res = await raydium.cpmm.getCpmmPoolKeys(pool1)

//   const pool1Info = res[pool1]

//   console.log('SOL-RAY pool price:', pool1Info.poolPrice)
  console.log('cpmm pool infos:', res)
}

async function getParsedProgramAccounts() {
    // const MY_WALLET_ADDRESS = "FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T";
    const MY_WALLET_ADDRESS = owner.publicKey.toBase58;
    // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    const accounts = await connection.getParsedProgramAccounts(
    //   TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    // programId,
    tokenProgram,
      {
        filters: [
          {
            dataSize: 165, // number of bytes
          },
          {
            memcmp: {
              offset: 32, // number of bytes
            //   bytes: MY_WALLET_ADDRESS, // base58 encoded string
            bytes: `${owner.publicKey.toBase58}`,
            },
          },
        ],
      }
    );

    console.log('accounts: ',accounts)
}

//fetch all accounts (pools, configs ...)
async function getProgramAccounts1() {
  const accountsWithoutData = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 }
    }
  )
  
  const accountKeys = accountsWithoutData.map(account => account.pubkey);
  console.log('accountKeys: ', accountKeys)
}

//fetch pool accounts only (637 byte(s))
async function getProgramAccounts2() {
  const accountsWithoutData = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          dataSize: 637  //637 byte(s)
        }
      ]
    }
  )
  
  const accountKeys = accountsWithoutData.map(account => account.pubkey);
  console.log('accountKeys: ', accountKeys)
}

//fetch first 5 pool accounts info only (637 byte(s))
async function getProgramAccounts3() {
  const accountsWithoutData = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          dataSize: 637  //637 byte(s)
        }
      ]
    }
  )
  
  const accountKeys = accountsWithoutData.map(account => account.pubkey)
  // console.log('accountKeys: ', accountKeys)

  const paginatedKeys = accountKeys.slice(0, 5)  //slect only first 5 accounts
  const accountInfos = await connection.getMultipleAccountsInfo(paginatedKeys)
  const deserializedObjects = accountInfos.map((accountInfo) => {
  // put logic to deserialize accountInfo.data here
  // accountInfo.pubkey
  console.log('accountInfo?.data: ',accountInfo?.data)
  })
  console.log('deserializedObjects: ', deserializedObjects)
}

async function getProgramAccounts30() {
  console.log('`${owner.publicKey}`',`${owner.publicKey}`);
  const accountsWithoutData = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          dataSize: 637  //637 byte(s)
        },
        // {
        //   memcmp:
        //     {
        //       offset: 637,
        //       bytes: `${owner.publicKey}`,
        //     }
        // }
      ]
    }
  )
  
  const accountKeys = accountsWithoutData.map(account => account.pubkey);
  console.log('accountKeys: ', accountKeys)
}

//fetch first 4 pool accounts info only (637 byte(s))
async function getProgramAccounts4() {
  const raydium = await initSdk();
  const accountsWithoutData = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          dataSize: 637  //637 byte(s)
        }
      ]
    }
  )
  
  const accountKeys = accountsWithoutData.map(account => account.pubkey)
  // console.log('accountKeys: ', accountKeys)

  const paginatedKeys = accountKeys.slice(0, 4)  //slect only first 5 accounts
  
  paginatedKeys.forEach((progId) => {
    // const res = await raydium.cpmm.getRpcPoolInfos([`${progId}`])
    // const res = await raydium.cpmm.getRpcPoolInfos([`${progId}`])
    // const pool1Info = res[`${progId}`]

    // console.log('SOL-RAY pool price:', pool1Info.poolPrice)
    // console.log('cpmm pool infos:', res)
    fetchRpcPoolInfo(`${progId}`);
    // fetchRpcPoolInfo2(`${progId}`);  //cpmm pool infos: undefined
  })
}

async function getProgramAccounts5() {
  const pools = PoolCoordinator.fetchPage(connection, 1, 2)
  console.log('pools: ', pools)
}

//fetch with pages
async function getProgramAccounts6(connection: Connection, page: number, perPage: number) {
  const raydium = await initSdk();
  const accountsWithoutData = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          dataSize: 637  //637 byte(s)
        }
      ]
    }
  )
  
  const accountKeys = accountsWithoutData.map(account => account.pubkey)
  // console.log('accountKeys: ', accountKeys)

  const paginatedKeys = accountKeys.slice((page-1)*perPage, page*perPage)  //slect only first 5 accounts
  
  // paginatedKeys.forEach((progId) => {
  //   // const res = await raydium.cpmm.getRpcPoolInfos([`${progId}`])
  //   // const res = await raydium.cpmm.getRpcPoolInfos([`${progId}`])
  //   // const pool1Info = res[`${progId}`]

  //   // console.log('SOL-RAY pool price:', pool1Info.poolPrice)
  //   // console.log('cpmm pool infos:', res)
  //   fetchRpcPoolInfo(`${progId}`);
  //   // fetchRpcPoolInfo2(`${progId}`);  //cpmm pool infos: undefined
  // })
  return paginatedKeys
}

async function getProgramAccounts7() {
  const poolsM: any[] = [];
  const pools = await getProgramAccounts6(connection, 1, 2);  //page 1 with 2 items
  // console.log('pools: ', pools)
  // pools.map((pool) =>{
  //   fetchRpcPoolInfo(String(pool)).then(res => poolsM.push(res))
  // })

  for (let index = 0; index < pools.length; index++) {
    await fetchRpcPoolInfo(String(pools[index])).then(res => poolsM.push(res))
  }
  console.log('poolsM: ', poolsM)
}
// getParsedProgramAccounts();
// getProgramAccounts1();
// getProgramAccounts2();
// getProgramAccounts3();
// getProgramAccounts30();
// getProgramAccounts4();
// getProgramAccounts5();

getProgramAccounts7();