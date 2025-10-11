import BigNumber from "bignumber.js";
import type { Token } from './types';
import prices from './prices.json';

function swapToken(amount: string, from: string, to: string) {
  console.log(`Swapping ${amount} from ${from} to ${to}`);
  // Simulate API call delay
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
}

function calculateSwapAmount(amount: string, fromToken: Token, toToken: Token) {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const fromTokenPrice = prices.find(t => t.currency === fromToken.currency)?.price || 0;
      const toTokenPrice = prices.find(t => t.currency === toToken.currency)?.price || 0;

      if (!amount) {
        resolve('');
        return;
      };
      const amountNum = Number(amount);
      const usdValue = amountNum * fromTokenPrice;
      const receiveAmount = usdValue / toTokenPrice;
      resolve(BigNumber(receiveAmount).decimalPlaces(6).toFixed());
    }, 500);
  });
}

export { swapToken, calculateSwapAmount };