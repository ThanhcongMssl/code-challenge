import type { Balance } from '../types/token';

const balance = {
  "ATOM": 30000,
  "ETH": 60000,
  "USD": 90000,
}

async function getBalance() {
  // Simulate API call delay
  return new Promise<Balance>((resolve) => {
    setTimeout(() => {
      resolve(balance);
    }, 300);
  });
}

export { getBalance };