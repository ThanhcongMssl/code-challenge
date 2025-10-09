import { useState } from 'react'
import './App.css'
import 'simplebar-react/dist/simplebar.min.css';

import TokenInput from './components/TokenInput'

function App() {
  return (
    <>
      <h5>Swap</h5>

      <form action="">
        <label>Amount to send</label>
        <TokenInput onChange={(amount, token) => {
          console.log(amount, token);
        }}/>

        <label>Amount to receive</label>
        <TokenInput onChange={(amount, token) => {
          console.log(amount, token);
        }}/>

        <button type="button">CONFIRM SWAP</button>
      </form>
    </>
  )
}

export default App
