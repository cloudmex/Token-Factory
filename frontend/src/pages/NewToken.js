/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Files from "react-files";
import Big from 'big.js';

const UploadResizeWidth = 96;
const UploadResizeHeight = 96;
const MaxU128 = Big(2).pow(128).sub(1);

export default function NewToken() {
    const [newToken, setNewToken] = useState({ name: "", symbol: "", supply: 1000000000, decimal: 18 });
    const [iconToken, setIconToken] = useState(null)
    const nameInput = React.createRef();
    const symbolInput = React.createRef();
    const supplyInput = React.createRef();
    const decimalInput = React.createRef();

    const onChange = e => {
        e.preventDefault();
        setNewToken({ ...newToken, [e.target.name]: e.target.value });
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

    const saveNewToken = e => {
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

    }

    useEffect(async () => {

    }, []);

    return (
        <div className="p-10 md:w-3/4 bg-NewGray lg:w-1/2 mx-auto my-auto">
            <div className="flex items-center mb-2">
                <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Name</label>
                <input ref={nameInput} onChange={onChange} type="text" id="TokenName" name="name" placeholder="Epic Moon Rocket" className="flex-1 py-2  focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
            </div>
            <div className="flex items-center mb-2">
                <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Symbol</label>
                <input ref={symbolInput} onChange={onChange} type="text" id="TokenSymbol" name="symbol" placeholder="MOON" className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
            </div>
            <div className="flex items-center mb-2">
                <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Total Supply</label>
                <input ref={supplyInput} onChange={onChange} type="number" id="TotalSupply" name="supply" placeholder="1000000000" value={newToken.supply} className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
            </div>
            <div className="flex items-center mb-2">
                <label htmlFor="name" className="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Decimal</label>
                <input ref={decimalInput} onChange={onChange} type="number" id="TokenDecimal" name="decimal" placeholder="18" value={newToken.decimal} className="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
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
                <button className="py-3 px-8 bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs rounded" onClick={saveNewToken}>Create Token</button>
            </div>
        </div>
    );
}