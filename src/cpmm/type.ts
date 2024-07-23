type PoolTypeItem = "StablePool" | "OpenBookMarket";

interface ApiCpmmConfigV3 {
    id: string;
    index: number;
    protocolFeeRate: number;
    tradeFeeRate: number;
    fundFeeRate: number;
    createPoolFee: string;
}

export interface ApiV3PoolInfoCountItem {
    volume: number;
    volumeQuote: number;
    volumeFee: number;
    apr: number;
    feeApr: number;
    priceMin: number;
    priceMax: number;
    rewardApr: number[];
}

type FarmRewardInfoOld = {
    mint: ApiV3Token;
    perSecond: number;
}

export type PoolFarmRewardInfo = FarmRewardInfoOld & {
    startTime?: number;
    endTime?: number;
};

export interface TransferFeeDataBaseType {
    transferFeeConfigAuthority: string;
    withdrawWithheldAuthority: string;
    withheldAmount: string;
    olderTransferFee: {
      epoch: string;
      maximumFee: string;
      transferFeeBasisPoints: number;
    };
    newerTransferFee: {
      epoch: string;
      maximumFee: string;
      transferFeeBasisPoints: number;
    };
}

type ExtensionsItem = {
    coingeckoId?: string;
    feeConfig?: TransferFeeDataBaseType;
};

export type ApiV3Token = {
    chainId: number;
    address: string;
    programId: string;
    logoURI: string;
    symbol: string;
    name: string;
    decimals: number;
    tags: string[]; // "hasFreeze" | "hasTransferFee" | "token-2022" | "community" | "unknown" ..etc
    extensions: ExtensionsItem;
}

export interface ApiV3PoolInfoBaseItem {
    programId: string;
    id: string;
    mintA: ApiV3Token;
    mintB: ApiV3Token;
    rewardDefaultInfos: PoolFarmRewardInfo[];
    rewardDefaultPoolInfos: "Ecosystem" | "Fusion" | "Raydium" | "Clmm";
    price: number;
    mintAmountA: number;
    mintAmountB: number;
    feeRate: number;
    openTime: string;
    tvl: number;
  
    day: ApiV3PoolInfoCountItem;
    week: ApiV3PoolInfoCountItem;
    month: ApiV3PoolInfoCountItem;
    pooltype: PoolTypeItem[];
  
    farmUpcomingCount: number;
    farmOngoingCount: number;
    farmFinishedCount: number;
}

export type ApiV3PoolInfoStandardItemCpmm = ApiV3PoolInfoBaseItem & {
    type: "Standard";
    lpMint: ApiV3Token;
    lpPrice: number;
    lpAmount: number;
    config: ApiCpmmConfigV3;
}