import {
  AnchorProvider,
  BN,
  Program,
  setProvider,
} from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { getAccount } from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
} from '@solana/web3.js';

import {
  connection,
  keyPair,
  owner as own,
} from '../../config';
// import { initialize } from './utils';
import {
  createAmmConfig,
  createTokenMintAndAssociatedTokenAccount2,
  initialize2,
} from './utils';
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
    // skipPreflight: true,
    skipPreflight: false,
}
const configAddress = new PublicKey('A2p4a3jJq3BoC5Bjgr3wPzvrCKBDjRMWbHZLDn9W98ed');

// const token0 = new PublicKey('So11111111111111111111111111111111111111112');
// const token0Program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
// const token1 = new PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb');
// const token1Program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

// const token0 = new PublicKey('53wsF2iZN15evNGpKD8trfsJzT8nRju4Gyx57gLa8Nxe');
// const token0Program = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
// const token1 = new PublicKey('HrNCd4LeBoh4YfAkmwX24kvbD6EFo9asLG8WeiR72XHB');
// const token1Program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const token0 = new PublicKey('715ogP3WbNGSk5QanRTPq9eKXHbsUXaCCv3yrTqoCfR3');
const token0Program = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const token1 = new PublicKey('974UHNCzEitqC39ituERbMR8EawL5pLZYFyfHXZUs33q');
const token1Program = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

const initAmount: { initAmount0: BN; initAmount1: BN } = {
    initAmount0: new BN(10000000000),
    initAmount1: new BN(10000000000),
}

async function KeypairGen() {
  // const KeypairGen = new Keypair();
  const KeypairGen = Keypair.generate();
  console.log('KeypairGen: ', KeypairGen)
  return KeypairGen
}

async function preSetInit() {
  const transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
    transferFeeBasisPoints: 0,
    MaxFee: 0,
  }
  // const Keypairgen = await KeypairGen();
  const Keypairgen = keyPair;

  console.log('Keypairgen: ', Keypairgen);

  console.log('owner.payer: ',owner.payer)

  const [{ token0, token0Program }, { token1, token1Program }] =
      await createTokenMintAndAssociatedTokenAccount2(
        // connection,
        // anchor.getProvider().connection,
        provider.connection,
        // owner,
        owner.payer,
        // own,
        // new Keypair(),
        Keypairgen,
        transferFeeConfig
      );
  console.log('token0, token0Program, token1, token1Program: ',token0, token0Program, token1, token1Program)
}

async function preSetInit2() {
  const config = {
    config_index: 0,
    tradeFeeRate: new BN(10),
    protocolFeeRate: new BN(1000),
    fundFeeRate: new BN(25000),
    create_fee: new BN(0),
  }
  const configAddress = await createAmmConfig(
    program,
    provider.connection,
    owner.payer,
    config.config_index,
    config.tradeFeeRate,
    config.protocolFeeRate,
    config.fundFeeRate,
    config.create_fee,
    confirmOptions
  )
  console.log('configAddress: ',configAddress)
}

async function init2() {
  const initAmount0 = new BN(10000000000);
  const initAmount1 = new BN(10000000000);
  const { poolAddress, poolState } = await initialize2(
    program,
    owner.payer,
    configAddress,
    token0,
    token0Program,
    token1,
    token1Program,
    confirmOptions,
    { initAmount0, initAmount1 }
  );
  console.log('poolAddress: ',poolAddress)  //ayad
  let vault0 = await getAccount(
      // anchor.getProvider().connection,
      // connection,
      provider.connection,
      poolState.token0Vault,
      "processed",
      poolState.token0Program
    );
  //   assert.equal(vault0.amount.toString(), initAmount0.toString());
    console.log(vault0.amount.toString(), initAmount0.toString()); //ayad

    let vault1 = await getAccount(
      // anchor.getProvider().connection,
      // connection,
      provider.connection,
      poolState.token1Vault,
      "processed",
      poolState.token1Program
    );
  //   assert.equal(vault1.amount.toString(), initAmount1.toString()); 
    console.log(vault1.amount.toString(), initAmount1.toString()); //ayad

  // console.log('poolAddress: ',poolAddress);
  // console.log('poolState: ',poolState)
}


// async function setInit() {
//   const { configAddress, token0, token0Program, token1, token1Program } =
//       await setupInitializeTest2(
//         program,
//         // anchor.getProvider().connection,
//         connection,
//         owner,
//         {
//           config_index: 0,
//           tradeFeeRate: new BN(10),
//           protocolFeeRate: new BN(1000),
//           fundFeeRate: new BN(25000),
//           create_fee: new BN(0),
//         },
//         { transferFeeBasisPoints: 0, MaxFee: 0 },
//         confirmOptions
//   );
//   console.log('configAddress, token0, token0Program, token1, token1Program : ', configAddress, token0, token0Program, token1, token1Program)
// }

async function init() {
    const{ poolAddress, poolState } = await initialize2(
        program, 
        owner.payer, 
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

// KeypairGen();
// preSetInit();
// preSetInit2();
init2();
// setInit();
// init();