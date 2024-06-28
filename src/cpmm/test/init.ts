import {
  AnchorProvider,
  BN,
  Program,
  setProvider,
} from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { PublicKey } from '@solana/web3.js';

import {
  connection,
  owner as own,
} from '../../config';
// import { initialize } from './utils';
import { initialize2 } from './utils';
import {
  IDL,
  RaydiumCpSwap,
} from './utils/types/raydium_cp_swap';

// const owner = own;
// const connection = new Connection(clusterApiUrl("devnet"));
// const programId = 'y14apbXKQPC257fK2r6mf6X1m6uYXtXjRyKmiU8rJJe';
// const program = new Program<RaydiumCpSwap>(IDL, programId, { connection });

//ayad
// const wallet = new NodeWallet(owner);
const wallet = new NodeWallet(own);
const owner =wallet;
const provider = new AnchorProvider(connection, wallet, {
    commitment: "processed",
});
setProvider(provider);
const program = new Program<RaydiumCpSwap>(
    IDL,
    new PublicKey("y14apbXKQPC257fK2r6mf6X1m6uYXtXjRyKmiU8rJJe"),
    provider,
);


const confirmOptions = {
    skipPreflight: true,
}
const configAddress = new PublicKey('A2p4a3jJq3BoC5Bjgr3wPzvrCKBDjRMWbHZLDn9W98ed');

const token0 = new PublicKey('So11111111111111111111111111111111111111112');
const token0Program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const token1 = new PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb');
const token1Program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const initAmount: { initAmount0: BN; initAmount1: BN } = {
    initAmount0: new BN(1),
    initAmount1: new BN(2),
}

async function init() {
    const{ poolAddress, poolState } = await initialize2(
        program, 
        owner, 
        configAddress, 
        token0, 
        token0Program, 
        token1, 
        token1Program, 
        confirmOptions,
        initAmount,
    );
    console.log('poolAddress: ',poolAddress);
    console.log('poolState: ',poolState)
}

init();