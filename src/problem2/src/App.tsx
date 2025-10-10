import { useState } from 'react'
import './App.scss'
import 'simplebar-react/dist/simplebar.min.css';

import type { Token } from './types';

import { swapToken } from './api';
import TokenInput from './components/TokenInput'

function calculateSwapAmount(amount: string | number, fromToken: Token, toToken: Token) {
  if (!amount || isNaN(Number(amount))) return '';
  const amountNum = Number(amount);
  const usdValue = amountNum * fromToken.price;
  const receiveAmount = usdValue / toToken.price;
  return Number.isInteger(receiveAmount) ? receiveAmount : receiveAmount.toFixed(6);
}

function App() {
  const [sendAmount, setSendAmount] = useState<string | number>('');
  const [sendToken, setSendToken] = useState<Token | null>(null);
  const [receiveAmount, setReceiveAmount] = useState<string | number>('');
  const [receiveToken, setReceiveToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isDisabled = !sendAmount || sendAmount == 0 || !sendToken || !receiveToken || sendToken.currency === receiveToken.currency;

  return (
    <>
      <h5>Swap</h5>

      <p>{message}</p>

      <form>
        <label>Amount to send</label>
        <TokenInput
          amount={sendAmount}
          token={sendToken}
          onAmountChange={(amount) => {
            setSendAmount(amount);
            if (sendToken && receiveToken) {
              const receiveAmt = calculateSwapAmount(amount, sendToken, receiveToken);
              setReceiveAmount(receiveAmt);
            }
          }}
          onTokenChange={(token) => {
            setSendToken(token);
            if (sendAmount && token && receiveToken) {
              const receiveAmt = calculateSwapAmount(sendAmount, token, receiveToken);
              setReceiveAmount(receiveAmt);
            }
          }}
        />

        <label>Amount to receive</label>
        <TokenInput 
          amount={receiveAmount}
          token={receiveToken}
          onAmountChange={(amount) => {
            setReceiveAmount(amount);
            if (sendToken && receiveToken) {
              const sendAmt = calculateSwapAmount(amount, receiveToken, sendToken);
              setSendAmount(sendAmt);
            }
          }}
          onTokenChange={(token) => {
            setReceiveToken(token);
            if (sendAmount && sendToken && token) {
              const receiveAmt = calculateSwapAmount(sendAmount, sendToken, token);
              setReceiveAmount(receiveAmt);
            }
          }}
        />

        <button 
          type="button"
          disabled={isDisabled}
          className={isLoading ? 'loading' : ''}
          onClick={() => {
            if (sendAmount && sendToken && receiveToken) {
              setIsLoading(true);
              setMessage(null);
              swapToken(sendAmount.toString(), sendToken.currency, receiveToken.currency)
                .then(() => {
                  setMessage('Swap successful!');
                  setSendAmount('');
                  setReceiveAmount('');
                  setSendToken(null);
                  setReceiveToken(null);
                })
                .finally(() => {
                  setIsLoading(false);
                });
            }
          }}>
            CONFIRM SWAP
          </button>
      </form>
    </>
  )
}

export default App
