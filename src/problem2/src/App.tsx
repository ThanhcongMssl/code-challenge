import { useState, useCallback } from 'react'
import debounce from 'just-debounce';
import './App.scss'
import 'simplebar-react/dist/simplebar.min.css';

import type { Token } from './types';

import { swapToken, calculateSwapAmount } from './api';
import TokenInput from './components/TokenInput'

function App() {
  const [sendAmount, setSendAmount] = useState<string>('');
  const [sendToken, setSendToken] = useState<Token | null>(null);
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [receiveToken, setReceiveToken] = useState<Token | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isCalculatingSendAmount, setIsCalculatingSendAmount] = useState<boolean>(false);
  const [isCalculatingReceiveAmount, setIsCalculatingReceiveAmount] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const isDisabled = !sendAmount || sendAmount === '0' || !sendToken || !receiveToken || sendToken.currency === receiveToken.currency;

  const calculateSendAmount = (amount: string, fromToken: Token, toToken: Token) => {
    setIsCalculatingSendAmount(true);
    calculateSwapAmount(amount, toToken, fromToken)
      .then((res) => {
        setSendAmount(res);
      })
      .finally(() => {
        setIsCalculatingSendAmount(false);
      });
  }
  const calculateReceiveAmount = (amount: string, fromToken: Token, toToken: Token) => {
    setIsCalculatingReceiveAmount(true);
    calculateSwapAmount(amount, fromToken, toToken)
      .then((res) => {
        setReceiveAmount(res);
      }).finally(() => {
        setIsCalculatingReceiveAmount(false);
      });
  }
  const debouncedCalculateSendAmount = useCallback(debounce(calculateSendAmount, 300), []);
  const debouncedCalculateReceiveAmount = useCallback(debounce(calculateReceiveAmount, 300), []);

  return (
    <>
      <h5>Swap</h5>

      <p>{message}</p>

      <form>
        <label>Amount to send</label>
        <TokenInput
          amount={sendAmount}
          token={sendToken}
          loading={isCalculatingSendAmount}
          onAmountChange={(amount) => {
            setSendAmount(amount);
            if (sendToken && receiveToken) {
              debouncedCalculateReceiveAmount(amount, sendToken, receiveToken);
            }
          }}
          onTokenChange={(token) => {
            setSendToken(token);
            if (sendAmount && receiveToken) {
              calculateReceiveAmount(sendAmount, token, receiveToken);
            }
          }}
        />

        <label>Amount to receive</label>
        <TokenInput 
          amount={receiveAmount}
          token={receiveToken}
          loading={isCalculatingReceiveAmount}
          onAmountChange={(amount) => {
            setReceiveAmount(amount);
            if (sendToken && receiveToken) {
              debouncedCalculateSendAmount(amount, receiveToken, sendToken);
            }
          }}
          onTokenChange={(token) => {
            setReceiveToken(token);
            if (sendAmount && sendToken) {
              calculateReceiveAmount(sendAmount, sendToken, token);
            }
          }}
        />

        <button 
          type="button"
          disabled={isDisabled}
          className={isSwapping ? 'loading' : ''}
          onClick={() => {
            if (sendAmount && sendToken && receiveToken) {
              setIsSwapping(true);
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
                  setIsSwapping(false);
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
