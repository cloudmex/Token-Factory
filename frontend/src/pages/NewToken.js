/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Files from "react-files";
import Big from 'big.js';
import getConfig from '../config'
import { Contract } from 'near-api-js'
import ls from "local-storage";
import Swal from 'sweetalert2'
import DefaultTokenIcon from '../assets/img/default-token.jpg';

const { contractName } = getConfig(process.env.NODE_ENV || 'development')
const UploadResizeWidth = 96;
const UploadResizeHeight = 96;
const MaxU128 = Big(2).pow(128).sub(1);
const OneNear = Big(10).pow(24);
const TGas = Big(10).pow(12);
const BoatOfGas = Big(200).mul(TGas);
const fromYocto = (a) => a && Big(a).div(OneNear).toFixed(3);
const lsKey = contractName + ':v02:';
const lsKeyToken = lsKey + "token";
const lsKeyCreateToken = lsKey + "createToken";
const ValidAccountRe = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
const ValidTokenIdRe = /^[a-z\d]+$/;
const MinAccountIdLen = 2;
const MaxAccountIdLen = 64;

export default function NewToken() {
    const [allTokens, setTokens] = useState();
    const [newToken, setNewToken] = useState({ name: "", symbol: "", supply: 1000000000, decimal: 18 });
    const [iconToken, setIconToken] = useState(null);
    const [creatingToken, setCreatingToken] = useState(0);
    const [tokenAlreadyExists, setTokenAlreadyExists] = useState(false);
    const nameInput = React.createRef();
    const symbolInput = React.createRef();
    const supplyInput = React.createRef();
    const decimalInput = React.createRef();

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

        const ft = ls.get(lsKeyToken);
        if (ft) {
            const createToken = ls.get(lsKeyCreateToken);
            if (createToken) {
                ls.remove(lsKeyCreateToken);
                setCreatingToken(2);
                const requiredDeposit = await computeRequiredDeposit(ft);
                if (requiredDeposit.eq(0)) {
                    const tokenContract = new Contract(window.walletConnection.account(), contractName, {
                        changeMethods: ['create_token'],
                    });
                    await tokenContract.create_token({ args: ft }, BoatOfGas.toFixed(0));
                } else {
                    // Transaction was canceled.
                }
                ls.remove(lsKeyToken);
                window.location.href = `/MyTokens`
                setCreatingToken(0);
            }
        }
    }, []);

    const onChange = e => {
        e.preventDefault();
        setNewToken({ ...newToken, [e.target.name]: e.target.value });

        if (e.target.name === 'symbol') {
            if (isValidTokenId(e.target.value)) {
                const existToken = allTokens.filter((t) => t.metadata.symbol.toLowerCase() === e.target.value.toLowerCase())[0];
                if (existToken) {
                    setTokenAlreadyExists(true);
                } else {
                    setTokenAlreadyExists(false);
                }
            } else {
                setTokenAlreadyExists(true);
            }
        }
    }

    const onFilesChange = (f) => {
        let sourceImage = new Image();
        let reader = new FileReader();

        reader.readAsDataURL(f[0]);

        sourceImage.onload = () => {
            // Create a canvas with the desired dimensions
            let canvas = document.createElement("canvas");
            const aspect = sourceImage.naturalWidth / sourceImage.naturalHeight;
            const width = Math.round(UploadResizeWidth * Math.max(1, aspect));
            const height = Math.round(UploadResizeHeight * Math.max(1, 1 / aspect));
            canvas.width = UploadResizeWidth;
            canvas.height = UploadResizeHeight;
            const ctx = canvas.getContext("2d");

            // Scale and draw the source image to the canvas
            ctx.imageSmoothingQuality = "high";
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, UploadResizeWidth, UploadResizeHeight);
            ctx.drawImage(sourceImage, (UploadResizeWidth - width) / 2, (UploadResizeHeight - height) / 2, width, height);

            // Convert the canvas to a data URL in PNG format
            const options = [
                canvas.toDataURL('image/jpeg', 0.92),
                // Disabling webp because it doesn't work on iOS.
                // canvas.toDataURL('image/webp', 0.92),
                canvas.toDataURL('image/png')
            ];
            options.sort((a, b) => a.length - b.length);

            //   this.handleChange('tokenIconBase64', options[0]);
            setIconToken(options[0])

        }

        reader.onload = function (event) {
            sourceImage.src = event.target.result;
        };
    }

    const onFilesError = (e, f) => {
        console.log(e, f);
    }

    const computeRequiredDeposit = async (ft) => {
        const tokenContract = new Contract(window.walletConnection.account(), contractName, {
            changeMethods: ['get_required_deposit'],
        });

        return Big(await tokenContract.get_required_deposit({
            args: ft, account_id: window.walletConnection.account().accountId
        }));

    }

    const isValidTokenId = (tokenId) => {
        tokenId = tokenId.toLowerCase();
        return tokenId.match(ValidTokenIdRe) && isValidAccountId(tokenId + '.' + contractName);
    }

    const isValidAccountId = (accountId) => {
        return accountId.length >= MinAccountIdLen &&
            accountId.length <= MaxAccountIdLen &&
            accountId.match(ValidAccountRe);
    }

    const saveNewToken = async e => {
        e.preventDefault();
        newToken.decimal = parseInt(newToken.decimal)
        newToken.supply = parseInt(newToken.supply)

        newToken.supply = newToken.supply ? Big(newToken.supply) : Big(1);
        const dec = Big(10).pow(newToken.decimal);
        const intTotalSupply = newToken.supply.mul(dec).round(0, 0);
        if (intTotalSupply.lt(1)) {
            newToken.supply = Big(1)
        } else if (intTotalSupply.gt(MaxU128)) {
            newToken.supply = MaxU128.div(dec).round(0, 0);
        }

        const ft = {
            owner_id: window.walletConnection.account().accountId,
            total_supply: newToken.supply.mul(Big(10).pow(newToken.decimal)).round(0, 0).toFixed(0),
            metadata: {
                spec: "ft-1.0.0",
                name: newToken.name,
                symbol: newToken.symbol,
                icon: iconToken,
                decimals: newToken.decimal
            }
        }

        console.log(ft);
        setCreatingToken(1);

        const requiredDeposit = await computeRequiredDeposit(ft);

        setCreatingToken(0);

        Swal.fire({
            title: `Create ${ft.metadata.name}`,
            html: `
                <div style='display: flex; justify-content: center; margin-bottom:5px;'>
                    <img className="object-center object-cover rounded-full h-15 w-15" style="border-radius: 100%;" src=${ft.metadata.icon || DefaultTokenIcon} />
                </div>
                <div className="flex items-center mb-2">
                    <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600"></label>
                    <p>Issue a new token. It'll cost you <span className="font-weight-bold">${requiredDeposit ? fromYocto(requiredDeposit) : 0} Ⓝ</span></p>
                </div>
                `,
            showDenyButton: true,
            confirmButtonText: 'Create',
            confirmButtonColor: '#3b82f6',
            denyButtonText: `Don't create`,
            backdrop: 'rgba(0, 0, 0,0.5)'
        }).then(async (result) => {
            if (result.isConfirmed) {
                ls.set(lsKeyToken, ft);
                ls.set(lsKeyCreateToken, true);

                const tokenContract = new Contract(window.walletConnection.account(), contractName, {
                    changeMethods: ['storage_deposit'],
                });

                await tokenContract.storage_deposit({}, BoatOfGas.toFixed(0), requiredDeposit.toFixed(0));
            } else if (result.isDenied) {

            }
        })
    }

    useEffect(async () => {

    }, []);

    const content = (creatingToken === 2) ? (
        <div className="animate-bounce p-10 md:w-3/4  lg:w-1/2 mx-auto my-auto border border-blue-300 shadow rounded-md">
            <div className="text-center">Creating your token, please wait... <span className="spinner-grow spinner-grow-lg" role="status" aria-hidden="true"></span></div>
        </div>
    ) : (creatingToken === 1) ? (
        <div className="animate-bounce p-10 md:w-3/4  lg:w-1/2 mx-auto my-auto border border-blue-300 shadow rounded-md">
            <div className="text-center">Calculating creation cost... <span className="spinner-grow spinner-grow-lg" role="status" aria-hidden="true"></span></div>
        </div>
    ) :
        (
            <div className="p-10 md:w-3/4 bg-NewGray lg:w-1/2 mx-auto my-auto">
                <div className="flex items-center mb-2">
                    <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Name</label>
                    <input ref={nameInput} onChange={onChange} type="text" id="TokenName" name="name" placeholder="Epic Moon Rocket" className="flex-1 py-2 focus:border-green-400 text-gray-500 placeholder-gray-400 outline-none border-solid border border-InputBorderBlue bg-InputBackgroundBlue" />
                </div>
                <div className={(tokenAlreadyExists) ? "flex items-center" : "flex items-center mb-2"}>
                    <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Symbol</label>
                    <input ref={symbolInput} onChange={onChange} type="text" id="TokenSymbol" name="symbol" placeholder="MOON" className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-500 placeholder-gray-400 outline-none border-solid border border-InputBorderBlue bg-InputBackgroundBlue" />
                </div>
                {tokenAlreadyExists && (
                    <div className="flex items-center mb-2">
                        <label className="inline-block w-20 mr-6 text-right font-bold text-gray-600"></label>
                        <small className="inline-block mr-6 text-right font-bold text-Error">Token Symbol is invalid or already exists.</small>
                    </div>
                )}
                <div className="flex items-center mb-2">
                    <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Total Supply</label>
                    <input ref={supplyInput} onChange={onChange} type="number" id="TotalSupply" name="supply" placeholder="1000000000" value={newToken.supply} className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-500 placeholder-gray-400 outline-none border-solid border border-InputBorderBlue bg-InputBackgroundBlue" />
                </div>
                <div className="flex items-center mb-2">
                    <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Decimal</label>
                    <input ref={decimalInput} onChange={onChange} type="number" id="TokenDecimal" name="decimal" placeholder="18" value={newToken.decimal} className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-500 placeholder-gray-400 outline-none border-solid border border-InputBorderBlue bg-InputBackgroundBlue" />
                </div>
                <div className="flex items-center mb-2">
                    <label htmlFor="number" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Icon</label>
                    <div className="form-group">
                        <div className="input-group">
                            <div>
                                <Files
                                    id="tokenIcon"
                                    className='form-control form-control-large btn btn-outline-primary'
                                    onChange={(f) => onFilesChange(f)}
                                    onError={(e, f) => onFilesError(e, f)}
                                    multiple={false}
                                    accepts={['image/*']}
                                    minFileSize={1}
                                    clickable
                                >
                                    Click to upload Token Icon
                                </Files>
                            </div>
                            <div className="ml-3">
                                {iconToken && (
                                    <img className="rounded token-icon" style={{ marginRight: '1em' }} src={iconToken} alt="Token Icon" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <button className="py-3 px-8 bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs rounded" onClick={saveNewToken} disabled={tokenAlreadyExists || newToken.name === '' || newToken.symbol === '' || newToken.supply === '' || newToken.supply <= 0 || newToken.decimal === ''  || newToken.decimal <= 0}>Create Token</button>
                </div>
            </div>
        );

    return (
        content
    );

}