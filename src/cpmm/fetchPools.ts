import bs58 from 'bs58';

import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';

const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
// const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>

const programId = new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');
// const poolId = '9qVb7iFiAoTyFoEYM2ZSBULeHRvBYUhPkpswoESjyUZV';
// const tokenProgram = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

async function getParsedProgramAccounts() {
    // const MY_WALLET_ADDRESS = "FriELggez2Dy3phZeHHAdpcoEXkKQVkv6tx3zDtCVP8T";
    const MY_WALLET_ADDRESS = owner.publicKey.toBase58;
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    const accounts = await connection.getParsedProgramAccounts(
    //   TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    programId,
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
      },
    )
}