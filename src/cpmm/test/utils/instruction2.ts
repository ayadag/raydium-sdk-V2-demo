import {
  BN,
  Program,
} from '@coral-xyz/anchor';
import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  ConfirmOptions,
  Connection,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

import {
  accountExist,
  createTokenMintAndAssociatedTokenAccount,
  getAmmConfigAddress,
  getAuthAddress,
  getOrcleAccountAddress,
  getPoolAddress,
  getPoolLpMintAddress,
  getPoolVaultAddress,
  sendTransaction,
} from './index';
import { RaydiumCpSwap } from './types/raydium_cp_swap';

export async function setupInitializeTest2(
    program: Program<RaydiumCpSwap>,
    connection: Connection,
    owner: any,
    config: {
      config_index: number;
      tradeFeeRate: BN;
      protocolFeeRate: BN;
      fundFeeRate: BN;
      create_fee: BN;
    },
    transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
      transferFeeBasisPoints: 0,
      MaxFee: 0,
    },
    confirmOptions?: ConfirmOptions
  ) {
    const [{ token0, token0Program }, { token1, token1Program }] =
      await createTokenMintAndAssociatedTokenAccount(
        connection,
        owner,
        new Keypair(),
        transferFeeConfig
      );
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
    return {
      configAddress,
      token0,
      token0Program,
      token1,
      token1Program,
    };
  }
  
  export async function setupDepositTest2(
    program: Program<RaydiumCpSwap>,
    connection: Connection,
    owner: Signer,
    config: {
      config_index: number;
      tradeFeeRate: BN;
      protocolFeeRate: BN;
      fundFeeRate: BN;
      create_fee: BN;
    },
    transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
      transferFeeBasisPoints: 0,
      MaxFee: 0,
    },
    confirmOptions?: ConfirmOptions,
    initAmount: { initAmount0: BN; initAmount1: BN } = {
      initAmount0: new BN(10000000000),
      initAmount1: new BN(20000000000),
    },
    tokenProgramRequired?: {
      token0Program: PublicKey;
      token1Program: PublicKey;
    }
  ) {
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
  
    // let { poolAddress, poolState } = {'poolAddress':0,'poolState':0};
    // while (1) {
      const [{ token0, token0Program }, { token1, token1Program }] =
        await createTokenMintAndAssociatedTokenAccount(
          connection,
          owner,
          new Keypair(),
          transferFeeConfig
        );
  
      if (tokenProgramRequired != undefined && token0 != undefined && token1 != undefined && token0Program != undefined && token1Program != undefined) {
        if (
          token0Program.equals(tokenProgramRequired.token0Program) &&
          token1Program.equals(tokenProgramRequired.token1Program)
        ) {
          
          //return await initialize2(
          const { poolAddress, poolState } = await initialize2(
            program,
            owner,
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
      } else if (token0 != undefined && token1 != undefined && token0Program != undefined && token1Program != undefined) {
        //return await initialize2(
        const { poolAddress, poolState } = await initialize2(
          program,
          owner,
          configAddress,
          token0,
          token0Program,
          token1,
          token1Program,
          confirmOptions,
          initAmount
        );
        return { poolAddress, poolState };
      } else {
        let { poolAddress, poolState } = {'poolAddress': 0,'poolState':0};
        return { poolAddress, poolState }
      }
      // return { poolAddress, poolState };
      // break; //ayad
    // }
    // return { poolAddress, poolState };
  }
  
  export async function setupSwapTest(
    program: Program<RaydiumCpSwap>,
    connection: Connection,
    owner: Signer,
    config: {
      config_index: number;
      tradeFeeRate: BN;
      protocolFeeRate: BN;
      fundFeeRate: BN;
      create_fee: BN;
    },
    transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
      transferFeeBasisPoints: 0,
      MaxFee: 0,
    },
    confirmOptions?: ConfirmOptions
  ) {
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
  
    const [{ token0, token0Program }, { token1, token1Program }] =
      await createTokenMintAndAssociatedTokenAccount(
        connection,
        owner,
        new Keypair(),
        transferFeeConfig
      );
  
      //////////ayad
    if(token0 != undefined && token1 != undefined && token0Program != undefined && token1Program != undefined){
  
    const { poolAddress, poolState } = await initialize2(
      program,
      owner,
      configAddress,
      token0,
      token0Program,
      token1,
      token1Program,
      confirmOptions
    );
    // let { poolAddress, poolState } = await initialize(
    //   program,
    //   owner,
    //   configAddress,
    //   token0,
    //   token0Program,
    //   token1,
    //   token1Program,
    //   confirmOptions
    // );
  
    await deposit(
      program,
      owner,
      poolState.ammConfig,
      poolState.token0Mint,
      poolState.token0Program,
      poolState.token1Mint,
      poolState.token1Program,
      new BN(10000000000),
      new BN(100000000000),
      new BN(100000000000),
      confirmOptions
    );
    return { configAddress, poolAddress, poolState };
    }
  }
  
  export async function createAmmConfig(
    program: Program<RaydiumCpSwap>,
    connection: Connection,
    owner: Signer,
    config_index: number,
    tradeFeeRate: BN,
    protocolFeeRate: BN,
    fundFeeRate: BN,
    create_fee: BN,
    confirmOptions?: ConfirmOptions
  ): Promise<PublicKey> {
    const [address, _] = await getAmmConfigAddress(
      config_index,
      program.programId
    );
    if (await accountExist(connection, address)) {
      return address;
    }
  
    const ix = await program.methods
      .createAmmConfig(
        config_index,
        tradeFeeRate,
        protocolFeeRate,
        fundFeeRate,
        create_fee
      )
      .accounts({
        owner: owner.publicKey,
        ammConfig: address,
        systemProgram: SystemProgram.programId,
      })
      .instruction();
  
    const tx = await sendTransaction(connection, [ix], [owner], confirmOptions);
    console.log("init amm config tx: ", tx);
    return address;
  }
  
  export async function initialize2(
    program: Program<RaydiumCpSwap>,
    creator: Signer,
    configAddress: PublicKey,
    token0: PublicKey,
    token0Program: PublicKey,
    token1: PublicKey,
    token1Program: PublicKey,
    confirmOptions?: ConfirmOptions,
    initAmount: { initAmount0: BN; initAmount1: BN } = {
      initAmount0: new BN(1),
      initAmount1: new BN(2),
    },
    // createPoolFee = new PublicKey("G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2")  //devnet fee account
    // createPoolFee = new PublicKey("HxKiEkhNNcifMj3Jz22QbXcD7mNg3PCm1cNe3WYjYeR9")  //devnet fee account
    createPoolFee = new PublicKey("DWSb1UKCzFBAu9rNccuUqheEG46VdrLHNhBVGKA4xyqh")//DWSb1UKCzFBAu9rNccuUqheEG46VdrLHNhBVGKA4xyqh
    
  ) {
    const [auth] = await getAuthAddress(program.programId);
    const [poolAddress] = await getPoolAddress(
      configAddress,
      token0,
      token1,
      program.programId
    );
    const [lpMintAddress] = await getPoolLpMintAddress(
      poolAddress,
      program.programId
    );
    const [vault0] = await getPoolVaultAddress(
      poolAddress,
      token0,
      program.programId
    );
    const [vault1] = await getPoolVaultAddress(
      poolAddress,
      token1,
      program.programId
    );
    const [creatorLpTokenAddress] = await PublicKey.findProgramAddress(
      [
        creator.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        lpMintAddress.toBuffer(),
      ],
      ASSOCIATED_PROGRAM_ID
    );

    // console.log('creatorLpTokenAddress: ',creatorLpTokenAddress);
    // console.log('ASSOCIATED_PROGRAM_ID: ',ASSOCIATED_PROGRAM_ID)
  
    const [observationAddress] = await getOrcleAccountAddress(
      poolAddress,
      program.programId
    );
  
    const creatorToken0 = getAssociatedTokenAddressSync(
      token0,
      creator.publicKey,
      false,
      token0Program
    );
    const creatorToken1 = getAssociatedTokenAddressSync(
      token1,
      creator.publicKey,
      false,
      token1Program
    );
    // const poolState = await program.account.poolState.fetch(poolAddress);
    await program.methods
      .initialize(initAmount.initAmount0, initAmount.initAmount1, new BN(0))
      .accounts({
        creator: creator.publicKey,
        ammConfig: configAddress,
        authority: auth,
        poolState: poolAddress,
        // poolState: poolState,
        token0Mint: token0,
        token1Mint: token1,
        lpMint: lpMintAddress,
        creatorToken0,
        creatorToken1,
        creatorLpToken: creatorLpTokenAddress,
        token0Vault: vault0,
        token1Vault: vault1,
        createPoolFee,
        observationState: observationAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        token0Program: token0Program,
        token1Program: token1Program,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc(confirmOptions);
      
    const poolState = await program.account.poolState.fetch(poolAddress);
    return { poolAddress, poolState };
  }
  
  export async function deposit(
    program: Program<RaydiumCpSwap>,
    owner: Signer,
    configAddress: PublicKey,
    token0: PublicKey,
    token0Program: PublicKey,
    token1: PublicKey,
    token1Program: PublicKey,
    lp_token_amount: BN,
    maximum_token_0_amount: BN,
    maximum_token_1_amount: BN,
    confirmOptions?: ConfirmOptions
  ) {
    const [auth] = await getAuthAddress(program.programId);
    const [poolAddress] = await getPoolAddress(
      configAddress,
      token0,
      token1,
      program.programId
    );
  
    const [lpMintAddress] = await getPoolLpMintAddress(
      poolAddress,
      program.programId
    );
    const [vault0] = await getPoolVaultAddress(
      poolAddress,
      token0,
      program.programId
    );
    const [vault1] = await getPoolVaultAddress(
      poolAddress,
      token1,
      program.programId
    );
    const [ownerLpToken] = await PublicKey.findProgramAddress(
      [
        owner.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        lpMintAddress.toBuffer(),
      ],
      ASSOCIATED_PROGRAM_ID
    );
  
    const onwerToken0 = getAssociatedTokenAddressSync(
      token0,
      owner.publicKey,
      false,
      token0Program
    );
    const onwerToken1 = getAssociatedTokenAddressSync(
      token1,
      owner.publicKey,
      false,
      token1Program
    );
  
    const tx = await program.methods
      .deposit(lp_token_amount, maximum_token_0_amount, maximum_token_1_amount)
      .accounts({
        owner: owner.publicKey,
        authority: auth,
        poolState: poolAddress,
        ownerLpToken,
        token0Account: onwerToken0,
        token1Account: onwerToken1,
        token0Vault: vault0,
        token1Vault: vault1,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenProgram2022: TOKEN_2022_PROGRAM_ID,
        vault0Mint: token0,
        vault1Mint: token1,
        lpMint: lpMintAddress,
      })
      .rpc(confirmOptions);
    return tx;
  }
  
  export async function withdraw(
    program: Program<RaydiumCpSwap>,
    owner: Signer,
    configAddress: PublicKey,
    token0: PublicKey,
    token0Program: PublicKey,
    token1: PublicKey,
    token1Program: PublicKey,
    lp_token_amount: BN,
    minimum_token_0_amount: BN,
    minimum_token_1_amount: BN,
    confirmOptions?: ConfirmOptions
  ) {
    const [auth] = await getAuthAddress(program.programId);
    const [poolAddress] = await getPoolAddress(
      configAddress,
      token0,
      token1,
      program.programId
    );
  
    const [lpMintAddress] = await getPoolLpMintAddress(
      poolAddress,
      program.programId
    );
    const [vault0] = await getPoolVaultAddress(
      poolAddress,
      token0,
      program.programId
    );
    const [vault1] = await getPoolVaultAddress(
      poolAddress,
      token1,
      program.programId
    );
    const [ownerLpToken] = await PublicKey.findProgramAddress(
      [
        owner.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        lpMintAddress.toBuffer(),
      ],
      ASSOCIATED_PROGRAM_ID
    );
  
    const onwerToken0 = getAssociatedTokenAddressSync(
      token0,
      owner.publicKey,
      false,
      token0Program
    );
    const onwerToken1 = getAssociatedTokenAddressSync(
      token1,
      owner.publicKey,
      false,
      token1Program
    );
  
    const tx = await program.methods
      .withdraw(lp_token_amount, minimum_token_0_amount, minimum_token_1_amount)
      .accounts({
        owner: owner.publicKey,
        authority: auth,
        poolState: poolAddress,
        ownerLpToken,
        token0Account: onwerToken0,
        token1Account: onwerToken1,
        token0Vault: vault0,
        token1Vault: vault1,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenProgram2022: TOKEN_2022_PROGRAM_ID,
        vault0Mint: token0,
        vault1Mint: token1,
        lpMint: lpMintAddress,
        memoProgram: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      })
      .rpc(confirmOptions)
      .catch();
  
    return tx;
  }
  
  export async function swap_base_input(
    program: Program<RaydiumCpSwap>,
    owner: Signer,
    configAddress: PublicKey,
    inputToken: PublicKey,
    inputTokenProgram: PublicKey,
    outputToken: PublicKey,
    outputTokenProgram: PublicKey,
    amount_in: BN,
    minimum_amount_out: BN,
    confirmOptions?: ConfirmOptions
  ) {
    const [auth] = await getAuthAddress(program.programId);
    const [poolAddress] = await getPoolAddress(
      configAddress,
      inputToken,
      outputToken,
      program.programId
    );
  
    const [inputVault] = await getPoolVaultAddress(
      poolAddress,
      inputToken,
      program.programId
    );
    const [outputVault] = await getPoolVaultAddress(
      poolAddress,
      outputToken,
      program.programId
    );
  
    const inputTokenAccount = getAssociatedTokenAddressSync(
      inputToken,
      owner.publicKey,
      false,
      inputTokenProgram
    );
    const outputTokenAccount = getAssociatedTokenAddressSync(
      outputToken,
      owner.publicKey,
      false,
      outputTokenProgram
    );
    const [observationAddress] = await getOrcleAccountAddress(
      poolAddress,
      program.programId
    );
  
    const tx = await program.methods
      .swapBaseInput(amount_in, minimum_amount_out)
      .accounts({
        payer: owner.publicKey,
        authority: auth,
        ammConfig: configAddress,
        poolState: poolAddress,
        inputTokenAccount,
        outputTokenAccount,
        inputVault,
        outputVault,
        inputTokenProgram: inputTokenProgram,
        outputTokenProgram: outputTokenProgram,
        inputTokenMint: inputToken,
        outputTokenMint: outputToken,
        observationState: observationAddress,
      })
      .rpc(confirmOptions);
  
    return tx;
  }
  
  export async function swap_base_output(
    program: Program<RaydiumCpSwap>,
    owner: Signer,
    configAddress: PublicKey,
    inputToken: PublicKey,
    inputTokenProgram: PublicKey,
    outputToken: PublicKey,
    outputTokenProgram: PublicKey,
    amount_out_less_fee: BN,
    max_amount_in: BN,
    confirmOptions?: ConfirmOptions
  ) {
    const [auth] = await getAuthAddress(program.programId);
    const [poolAddress] = await getPoolAddress(
      configAddress,
      inputToken,
      outputToken,
      program.programId
    );
  
    const [inputVault] = await getPoolVaultAddress(
      poolAddress,
      inputToken,
      program.programId
    );
    const [outputVault] = await getPoolVaultAddress(
      poolAddress,
      outputToken,
      program.programId
    );
  
    const inputTokenAccount = getAssociatedTokenAddressSync(
      inputToken,
      owner.publicKey,
      false,
      inputTokenProgram
    );
    const outputTokenAccount = getAssociatedTokenAddressSync(
      outputToken,
      owner.publicKey,
      false,
      outputTokenProgram
    );
    const [observationAddress] = await getOrcleAccountAddress(
      poolAddress,
      program.programId
    );
  
    const tx = await program.methods
      .swapBaseOutput(max_amount_in, amount_out_less_fee)
      .accounts({
        payer: owner.publicKey,
        authority: auth,
        ammConfig: configAddress,
        poolState: poolAddress,
        inputTokenAccount,
        outputTokenAccount,
        inputVault,
        outputVault,
        inputTokenProgram: inputTokenProgram,
        outputTokenProgram: outputTokenProgram,
        inputTokenMint: inputToken,
        outputTokenMint: outputToken,
        observationState: observationAddress,
      })
      .rpc(confirmOptions);
  
    return tx;
  }
  