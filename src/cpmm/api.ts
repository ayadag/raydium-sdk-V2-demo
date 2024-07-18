const url = 'https://serverless-jizen7j8e-ayads-projects.vercel.app';

//pools
const getPools = async () => {
    const searchParam = {
        page: 1,
        perPage: 3,
    }

    // const pools = await ( await fetch(
    //     // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
    //     // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
    //     `https://serverless-jizen7j8e-ayads-projects.vercel.app/api/pools?page=1&perPage=3`    
    // )
    // ).json();

    // const pools = await fetch(
    //     // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
    //     // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
    //     `https://serverless-jizen7j8e-ayads-projects.vercel.app/api/pools?page=1&perPage=3`    
    // )

    // const pools = await( await fetch('https://serverless-jizen7j8e-ayads-projects.vercel.app/api/pools?page=1&perPage=3', {
    //     headers:{
    //       accept: 'application/json',
    //       'User-agent': 'learning app',
    //     }
    //   })).json();

    const pools = fetch(
        // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        `https://serverless-jizen7j8e-ayads-projects.vercel.app/api/pools?page=1&perPage=3`    
    )
    // .then(res => console.log(res))
    .then(function(serverPromise){ 
        serverPromise.json()
          .then(function(j) { 
            console.log(j); 
          })
          .catch(function(e){
            console.log(e);
          });
    })

    .catch(function(e){
          console.log(e);
    });

    console.log(pools)
}
getPools();