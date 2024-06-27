import {
  BN,
  Program,
} from '@coral-xyz/anchor';
import {
  clusterApiUrl,
  Connection,
} from '@solana/web3.js';

import { owner } from '../../config';
import { createAmmConfig } from './utils';
import {
  IDL,
  RaydiumCpSwap,
} from './utils/types/raydium_cp_swap';

type config = {
    config_index: number;
    tradeFeeRate: BN;
    protocolFeeRate: BN;
    fundFeeRate: BN;
    create_fee: BN;
}

const connection = new Connection(clusterApiUrl("devnet"));
const programId = 'y14apbXKQPC257fK2r6mf6X1m6uYXtXjRyKmiU8rJJe';
const program = new Program<RaydiumCpSwap>(IDL, programId, { connection });

const confirmOptions = {
    skipPreflight: true,
}

async function createAConfig0() {
    const config: config = {
        config_index: 0,
        tradeFeeRate: new BN(10),
        protocolFeeRate: new BN(1000),
        fundFeeRate: new BN(25000),
        create_fee: new BN(0),
    }
    const configAddress = await createAmmConfig(
        program,
        connection,
        owner,
        config.config_index,
        config.tradeFeeRate,
        config.protocolFeeRate,
        config.fundFeeRate,
        config.create_fee,
        confirmOptions
    );
    console.log('configAddress: ',configAddress)
}

async function createAConfig1() {
  const config: config = {
    config_index: 1,
    tradeFeeRate: new BN(10),
    protocolFeeRate: new BN(1000),
    fundFeeRate: new BN(25000),
    create_fee: new BN(100000000),
  }
  const configAddress = await createAmmConfig(
      program,
      connection,
      owner,
      config.config_index,
      config.tradeFeeRate,
      config.protocolFeeRate,
      config.fundFeeRate,
      config.create_fee,
      confirmOptions
  );
  console.log('configAddress: ',configAddress)
}

// createAConfig0();
createAConfig1();