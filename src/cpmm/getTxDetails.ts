import { Connection } from '@solana/web3.js';

export type TxDetail = {
  state: 'success' | 'error',
  code?: string,
  message: string
}

const errorMessages = {
  '0x0': 'Account Address already in use',
  '0x1779': 'Init lp amount is too less(Because 100 amount lp will be locked), you need to increase tokens amount.',
  '0xbc4': 'The program expected this account to be already initialized.',
}

// const tx1 = '3xUQDeMRGpdGgWNPu8FyC35NF8GRup9qvexBUut9URfgdALeyKPy6eKFtBxwpTkkLXpFT4bFFhFNttkuRgJ53U6k' //Error Message: Init lp amount is too less(Because 100 amount lp will be locked).
const tx1 = '4ErUNa82UKs8NNfqNRmf5fqzBe3tBR3g8SNkPn5tkPoH58ab1bMkz9DponK5pmT2HviV54RuRa5AMAT1QvonNcGR' //success
// const tx1 = 'Rjb7wHpgwr57kuFRwHUqFyDgKLBCDUSf9iyRMxcyzUUPa4hV7MHhbu7R3eWASwk5HWY4ioFbQYh9XZSDJpC2Naa' //already in use
// const tx1 = '3G5nvdDws8GnvV9YRg1qaDmogSJRzeW8MxKAkvmfNYRL4xhcec74hkcVdehkbEmY6PX5RCHtq9JEkDUDYwbSUkNr' //Message: The program expected this account to be already initialized.
const connection1 = new Connection('https://api.devnet.solana.com/')

async function getTransaction(connection:Connection, tx:string) {
  let txDetail: TxDetail;
  const txDetails = await connection.getTransaction(tx, {"maxSupportedTransactionVersion": 0});
  console.log(txDetails);
  if(txDetails?.meta?.err == null) {
    // console.log('Pool created successfully')
    txDetail = {
      state: 'success',
      message: 'Pool created successfully',
    }
    return txDetail;
  }
  // if(txDetails?.meta?.err != null) if(txDetails?.meta?.logMessages) console.log(txDetails?.meta?.logMessages[58]);
  else if (txDetails?.meta?.err != null) { 
    const len = txDetails?.meta?.logMessages?.length
    if(txDetails?.meta?.logMessages && len) {
      const errorC = txDetails?.meta?.logMessages[len-1].split('Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo failed: custom program error: ');
      const errorCode = errorC[1]
      // console.log('Error code: ', errorCode)
      // console.log('Error messages: ', 
      //   errorCode == '0x0' ? errorMessages['0x0']
      //   : errorCode == '0x1779' ? errorMessages['0x1779']
      //   : errorCode == '0xbc4' ? errorMessages['0xbc4']
      //   : 'An Error happen'
      // )

      errorCode == '0x0' ? txDetail = {
        state: 'error',
        code: errorCode,
        message: errorMessages['0x0'],
      }
      : errorCode == '0x1779' ? txDetail = {
        state: 'error',
        code: errorCode,
        message: errorMessages['0x1779'],
      }
      : errorCode == '0xbc4' ? txDetail = {
        state: 'error',
        code: errorCode,
        message: errorMessages['0xbc4'],
      }
      : txDetail = {
        state: 'error',
        message: 'An Error happen',
      }

      return txDetail;
    }
  }
}

async function get() {
  const res = await getTransaction(connection1, tx1);
  console.log(res)
}

get()
//error
//3xUQDeMRGpdGgWNPu8FyC35NF8GRup9qvexBUut9URfgdALeyKPy6eKFtBxwpTkkLXpFT4bFFhFNttkuRgJ53U6k
// {
//     blockTime: 1721025209,
//     meta: {
//       computeUnitsConsumed: 135028,
//       err: { InstructionError: [Array] },
//       fee: 25000,
//       innerInstructions: [ [Object] ],
//       loadedAddresses: { readonly: [], writable: [] },
//       logMessages: [
//         'Program ComputeBudget111111111111111111111111111111 invoke [1]',
//         'Program ComputeBudget111111111111111111111111111111 success',
//         'Program ComputeBudget111111111111111111111111111111 invoke [1]',
//         'Program ComputeBudget111111111111111111111111111111 success',
//         'Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo invoke [1]',
//         'Program log: Instruction: Initialize',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: InitializeMint2',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2780 of 172739 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [2]',
//         'Program log: Create',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
//         'Program log: Instruction: GetAccountDataSize',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1595 of 153341 compute units',
//         'Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program 11111111111111111111111111111111 invoke [3]',
//         'Program 11111111111111111111111111111111 success',
//         'Program log: Initialize the associated token account',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
//         'Program log: Instruction: InitializeImmutableOwner',
//         'Program log: Please upgrade to SPL Token 2022 for immutable owner support',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 146728 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
//         'Program log: Instruction: InitializeAccount3',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4214 of 142846 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 21889 of 160238 compute units',
//         'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: InitializeAccount3',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4214 of 109110 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: InitializeAccount3',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4241 of 98488 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: TransferChecked',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6173 of 90191 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: TransferChecked',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6200 of 80105 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program log: liquidity:3, lock_lp_amount:100, vault_0_amount:1,vault_1_amount:10',
//         'Program log: AnchorError occurred. Error Code: InitLpAmountTooLess. Error Number: 6009. Error Message: Init lp amount is too less(Because 100 amount lp will be locked).',
//         'Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo consumed 134728 of 199700 compute units',
//         'Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo failed: custom program error: 0x1779'
//       ],
//       postBalances: [
//         44985630779,         0,         0,
//             2039280,   2039280,         0,
//                   0,         0,   2539280,
//                   0,         1,   1141440,
//             2533440,         0,   1461600,
//             1461600, 934087680, 731913600,
//                   1,   1009200
//       ],
//       postTokenBalances: [ [Object], [Object], [Object] ],
//       preBalances: [
//         44985655779,         0,         0,
//             2039280,   2039280,         0,
//                   0,         0,   2539280,
//                   0,         1,   1141440,
//             2533440,         0,   1461600,
//             1461600, 934087680, 731913600,
//                   1,   1009200
//       ],
//       preTokenBalances: [ [Object], [Object], [Object] ],
//       rewards: [],
//       status: { Err: [Object] }
//     },
//     slot: 311786848,
//     transaction: {
//       message: MessageV0 {
//         header: [Object],
//         staticAccountKeys: [Array],
//         recentBlockhash: '4C5hyqBUAoqsGe34ZM6RSa3M5akpHQTW1aWJXxDANzYT',
//         compiledInstructions: [Array],
//         addressTableLookups: []
//       },
//       signatures: [
//         '3xUQDeMRGpdGgWNPu8FyC35NF8GRup9qvexBUut9URfgdALeyKPy6eKFtBxwpTkkLXpFT4bFFhFNttkuRgJ53U6k'
//       ]
//     },
//     version: 0
//   }

//success
//4ErUNa82UKs8NNfqNRmf5fqzBe3tBR3g8SNkPn5tkPoH58ab1bMkz9DponK5pmT2HviV54RuRa5AMAT1QvonNcGR
// {
//     blockTime: 1720292681,
//     meta: {
//       computeUnitsConsumed: 143612,
//       err: null,
//       fee: 5000,
//       innerInstructions: [ [Object] ],
//       loadedAddresses: { readonly: [], writable: [] },
//       logMessages: [
//         'Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo invoke [1]',
//         'Program log: Instruction: Initialize',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: InitializeMint2',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2780 of 168563 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [2]',
//         'Program log: Create',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
//         'Program log: Instruction: GetAccountDataSize',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1595 of 146165 compute units',
//         'Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program 11111111111111111111111111111111 invoke [3]',
//         'Program 11111111111111111111111111111111 success',
//         'Program log: Initialize the associated token account',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
//         'Program log: Instruction: InitializeImmutableOwner',
//         'Program log: Please upgrade to SPL Token 2022 for immutable owner support',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 139552 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]',
//         'Program log: Instruction: InitializeAccount3',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4214 of 135670 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 23389 of 154562 compute units',
//         'Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: InitializeAccount3',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4214 of 107934 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program 11111111111111111111111111111111 invoke [2]',
//         'Program 11111111111111111111111111111111 success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: InitializeAccount3',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4214 of 97312 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: TransferChecked',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6173 of 89042 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: TransferChecked',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6173 of 78956 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program log: liquidity:100, lock_lp_amount:100, vault_0_amount:10000,vault_1_amount:1',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]',
//         'Program log: Instruction: MintTo',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4589 of 62815 compute units',
//         'Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success',
//         'Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo consumed 143612 of 200000 compute units',
//         'Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo success'
//       ],
//       postBalances: [
//         15088547579,   5324400,
//             1461600,   2039280,
//             2039280,   2039280,
//             2039280,   2039280,
//             2539280,  29252880, 
//             1141440,   2533440,
//                   0,   1461600,
//             1461600, 934087680,
//           731913600,         1,
//             1009200
//       ],
//       postTokenBalances: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//       preBalances: [
//         15130709299,         0,       0,
//             2039280,   2039280,       0,
//                   0,         0, 2539280,
//                   0,   1141440, 2533440,
//                   0,   1461600, 1461600,
//           934087680, 731913600,       1,
//             1009200
//       ],
//       preTokenBalances: [ [Object], [Object], [Object] ],
//       rewards: [],
//       status: { Ok: null }
//     },
//     slot: 309831388,
//     transaction: {
//       message: MessageV0 {
//         header: [Object],
//         staticAccountKeys: [Array],
//         recentBlockhash: '79PtcfEgJxGvbV97ydx8THSYPEEBYzRS5qdYKPJCyvwd',
//         compiledInstructions: [Array],
//         addressTableLookups: []
//       },
//       signatures: [
//         '4ErUNa82UKs8NNfqNRmf5fqzBe3tBR3g8SNkPn5tkPoH58ab1bMkz9DponK5pmT2HviV54RuRa5AMAT1QvonNcGR'
//       ]
//     },
//     version: 0
//   }
