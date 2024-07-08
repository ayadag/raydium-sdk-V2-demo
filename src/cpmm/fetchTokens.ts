import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

// import { splTo } from '@solana/spl-token';

// import { Metaplex } from '@metaplex-foundation/js';
// import { Metadata, deprecated } from "@metaplex-foundation/mpl-token-metadata";
const splToken = require('@solana/spl-token');
const { Metadata, deprecated } = require('@metaplex-foundation/mpl-token-metadata');

async function Tokens(listType: string, page: number, perPage: number) {
    // const tokensList = await getTokenList('strict');
    // const tokens = await getTokenList('all');
    // console.log('tokens: ', tokensList)
    const tokensList = await getTokenList(listType);
    if(!tokensList){return console.error('!tokenList')}
    const tokens = tokensList.slice((page-1)*perPage, page*perPage);
    console.log('tokens: ', tokens)
}

async function Token(){
    const connection = new Connection('https://api.devnet.solana.com'); //<YOUR_RPC_URL>
    const mintAddress = new PublicKey('So11111111111111111111111111111111111111112'); //SOL

    // const metaplex = Metaplex.make(connection);
    // const metadataPda = metaplex.nfts().pdas().metadata({ mint: mintAddress });

    // // let metadata: Metadata;
    // let account = await Metadata.fromAccountAddress(connection, metadataPda);

    try {
        const mintInfo = await splToken.getMint(connection, mintAddress);
        console.log("Decimals: " + mintInfo.decimals);
        console.log("Supply: " + mintInfo.supply);

        let metadataPda = await deprecated.Metadata.getPDA(mintAddress);
        let metdadataContent =  await Metadata.fromAccountAddress(connection, metadataPda);
        console.log("Metadata:", metdadataContent.pretty());

    } catch (err) {
        console.error("Error: ", err);
    }
}

async function getTokenList(list: string) {
    // let listType: 'strict' | 'all';
    // if (list == 'strict'){
    //     listType = 'strict'
    // } else if (list == 'all'){
    //     listType = 'all'
    // }
    // const listType = getListType(`${list}`);
    const listType = getListType(list);
    if(!listType){return console.error('!listType');
    }
    try{
      const tList: [] = await ( await fetch (
        //   `https://token.jup.ag/strict` //strict
          // `https://token.jup.ag/all` //all
          `https://token.jup.ag/${listType}`
        )
      ).json();
      // setTTokenList(tList);
    //   setTokenList(tList); 
      // setTokenList(tList.splice(0,10));  //splice(0,10) to take gest the first ten idems.
    //   console.log('tokenList: ',tokenList);
    // console.log('tList: ', tList)
    return tList;
    } catch(e) {return console.error('can not get tokens', e)}
}

function getListType(list:string) {
    let listType: 'strict' | 'all';
    if (list == 'strict'){
        return listType = 'strict'
    } else if (list == 'all'){
        return listType = 'all'
    }
}

// Tokens('strict', 1, 4); //listType: string, page: number, perPage: number
// Tokens('all', 1, 4); //listType: string, page: number, perPage: number

Token();