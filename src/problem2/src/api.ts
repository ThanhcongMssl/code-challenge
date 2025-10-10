function swapToken(amount: string, from: string, to: string) {
  console.log(`Swapping ${amount} from ${from} to ${to}`);
  // Simulate API call delay
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
}

export { swapToken };