import bs58 from 'bs58';

import {
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';

const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>

const programId = new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');
// const poolId = '9qVb7iFiAoTyFoEYM2ZSBULeHRvBYUhPkpswoESjyUZV';
const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

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

// getParsedProgramAccounts();
// getProgramAccounts1();
getProgramAccounts2();