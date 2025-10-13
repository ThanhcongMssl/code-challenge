import BigNumber from "bignumber.js";
import type { Token } from '../types/token';

function swapToken(amount: string, from: string, to: string) {
  console.log(`Swapping ${amount} from ${from} to ${to}`);
  // Simulate API call delay
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
}

async function calculateSwapAmount(amount: string, fromToken: string, toToken: string) {
  return new Promise<string>((resolve, reject) => {
    fetch('https://interview.switcheo.com/prices.json')
      .then(response => response.json())
      .then((prices: Token[]) => {
        const fromTokenPrice = prices.find(price => price.currency.toLowerCase() === fromToken.toLowerCase())?.price || 0;
        const toTokenPrice = prices.find(price => price.currency.toLowerCase() === toToken.toLowerCase())?.price || 0;

        if (!amount) {
          resolve('');
          return;
        };
        const amountNum = Number(amount);
        const usdValue = amountNum * fromTokenPrice;
        const receiveAmount = usdValue / toTokenPrice;
        resolve(BigNumber(receiveAmount).decimalPlaces(6).toFixed());
      })
      .catch(reject);
  });
}

export { swapToken, calculateSwapAmount };