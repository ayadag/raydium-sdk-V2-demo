import BN from 'bn.js';

import {
  CreateOrderParams,
  LimitOrderProvider,
  OrderHistoryItem,
  ownerFilter,
  TradeHistoryItem,
} from '@jup-ag/limit-order-sdk';
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

import {
  connection2 as connection,
  owner2 as Owner,
} from '../../config';
import {
  CancelOrder,
  OrderFields,
  validateCancelOrderFields,
} from './utils/validate';

const limitOrder = new LimitOrderProvider(connection);

//Create Order
async function createOrder() {
    const order1 = {
        // owner: '',
        // inAmount: 1,
        inAmount: 2261385.8592,
        // outAmount: 1,
        // outAmount: 2,
        outAmount: 0.0444,//0.0444015233949946
        inputMint: 'DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q', //PRIORA
        outputMint: 'So11111111111111111111111111111111111111112', //SOL
    }

    const base = Keypair.generate();

    let orderData: OrderFields = {
        owner: Owner.publicKey,
        // inAmount: new BN(order1.inAmount), // 1 USDC
        inAmount: new BN(order1.inAmount * Math.pow(10, 9)), // 1 USDC decimals 9
        inputMint: new PublicKey(order1.inputMint), // USDC mainnet mint
        // outAmount: new BN(order1.outAmount), // 1 SOL
        outAmount: new BN(order1.outAmount * Math.pow(10, 9)), // 1 SOL decimals 9
        outputMint: new PublicKey(order1.outputMint), // SOL mint
        base: base.publicKey,
        expiredAt: null,
    }
    
    // validateCreateOrderFields(orderData); //ayad

    const { tx, orderPubKey } = await limitOrder.createOrder(
        orderData as CreateOrderParams
    );

    console.log('orderPubKey: ', orderPubKey);
    const trx = await sendAndConfirmTransaction(connection, tx, [Owner, base]);
    return console.log(`[✅] Order placed successfully TRX: ${trx}`);
}

//Orders
async function orders() {
    const openOrder = await limitOrder.getOrders([ownerFilter(Owner.publicKey)]);
    console.log('Open orders: ', openOrder);

    const orderHistory: OrderHistoryItem[] = await limitOrder.getOrderHistory({
      wallet: Owner.publicKey.toBase58(),
      take: 20, // optional, default is 20, maximum is 100
      // lastCursor: order.id // optional, for pagination
    });
    console.log('Order History: ', orderHistory);

    const orderHistoryCount: number = await limitOrder.getOrderHistoryCount({
        wallet: Owner.publicKey.toBase58(),
    });
    console.log('Order History Count: ', orderHistoryCount);

    const tradeHistory: TradeHistoryItem[] = await limitOrder.getTradeHistory({
        wallet: Owner.publicKey.toBase58(),
        take: 20, // optional, default is 20, maximum is 100
        // lastCursor: order.id // optional, for pagination
    });
    console.log('Trade History: ', tradeHistory);

    const tradeHistoryCount: number = await limitOrder.getTradeHistoryCount({
        wallet: Owner.publicKey.toBase58(),
    });
    return console.log('Trade History Count: ', tradeHistoryCount);
}

//Cancel Order
async function cancelOrder() {
    const order: CancelOrder = {
        owner: Owner.publicKey.toBase58(),
        orderPubKey: '' //Order Publickey
    };

    validateCancelOrderFields(order);

    const { owner, orderPubKey } = order;

    const txid = await limitOrder.cancelOrder({
    //   owner: new PublicKey(owner),
        owner: Owner.publicKey,
        orderPubKey: new PublicKey(orderPubKey),
    });

    console.log('txid: ', txid)

    // const trx = await sendAndConfirmTransaction(connection, txid, [Owner]); //ayad

    // console.log(`[✅] Order canceld successfully TRX: ${trx}`); //ayad
}

function test() {
    // const y = 0.1 * 1000000000;
    // const y = 0.1 * Math.pow(10, 9);
    // const x = new BN(y, 9);
    // const x = new BN(0.0895 * Math.pow(10, 9), 9);
    const x = new BN(0.0895 * Math.pow(10, 9));
    console.log(x)
    console.log(x.toNumber())
}
// createOrder();
orders();
// test()


/**
Open orders:  []
Order History:  []
Order History Count:  0
Trade History:  []
Trade History Count:  0
 */

/*
Open orders:  []
orderPubKey:  PublicKey [PublicKey(AuXpoXwxnbsBHGfJBYaCKTRxhcfdCHdhdYFVHhwrqyH3)] {
  _bn: <BN: 932e3cc76a72b233f5ca2209345545870c3a73cf41835874bd0b7f33193820d2>
}
Order History:  []
Order History Count:  0
Trade History:  []
Trade History Count:  0
*/

/*
Open orders:  [
  {
    publicKey: PublicKey [PublicKey(AuXpoXwxnbsBHGfJBYaCKTRxhcfdCHdhdYFVHhwrqyH3)] {
      _bn: <BN: 932e3cc76a72b233f5ca2209345545870c3a73cf41835874bd0b7f33193820d2>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 1>,
      oriTakingAmount: <BN: 1>,
      makingAmount: <BN: 1>,
      takingAmount: <BN: 1>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(5XydWrUEpSqHUebfFZHawCeY54U5AERWQv26KMxcnbwF)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(3gyMBo8pURqV1y8v1rgzZHtuUpjNtK4ws97TEVrEVLcc)]],
      referral: null
    }
  }
]
Order History:  []
Order History Count:  0
Trade History:  []
Trade History Count:  0
 */

/*
orderPubKey:  PublicKey [PublicKey(9AzPcAiuyqfM61k4muAThHP4TwSrYqm6cctanBeHLzhG)] {
  _bn: <BN: 796c9d0ebb5cabf1e3ae9c99f7922133cf5cc3b3901f586f2596752dc708d23b>
}
 */

/*
Open orders:  [
  {
    publicKey: PublicKey [PublicKey(9AzPcAiuyqfM61k4muAThHP4TwSrYqm6cctanBeHLzhG)] {
      _bn: <BN: 796c9d0ebb5cabf1e3ae9c99f7922133cf5cc3b3901f586f2596752dc708d23b>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 1>,
      oriTakingAmount: <BN: 2>,
      makingAmount: <BN: 1>,
      takingAmount: <BN: 2>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(CESsdkrUVvtidsieLt821wRPq2verJNbwWYyfMobFhUV)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(3TahyAZYXK2a7fk1bSosf15v9iA27NvXT41ei3KeyDgJ)]],
      referral: null
    }
  },
  {
    publicKey: PublicKey [PublicKey(AuXpoXwxnbsBHGfJBYaCKTRxhcfdCHdhdYFVHhwrqyH3)] {
      _bn: <BN: 932e3cc76a72b233f5ca2209345545870c3a73cf41835874bd0b7f33193820d2>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 1>,
      oriTakingAmount: <BN: 1>,
      makingAmount: <BN: 1>,
      takingAmount: <BN: 1>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(5XydWrUEpSqHUebfFZHawCeY54U5AERWQv26KMxcnbwF)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(3gyMBo8pURqV1y8v1rgzZHtuUpjNtK4ws97TEVrEVLcc)]],
      referral: null
    }
  }
]
Order History:  []
Order History Count:  0
Trade History:  []
Trade History Count:  0
 */

/*
orderPubKey:  PublicKey [PublicKey(5LWTQhjUfuUigyx4y5mXAXEi7qSrcUkT9KnJ8sL5kEjy)] {
  _bn: <BN: 406e169be5720802f16c393962d145326bb0174f6ee007b412b544d9ee123568>
}
[✅] Order placed successfully TRX: 2zvJR1Fk4d5aPxfpDqECH7xvQUS1gPWDaEN3WUrJkcZjrzDkQQ2nETpiXQ2GzCrzbSj6n1z8tMn844dJdeAaszFQ
 */

/*
Open orders:  [
  {
    publicKey: PublicKey [PublicKey(AuXpoXwxnbsBHGfJBYaCKTRxhcfdCHdhdYFVHhwrqyH3)] {
      _bn: <BN: 932e3cc76a72b233f5ca2209345545870c3a73cf41835874bd0b7f33193820d2>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 1>,
      oriTakingAmount: <BN: 1>,
      makingAmount: <BN: 1>,
      takingAmount: <BN: 1>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(5XydWrUEpSqHUebfFZHawCeY54U5AERWQv26KMxcnbwF)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(3gyMBo8pURqV1y8v1rgzZHtuUpjNtK4ws97TEVrEVLcc)]],
      referral: null
    }
  },
  {
    publicKey: PublicKey [PublicKey(9AzPcAiuyqfM61k4muAThHP4TwSrYqm6cctanBeHLzhG)] {
      _bn: <BN: 796c9d0ebb5cabf1e3ae9c99f7922133cf5cc3b3901f586f2596752dc708d23b>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 1>,
      oriTakingAmount: <BN: 2>,
      makingAmount: <BN: 1>,
      takingAmount: <BN: 2>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(CESsdkrUVvtidsieLt821wRPq2verJNbwWYyfMobFhUV)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(3TahyAZYXK2a7fk1bSosf15v9iA27NvXT41ei3KeyDgJ)]],
      referral: null
    }
  },
  {
    publicKey: PublicKey [PublicKey(5LWTQhjUfuUigyx4y5mXAXEi7qSrcUkT9KnJ8sL5kEjy)] {
      _bn: <BN: 406e169be5720802f16c393962d145326bb0174f6ee007b412b544d9ee123568>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 808b7ecd67400>,
      oriTakingAmount: <BN: 2a57d80>,
      makingAmount: <BN: 808b7ecd67400>,
      takingAmount: <BN: 2a57d80>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(83EYAs2nU2enjuq7o3P68hm6Ux1RXN2u8bTyfH8vLBph)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(EMCo8gmS8cbjKJ1xx8KQm9byGHKQTTVp8HKgQ5o4btf1)]],
      referral: null
    }
  }
]
Order History:  []
Order History Count:  0
Trade History:  []
Trade History Count:  0
 */

/*
Open orders:  [
  {
    publicKey: PublicKey [PublicKey(5LWTQhjUfuUigyx4y5mXAXEi7qSrcUkT9KnJ8sL5kEjy)] {
      _bn: <BN: 406e169be5720802f16c393962d145326bb0174f6ee007b412b544d9ee123568>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 808b7ecd67400>,
      oriTakingAmount: <BN: 2a57d80>,
      makingAmount: <BN: 6b1ed7b25e3d7>,
      takingAmount: <BN: 23492e1>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(83EYAs2nU2enjuq7o3P68hm6Ux1RXN2u8bTyfH8vLBph)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(EMCo8gmS8cbjKJ1xx8KQm9byGHKQTTVp8HKgQ5o4btf1)]],
      referral: null
    }
  },
  {
    publicKey: PublicKey [PublicKey(9AzPcAiuyqfM61k4muAThHP4TwSrYqm6cctanBeHLzhG)] {
      _bn: <BN: 796c9d0ebb5cabf1e3ae9c99f7922133cf5cc3b3901f586f2596752dc708d23b>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 1>,
      oriTakingAmount: <BN: 2>,
      makingAmount: <BN: 1>,
      takingAmount: <BN: 2>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(CESsdkrUVvtidsieLt821wRPq2verJNbwWYyfMobFhUV)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(3TahyAZYXK2a7fk1bSosf15v9iA27NvXT41ei3KeyDgJ)]],
      referral: null
    }
  },
  {
    publicKey: PublicKey [PublicKey(AuXpoXwxnbsBHGfJBYaCKTRxhcfdCHdhdYFVHhwrqyH3)] {
      _bn: <BN: 932e3cc76a72b233f5ca2209345545870c3a73cf41835874bd0b7f33193820d2>
    },
    account: {
      maker: [PublicKey [PublicKey(Vf8vjzicHUxWRvVFTxU76PzdwWRgRrbRwan6JwF9RBB)]],
      inputMint: [PublicKey [PublicKey(DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q)]],
      outputMint: [PublicKey [PublicKey(So11111111111111111111111111111111111111112)]],
      waiting: true,
      oriMakingAmount: <BN: 1>,
      oriTakingAmount: <BN: 1>,
      makingAmount: <BN: 1>,
      takingAmount: <BN: 1>,
      makerInputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      makerOutputAccount: [PublicKey [PublicKey(9eEMCvwW4Tv871RQFCvBomikooSS9741xewreQyT1YSV)]],
      reserve: [PublicKey [PublicKey(5XydWrUEpSqHUebfFZHawCeY54U5AERWQv26KMxcnbwF)]],
      borrowMakingAmount: <BN: 0>,
      expiredAt: null,
      base: [PublicKey [PublicKey(3gyMBo8pURqV1y8v1rgzZHtuUpjNtK4ws97TEVrEVLcc)]],
      referral: null
    }
  }
]
Order History:  []
Order History Count:  0
Trade History:  [
  {
    id: 64870897,
    inAmount: 376902467489833n,
    outAmount: 7400095n,
    txid: '5f5TdYZFpSZWcKRwanpUfZmuw9ot66nWke2mxwVsA5DFUZTEMpDF1roHWS9JsVbJHpxY16BUdB17E85nx8JrGpKM',
    createdAt: 2024-07-27T13:59:05.000Z,
    order: {
      orderKey: '5LWTQhjUfuUigyx4y5mXAXEi7qSrcUkT9KnJ8sL5kEjy',
      inputMint: 'DYopxq7KCJKw4fbbkgfiuXyiW9dt2EAaXL4vxW9T3V4Q',
      outputMint: 'So11111111111111111111111111111111111111112'
    },
    orderKey: '5LWTQhjUfuUigyx4y5mXAXEi7qSrcUkT9KnJ8sL5kEjy'
  }
]
Trade History Count:  1
 */
















// import { Request, Response, Router } from "express";
// import {
//   LimitOrderProvider,
//   CreateOrderParams,
//   OrderHistoryItem,
//   ownerFilter,
// } from "@jup-ag/limit-order-sdk";
// import {
//   Connection,
//   Keypair,
//   PublicKey,
//   sendAndConfirmTransaction,
// } from "@solana/web3.js";
// import BN from "bn.js";
// import { Wallet } from "@project-serum/anchor";
// import bs58 from "bs58";

// import {
//   validateCreateOrderFields,
//   validateCancelOrderFields,
//   OrderFields,
//   CancelOrder,
// } from "../utils/validate";

// const router: Router = Router();

// /**
//  * set PRC URL and create connection
//  */
// const SOLANA_RPC_ENDPOINT: string = "https://nyc83.nodes.rpcpool.com";
// const connection = new Connection(SOLANA_RPC_ENDPOINT);
// const limitOrder = new LimitOrderProvider(connection);

// /**
//  * Handles creation of a new order.
//  * @route POST /orders
//  */
// router.post("/createOrder", async (req: Request, res: Response) => {
//   try {
//     const reqData: OrderFields = req.body;
//     const { owner, inAmount, outAmount, inputMint, outputMint }: OrderFields =
//       reqData;

//     /**
//      * Validate Reqest body
//      */
//     validateCreateOrderFields(reqData);

//     const base = Keypair.generate();

//     let orderData: OrderFields = {
//       owner: owner,
//       inAmount: new BN(inAmount), // 1 USDC
//       inputMint: new PublicKey(inputMint), // USDC mainnet mint
//       outAmount: new BN(outAmount), // 1 SOL
//       outputMint: new PublicKey(outputMint), // SOL mint
//       base: base.publicKey,
//       expiredAt: null,
//     };

//     const { tx, orderPubKey } = await limitOrder.createOrder(
//       orderData as CreateOrderParams
//     );

//     // @ts-ignore: owner
//     const trx = await sendAndConfirmTransaction(connection, tx, [owner, base]);

//     console.log(`[✅] Order placed successfully TRX: ${trx}`);

//     res.json({
//       message: `Order placed successfully TRX: ${trx}`,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ errorMessage: (error as Error).message || "Unknown error" });
//   }
// });

// /**
//  * Queries a user's orders.
//  * @route GET /orders/:owner
//  */
// router.get("/order/:owner", async (req: Request, res: Response) => {
//   try {
//     const owner = req.params.owner;

//     console.log("[owner]", new PublicKey(owner));

//     const openOrder = await limitOrder.getOrders([
//       ownerFilter(new PublicKey(owner)),
//     ]);

//     const orderHistory: OrderHistoryItem[] = await limitOrder.getOrderHistory({
//       wallet: owner,
//       take: 20, // optional, default is 20, maximum is 100
//       // lastCursor: order.id // optional, for pagination
//     });

//     res.json({ ...orderHistory });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ errorMessage: (error as Error).message || "Unknown error" });
//   }
// });

// /**
//  * cancel an existing order.
//  * @route cancel /orders/{orderId}

//  */
// router.delete("/cancel/:orderId", async (req: Request, res: Response) => {
//   try {
//     const order = req.body;

//     validateCancelOrderFields(order);

//     const { owner, orderPubKey } = order;

//     const txid = await limitOrder.cancelOrder({
//       owner: owner,
//       orderPubKey: orderPubKey,
//     });

//     res.json({ wasCancelled: true });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ errorMessage: (error as Error).message || "Unknown error" });
//   }
// });

// export default router;
