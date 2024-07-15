import { Connection } from '@solana/web3.js';

const tx = '3xUQDeMRGpdGgWNPu8FyC35NF8GRup9qvexBUut9URfgdALeyKPy6eKFtBxwpTkkLXpFT4bFFhFNttkuRgJ53U6k'
const connection = new Connection('https://api.devnet.solana.com/')

async function getTransaction() {
  const txDetails = await connection.getTransaction(tx, {"maxSupportedTransactionVersion": 0});
  console.log(txDetails);
}

getTransaction();