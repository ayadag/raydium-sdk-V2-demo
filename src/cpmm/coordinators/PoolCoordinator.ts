// import { Movie } from '../models/Movie'
import bs58 from 'bs58';

import * as web3 from '@solana/web3.js';

// import {
//   Connection,
//   Keypair,
//   PublicKey,
// } from '@solana/web3.js';

// import { initSdk } from '../../config';

const owner: web3.Keypair = web3.Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
const connection = new web3.Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>

const programId = new web3.PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');
// const poolId = '9qVb7iFiAoTyFoEYM2ZSBULeHRvBYUhPkpswoESjyUZV';
const tokenProgram = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export class PoolCoordinator {
  static accounts: web3.PublicKey[] = []

    static async prefetchAccounts(connection: web3.Connection) {
    // const raydium = await initSdk();
    const config: web3.GetProgramAccountsConfig = {
        dataSlice: { offset: 0, length: 0 },
        filters: [
        {
          dataSize: 637  //637 byte(s)
        }
        ]
    }
    const accountInfos = await connection.getProgramAccounts(programId, config)
  
    this.accounts = accountInfos.map(accountInfo => accountInfo.pubkey)
    }

    //static async fetchPage(connection: web3.Connection, page: number, perPage: number): Promise<Movie[]> {
    static async fetchPage(connection: web3.Connection, page: number, perPage: number): Promise<any> {
        if (this.accounts.length === 0) {
            await this.prefetchAccounts(connection)
        }
        const accountsToFetch = this.accounts.slice((page-1)*perPage, page*perPage);
        const accountInfos = await connection.getMultipleAccountsInfo(accountsToFetch);
        const poolsWithNulls = accountInfos.reduce((accum: any[], account) => {
            const pool = account
        
            return [...accum, pool]
        }, []);
    }
}