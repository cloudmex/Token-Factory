/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import DefaultTokenIcon from '../assets/img/default-token.jpg';
import getConfig from '../config'
import { Contract } from 'near-api-js'
import Big from 'big.js';
import Swal from 'sweetalert2'

const { contractName } = getConfig(process.env.NODE_ENV || 'development')
const TGas = Big(10).pow(12);
const BoatOfGas = Big(200).mul(TGas);
const StorageDeposit = Big(125).mul(Big(10).pow(19));

export default function Tokens() {
    const [allTokens, setTokens] = useState();

    useEffect(async () => {
        if (window.walletConnection.isSignedIn()) {

            window.contract.get_number_of_tokens()
                .then(numTokens => {
                    window.contract.get_tokens({ from_index: 0, limit: numTokens })
                        .then(tokens => {
                            setTokens(tokens);
                        })
                })
        }
    }, []);

    const registerToken = async (tokenId) => {
        const tokenContractId = tokenId.toLowerCase() + '.' + contractName;
        const tokenContract = new Contract(window.walletConnection.account(), tokenContractId, {
            changeMethods: ['storage_deposit'],
        });
        await tokenContract.storage_deposit({
            registration_only: true,
        }, BoatOfGas.toFixed(0), StorageDeposit.toFixed(0));

    }

    const showDataToken = (token) => {
        Swal.fire({
            title: '',
            html:`
                <div style='display: flex; justify-content: center; margin-bottom:5px;'>
                    <img className="object-center object-cover rounded-full h-15 w-15" style="border-radius: 100%;" src=${token.metadata.icon || DefaultTokenIcon} />
                </div>
                <div style='text-align: center;'>
                    <div><b>Name:</b> <span>${token.metadata.name}</span></div>
                    <div><b>Symbol:</b> <span>${token.metadata.symbol}</span></div>
                    <div><b>Owner:</b> <span>${token.owner_id}</span></div>
                    <div><b>Supply:</b> <span>${Big(token.total_supply).div(Big(10).pow(token.metadata.decimals)).round(0, 0).toFixed(0)}</span></div>
                </div>
                `,
            allowOutsideClick: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Close',
            confirmButtonColor: '#ff4a17',
            backdrop: 'rgba(0, 0, 0,0.5)'
          });
    }

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-8">
            {allTokens ? allTokens.map((token) => (
                <div key={token.metadata.symbol} className="w-4/5 h-2/3 bg-NewGray rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center mx-auto">
                    <div className="mb-2 mt-2 cursor-pointer" onClick={() => showDataToken(token)}>
                        <img className="object-center object-cover rounded-full h-15 w-15" src={token.metadata.icon || DefaultTokenIcon} alt="icon"/>
                    </div>
                    <div className="text-center cursor-pointer" onClick={() => showDataToken(token)}>
                        <p className="text-xl text-NearBlack font-bold mb-2">{token.metadata.name}</p>
                        {/* <p className="text-base text-NearBlack font-normal">{token.metadata.symbol}</p> */}
                    </div>
                    <div className="mb-2">
                        <button className="bg-MenuOptionSelect text-white font-bold px-3 text-xs rounded" onClick={() => registerToken(token.metadata.symbol)}>
                            Add to NEAR<br/>Wallet
                        </button>
                    </div>
                </div>
            )) : ''}
        </div>
    );
}
