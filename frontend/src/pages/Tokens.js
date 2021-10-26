/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import DefaultTokenIcon from '../assets/img/default-token.jpg';
import getConfig from '../config'
import * as nearAPI from 'near-api-js';
const { contractName } = getConfig(process.env.NODE_ENV || 'development')

export default function Tokens() {
    const [allTokens, setTokens] = useState();

    useEffect(async () => {
        if (window.walletConnection.isSignedIn()) {

            window.contract.get_number_of_tokens()
                .then(numTokens => {
                    console.log(numTokens);
                    window.contract.get_tokens({ from_index: 0, limit: numTokens })
                        .then(tokens => {
                            setTokens(tokens);
                            setTimeout(_ => {
                                console.log(allTokens);
                            }, 1000)
                        })
                })
        }
    }, []);

    const registerToken = (tokenId) => {
        console.log(tokenId);
    }

    return (
        <div class="grid grid-cols-4 gap-2 place-content-stretch mt-8">
            {allTokens ? allTokens.map((token) => (
                <div key={token.metadata.symbol} class="w-2/3 h-2/3 bg-NewGray rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center mx-auto">
                    <div class="mb-2 mt-2">
                        <img class="object-center object-cover rounded-full h-15 w-15" src={token.metadata.icon || DefaultTokenIcon} />
                    </div>
                    <div class="text-center mb-2">
                        <p class="text-xl text-NearBlack font-bold mb-2">{token.metadata.name}</p>
                        <p class="text-base text-NearBlack font-normal">{token.metadata.symbol}</p>
                    </div>
                    <div className="mb-2">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-3 text-xs rounded" onClick={() => registerToken(token.metadata.symbol)}>
                            Add to NEAR Wallet
                        </button>
                    </div>
                </div>
            )) : ''}
        </div>
    );
}
