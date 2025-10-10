import { useState, useRef, useEffect } from 'react'
import prices from '../prices.json';
import SimpleBar from 'simplebar-react';

import './TokenInput.scss';
import type { Token } from '../types';

function getTokenIconUrl(token: string) {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
}

function TokenInput({ 
  amount, 
  token, 
  loading,
  onAmountChange,
  onTokenChange
}: { 
  amount: string | number, 
  token: Token | null, 
  loading: boolean,
  onAmountChange: (amount: string) => void 
  onTokenChange: (token: Token) => void
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  // Filter tokens based on keyword
  const filteredPrices = prices.filter(t => t.currency.toLowerCase().includes(keyword.toLowerCase()));
  const pricesToShow = keyword ? filteredPrices : prices; 

  // Click outside to close dropdown
  const searchRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setKeyword('');
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`token-input ${loading ? 'loading' : ''}`}>
      <input
        value={amount} 
        onChange={e => {
          const value = e.target.value;

          // Allow only numbers and decimal points
          if (/^\d*\.?\d*$/.test(value)) {
            onAmountChange(value);
          }
          // Allow input starting with a decimal point
          else if (/^\.\d*$/.test(value)) {
            onAmountChange(value);
          }
        }} 
        type="text"
        placeholder="Enter token amount" 
        disabled={loading}
      />
      <div className={`token-input__select ${isDropdownOpen ? 'open' : ''}`} ref={menuRef}>
        <button 
          type="button" 
          onClick={() => {
            setIsDropdownOpen(!isDropdownOpen);
            setTimeout(() => {
              searchRef.current?.focus();
            }, 0);
          }}
          disabled={loading}
        >
          {token ? (
            <>
              <span className="token-input__name">{token.currency}</span>
              <img src={`${getTokenIconUrl(token.currency)}`} alt={token.currency} />
            </>
          ) : (
            'Select Token'
          )}
        </button>
        <input 
          ref={searchRef}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder='Search Token'
        />
        <SimpleBar 
          className="token-input__dropdown"
        >
          {pricesToShow
            .sort((a , b) => { return a.currency.toLowerCase() > b.currency.toLowerCase() ? 1 : -1})
            .map((token) => (
              <div
                key={token.currency}
                className="token-input__dropdown-item"
                onClick={() => {
                  onTokenChange(token);
                  setKeyword('');
                  setIsDropdownOpen(false);
                }}
              >
                <span className="token-input__name">{token.currency}</span>
                <img src={`${getTokenIconUrl(token.currency)}`} alt={token.currency} />
              </div>
            ))
          }
        </SimpleBar>
      </div>
    </div>
  );
}

export default TokenInput;