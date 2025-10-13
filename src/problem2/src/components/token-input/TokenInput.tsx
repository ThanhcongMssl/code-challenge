import { useState, useRef, useEffect, useMemo } from 'react'
import currencies from './currencies.json';
import SimpleBar from 'simplebar-react';

import './TokenInput.scss';

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
  amount: string, 
  token: string, 
  loading: boolean,
  onAmountChange: (amount: string) => void 
  onTokenChange: (currency: string) => void
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');

  // Filter tokens based on keyword
  const filteredCurrencies = useMemo(() => 
    currencies.filter((currency: string) => currency.toLowerCase().includes(keyword.toLowerCase()))
  , [keyword, currencies]);

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
              <span className="token-input__name">{token}</span>
              <img src={`${getTokenIconUrl(token)}`} alt={token} />
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
          {filteredCurrencies
            .sort((a , b) => { return a.toLowerCase() > b.toLowerCase() ? 1 : -1})
            .map((currency) => (
              <div
                key={currency}
                className="token-input__dropdown-item"
                onClick={() => {
                  onTokenChange(currency);
                  setKeyword('');
                  setIsDropdownOpen(false);
                }}
              >
                <span className="token-input__name">{currency}</span>
                <img src={`${getTokenIconUrl(currency)}`} alt={currency} />
              </div>
            ))
          }
        </SimpleBar>
      </div>
    </div>
  );
}

export default TokenInput;