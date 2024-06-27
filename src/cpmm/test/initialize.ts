import * as anchor from '@coral-xyz/anchor';
import {
  BN,
  Program,
} from '@coral-xyz/anchor';
import {
  getAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import {
  calculateFee,
  initialize,
  setupInitializeTest,
} from './utils';
import { RaydiumCpSwap } from './utils/types/raydium_cp_swap';

anchor.setProvider(anchor.AnchorProvider.env());
  const owner = anchor.Wallet.local().payer;
  console.log("owner: ", owner.publicKey.toString());

  const program = anchor.workspace.RaydiumCpSwap as Program<RaydiumCpSwap>;

  const confirmOptions = {
    skipPreflight: true,
  };

async function createPoolWithoutFee() {
    console.log('start createPoolWithoutFee()');
    const { configAddress, token0, token0Program, token1, token1Program } =
      await setupInitializeTest(
        program,
        anchor.getProvider().connection,
        owner,
        {
          config_index: 0,
          tradeFeeRate: new BN(10),
          protocolFeeRate: new BN(1000),
          fundFeeRate: new BN(25000),
          create_fee: new BN(0),
        },
        { transferFeeBasisPoints: 0, MaxFee: 0 },
        confirmOptions
    );

    if(token0 && token1 && token0Program && token1Program) {  //ayad
    const initAmount0 = new BN(10000000000);
    const initAmount1 = new BN(10000000000);
    const { poolAddress, poolState } = await initialize(
      program,
      owner,
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
        anchor.getProvider().connection,
        poolState.token0Vault,
        "processed",
        poolState.token0Program
      );
    //   assert.equal(vault0.amount.toString(), initAmount0.toString());
      console.log(vault0.amount.toString(), initAmount0.toString()); //ayad

      let vault1 = await getAccount(
        anchor.getProvider().connection,
        poolState.token1Vault,
        "processed",
        poolState.token1Program
      );
    //   assert.equal(vault1.amount.toString(), initAmount1.toString()); 
      console.log(vault1.amount.toString(), initAmount1.toString()); //ayad
    }
}

async function createPoolWithFee() {
    console.log('starting createPoolWithFee()') //ayad
    const { configAddress, token0, token0Program, token1, token1Program } =
      await setupInitializeTest(
        program,
        anchor.getProvider().connection,
        owner,
        {
          config_index: 1,
          tradeFeeRate: new BN(10),
          protocolFeeRate: new BN(1000),
          fundFeeRate: new BN(25000),
          create_fee: new BN(100000000),
        },
        { transferFeeBasisPoints: 0, MaxFee: 0 },
        confirmOptions
    );

    if(token0 && token1 && token0Program && token1Program) {  //ayad
        const initAmount0 = new BN(10000000000);
    const initAmount1 = new BN(10000000000);
    const { poolAddress, poolState } = await initialize(
      program,
      owner,
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
      anchor.getProvider().connection,
      poolState.token0Vault,
      "processed",
      poolState.token0Program
    );
    // assert.equal(vault0.amount.toString(), initAmount0.toString());
    console.log(vault0.amount.toString(), initAmount0.toString()) //ayad

    let vault1 = await getAccount(
      anchor.getProvider().connection,
      poolState.token1Vault,
      "processed",
      poolState.token1Program
    );
    // assert.equal(vault1.amount.toString(), initAmount1.toString());
    console.log(vault1.amount.toString(), initAmount1.toString()) //ayad

    }
}

async function createPoolWithToken2022MintHasTransferFee() {
    console.log('starting createPoolWithToken2022MintHasTransferFee()') //ayad
    const transferFeeConfig = { transferFeeBasisPoints: 100, MaxFee: 50000000 }; // %10
    const { configAddress, token0, token0Program, token1, token1Program } =
      await setupInitializeTest(
        program,
        anchor.getProvider().connection,
        owner,
        {
          config_index: 1,
          tradeFeeRate: new BN(10),
          protocolFeeRate: new BN(1000),
          fundFeeRate: new BN(25000),
          create_fee: new BN(100000000),
        },
        transferFeeConfig,
        confirmOptions
    );
    if(token0 && token1 && token0Program && token1Program) {  //ayad
        const initAmount0 = new BN(10000000000);
    const initAmount1 = new BN(10000000000);
    const { poolAddress, poolState } = await initialize(
      program,
      owner,
      configAddress,
      token0,
      token0Program,
      token1,
      token1Program,
      confirmOptions,
      { initAmount0, initAmount1 }
    );
    console.log('poolAddress: ',poolAddress) //ayad
    let vault0 = await getAccount(
      anchor.getProvider().connection,
      poolState.token0Vault,
      "processed",
      poolState.token0Program
    );
    if (token0Program == TOKEN_PROGRAM_ID) {
    //   assert.equal(vault0.amount.toString(), initAmount0.toString());
      console.log(vault0.amount.toString(), initAmount0.toString()) //ayad
    } else {
      const total =
        vault0.amount +
        calculateFee(
          transferFeeConfig,
          BigInt(initAmount0.toString()),
          poolState.token0Program
        );
    //   assert(new BN(total.toString()).gte(initAmount0));
      console.log(new BN(total.toString()).gte(initAmount0)) //ayad
    }

    let vault1 = await getAccount(
      anchor.getProvider().connection,
      poolState.token1Vault,
      "processed",
      poolState.token1Program
    );
    if (token1Program == TOKEN_PROGRAM_ID) {
    //   assert.equal(vault1.amount.toString(), initAmount1.toString());
    console.log(vault1.amount.toString(), initAmount1.toString()); //ayad
    } else {
      const total =
        vault1.amount +
        calculateFee(
          transferFeeConfig,
          BigInt(initAmount1.toString()),
          poolState.token1Program
        );
    //   assert(new BN(total.toString()).gte(initAmount1));
      console.log(new BN(total.toString()).gte(initAmount1)) //ayad
    }
    }
}

createPoolWithoutFee();
createPoolWithFee();
createPoolWithToken2022MintHasTransferFee();