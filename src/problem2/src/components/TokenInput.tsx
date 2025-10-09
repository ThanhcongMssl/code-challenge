import { useState, useRef, useEffect } from 'react'
import prices from '../prices.json';
import SimpleBar from 'simplebar-react';

import './TokenInput.scss';

type Token = {
  currency: string, date: string, price: number
}


function getTokenIconUrl(token: string) {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
}

function TokenInput({ onChange }: { onChange: (amount: number, token: Token | null) => void }) {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onChange(Number(amount), selectedToken);
  }, [amount, selectedToken])

  return (
    <div className="token-input">
      <input 
        value={amount} 
        onChange={e => {
          const value = e.target.value;
          // Allow only numbers and decimal points
          if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
          }
          // Allow input starting with a decimal point
          else if (/^\.\d*$/.test(value)) {
            setAmount(value);
          }
          // Allow empty input
          else if (value === '') {
            setAmount(value);
          }
        }} 
        type="text" 
        placeholder="Enter token amount" 
      />
      <div className="token-input__select" ref={menuRef}>
      <button 
        type="button" 
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen)
        }}
      >
        {selectedToken ? (
          <>
            <span className="token-input__name">{selectedToken.currency}</span>
            <img src={`${getTokenIconUrl(selectedToken.currency)}`} alt={selectedToken.currency} />
          </>
        ) : (
          'Select Token'
        )}
      </button>
      <SimpleBar 
        className="token-input__dropdown"
        style={{
          visibility: isDropdownOpen ? 'visible' : 'hidden',
        }}
      >
        {prices.map((token) => (
          <div
            key={token.currency}
            className="token-input__dropdown-item"
            onClick={() => {
              setSelectedToken(token);
              setIsDropdownOpen(false);
            }}
          >
            <span className="token-input__name">{token.currency}</span>
            <img src={`${getTokenIconUrl(token.currency)}`} alt={token.currency} />
          </div>
        ))}
      </SimpleBar>
      </div>
      
    </div>
  );
}

export default TokenInput;