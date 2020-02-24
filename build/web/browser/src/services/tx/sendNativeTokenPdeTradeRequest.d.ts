import AccountKeySetModel from '@src/models/key/accountKeySet';
import CoinModel from '@src/models/coin';
interface TradeParam {
    accountKeySet: AccountKeySetModel;
    availableNativeCoins: CoinModel[];
    nativeFee: number;
    tradingFee: number;
    sellAmount: number;
    tokenIdBuy: TokenIdType;
    tokenIdSell: TokenIdType;
    minimumAcceptableAmount: number;
}
export default function sendNativeTokenPdeTradeRequest({ accountKeySet, availableNativeCoins, nativeFee, tradingFee, tokenIdBuy, tokenIdSell, sellAmount, minimumAcceptableAmount }: TradeParam): Promise<import("../../models/txHistory").TxHistoryModel>;
export {};
//# sourceMappingURL=sendNativeTokenPdeTradeRequest.d.ts.map