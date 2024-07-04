// import { assert } from 'chai';

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

// describe("deposit test", () => {
  // anchor.setProvider(anchor.AnchorProvider.env());
  // const owner = anchor.Wallet.local().payer;

  // const program = anchor.workspace.RaydiumCpSwap as Program<RaydiumCpSwap>;

  // const confirmOptions = {
  //   skipPreflight: true,
  // };

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
    skipPreflight: true,
}

async function setupDeposTest01(){
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
    );
    console.log('configAddress: ',configAddress)
}

async function setupDeposTest02(){
    const transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
        transferFeeBasisPoints: 0,
        MaxFee: 0,
    }
    const configAddress = new PublicKey('A2p4a3jJq3BoC5Bjgr3wPzvrCKBDjRMWbHZLDn9W98ed');
    const initAmount: { initAmount0: BN; initAmount1: BN } = {
        initAmount0: new BN(1000),
        initAmount1: new BN(2000),
    }
    const tokenProgramRequired 
    // ={
    //     // token0Program: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    //     // token1Program: new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'),
    //     // token0Program: undefined,
    //     // token1Program: undefined,
    // }
    =undefined;

    while(1){
          // const Keypairgen = await KeypairGen();
          const Keypairgen = keyPair;
        //   console.log('Keypairgen: ', Keypairgen);
        //   console.log('owner.payer: ',owner.payer)
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

        // const tokenProgramRequired = {token0Program, token1Program};

        console.log('token0, token0Program, token1, token1Program: ',token0, token0Program, token1, token1Program)

        /* if (tokenProgramRequired != undefined && token0 != undefined && token1 != undefined && token0Program != undefined && token1Program != undefined) {
            if (
              token0Program.equals(tokenProgramRequired.token0Program) &&
              token1Program.equals(tokenProgramRequired.token1Program)
            ) {
              
              //return await initialize2(
              const { poolAddress, poolState } = await initialize2(
                program,
                owner.payer,
                configAddress,
                token0,
                token0Program,
                token1,
                token1Program,
                confirmOptions,
                initAmount
              );
              // break;
              return { poolAddress, poolState };
              // break;
            }
        }

        else */ if (token0 != undefined && token1 != undefined && token0Program != undefined && token1Program != undefined) {
            //return await initialize2(
            const { poolAddress, poolState } = await initialize2(
              program,
              owner.payer,
              configAddress,
              token0,
              token0Program,
              token1,
              token1Program,
              confirmOptions,
              initAmount
            );
            console.log('{ poolAddress, poolState }: ',{ poolAddress, poolState })
            return { poolAddress, poolState };
        }
    }
    
}

// setupDeposTest01();
setupDeposTest02();