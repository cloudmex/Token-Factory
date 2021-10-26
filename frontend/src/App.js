import 'regenerator-runtime/runtime'
import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { login, logout } from './utils'
import "./App.css";
import './styles/style1.css'
import Navbar from './components/Navbar';

import MyTokens from './pages/MyTokens';
import NewToken from './pages/NewToken';
import Tokens from './pages/Tokens';

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  const [newToken, setNewToken] = useState({ name: "", symbol: "", supply: 1000000000, decimal: 18 });
  const [fileName, setFileName] = useState(null);

  const onChange = e => {
    e.preventDefault();
    setNewToken({ ...newToken, [e.target.name]: e.target.value });
  }

  const onChangeFile = e => {
    setFileName(e.target.files[0]);
  }

  const saveNewToken = e => {
    e.preventDefault();
    newToken.supply = parseInt(newToken.supply);
    newToken.decimal = parseInt(newToken.decimal)
    console.log(newToken);
    console.log(fileName);
  }

  React.useEffect(
    () => {
      console.log(window.walletConnection)
    },
    []
  )

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main style={{ color: "black" }}>
        <h1>Welcome to TOKEN FACTORY</h1>
        <p>
          In order to create your own fungible token, you need to sign in. The button below will sign you in using NEAR Wallet.
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 relative bg-background z-10">
          <Navbar/>
        </div>
        <Switch>
          <Route exact path="/" component={Tokens} />
          <Route exact path="/MyTokens" component={MyTokens} />
          <Route exact path="/NewToken" component={NewToken} />
          <Route exact path="/Tokens" component={Tokens} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
    </>
  )
}
