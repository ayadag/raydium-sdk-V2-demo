async function Tokens(listType: string, page: number, perPage: number) {
    // const tokensList = await getTokenList('strict');
    // const tokens = await getTokenList('all');
    // console.log('tokens: ', tokensList)
    const tokensList = await getTokenList(listType);
    if(!tokensList){return console.error('!tokenList')}
    const tokens = tokensList.slice((page-1)*perPage, page*perPage);
    console.log('tokens: ', tokens)
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
Tokens('all', 1, 4); //listType: string, page: number, perPage: number