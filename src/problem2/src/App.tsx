import { useState, useCallback, useEffect } from 'react'
import debounce from 'just-debounce';
import BigNumber from "bignumber.js";
import './App.scss'
import 'simplebar-react/dist/simplebar.min.css';

import type { Balance } from './types/token';

import { swapToken, calculateSwapAmount } from './services/swap';
import { getBalance } from './services/balance';
import TokenInput from './components/token-input/TokenInput'

function App() {
  const [balance, setBalance] = useState<Balance>({});
  const [sendAmount, setSendAmount] = useState<string>('');
  const [sendToken, setSendToken] = useState<string>('');
  const [receiveAmount, setReceiveAmount] = useState<string>('');
  const [receiveToken, setReceiveToken] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isCalculatingSendAmount, setIsCalculatingSendAmount] = useState<boolean>(false);
  const [isCalculatingReceiveAmount, setIsCalculatingReceiveAmount] = useState<boolean>(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const availableBalance = balance[sendToken] || 0;
  const isMoreThanBalance = sendToken && Number(sendAmount) > availableBalance;
  const validationError = isMoreThanBalance ? 'Amount exceeds available balance' : '';

  const isDisabled = 
    !!validationError ||
    isCalculatingSendAmount ||
    isCalculatingReceiveAmount || 
    !sendAmount || 
    !sendToken || 
    !receiveAmount || 
    !receiveToken || 
    sendAmount === '0' || 
    sendToken === receiveToken;

  const calculateSendAmount = (amount: string, fromToken: string, toToken: string) => {
    setIsCalculatingSendAmount(true);
    calculateSwapAmount(amount, toToken, fromToken)
      .then((res) => {
        setSendAmount(res);
      })
      .catch(() => {
        setSendAmount('');
        setMessage({
          text: 'Failed to calculate send amount',
          type: 'error'
        });
      })
      .finally(() => {
        setIsCalculatingSendAmount(false);
      });
  }
  const calculateReceiveAmount = (amount: string, fromToken: string, toToken: string) => {
    setIsCalculatingReceiveAmount(true);
    calculateSwapAmount(amount, fromToken, toToken)
      .then((res) => {
        setReceiveAmount(res);
      })
      .catch(() => {
        setReceiveAmount('');
        setMessage({
          text: 'Failed to calculate send amount',
          type: 'error'
        });
      })
      .finally(() => {
        setIsCalculatingReceiveAmount(false);
      });
  }
  const debouncedCalculateSendAmount = useCallback(debounce(calculateSendAmount, 300), []);
  const debouncedCalculateReceiveAmount = useCallback(debounce(calculateReceiveAmount, 300), []);

  useEffect(() => {
    getBalance().then((bal) => {
      setBalance(bal);
    });
  }, []);

  return (
    <>
      <h5>Swap</h5>

      <p className={message?.type}>{message?.text}</p>

      <form>
        <label>Amount to send</label>
        {sendToken && <span className="balance">Balance: {BigNumber(availableBalance).decimalPlaces(6).toFixed()}</span>}
        <TokenInput
          amount={sendAmount}
          token={sendToken}
          loading={isCalculatingSendAmount}
          onAmountChange={(amount) => {
            setSendAmount(amount);
            if (sendToken && receiveToken) {
              setReceiveAmount('');
              debouncedCalculateReceiveAmount(amount, sendToken, receiveToken);
            }
          }}
          onTokenChange={(token) => {
            setSendToken(token);
            if (receiveToken && receiveAmount) {
              setSendAmount('');
              calculateSendAmount(receiveAmount, token, receiveToken);
            }
          }}
          error={validationError}
        />

        <label>Amount to receive</label>
        <TokenInput 
          amount={receiveAmount}
          token={receiveToken}
          loading={isCalculatingReceiveAmount}
          onAmountChange={(amount) => {
            setReceiveAmount(amount);
            if (sendToken && receiveToken) {
              setSendAmount('');
              debouncedCalculateSendAmount(amount, receiveToken, sendToken);
            }
          }}
          onTokenChange={(token) => {
            setReceiveToken(token);
            if (sendToken && sendAmount) {
              setReceiveAmount('');
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
              swapToken(sendAmount.toString(), sendToken, receiveToken)
                .then(() => {
                  setMessage({
                    text: 'Swap successful!',
                    type: 'success'
                  });
                  setSendAmount('');
                  setReceiveAmount('');
                  setSendToken('');
                  setReceiveToken('');
                  setBalance((prevBalance) => {
                    const newBalance = { ...prevBalance };
                    newBalance[sendToken] -= Number(sendAmount);
                    newBalance[receiveToken] = (newBalance[receiveToken] || 0) + Number(receiveAmount);
                    return newBalance;
                  });
                })
                .catch(() => {
                  setMessage({
                    text: 'Swap failed. Please try again.',
                    type: 'error'
                  });
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
