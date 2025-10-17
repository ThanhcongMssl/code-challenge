type Token = {
  currency: string, date: string, price: number
}

type Balance = {
  [key: string]: number
}

export type { Token, Balance };