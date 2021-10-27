import 'regenerator-runtime/runtime'
import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { login, logout } from './utils'
import "./App.css";
import Navbar from './components/Navbar';
import NearIcon from './assets/img/near_icon.png';
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

    },[]
  )

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <div className="pt-5">
        <div className="w-2/3 h-2/3 bg-NewGray rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center mx-auto">
          <div className="mb-2 mt-2">
            <img className="object-center object-cover rounded-full h-12 w-12" src={NearIcon} />
          </div>
          <div className="mb-2 mt-2">
            <p className="text-xl text-NearBlack font-bold mb-2">Welcome to TOKEN FACTORY</p>
          </div>
          <div className="text-center mb-2">
            <p className="text-base text-NearBlack font-normal">In order to create your own fungible token, you need to sign in. The button below will sign you in using NEAR Wallet.</p>
          </div>
          <div className="mb-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 text-xs rounded py-1" onClick={login}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 relative bg-background z-10">
          <Navbar />
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
