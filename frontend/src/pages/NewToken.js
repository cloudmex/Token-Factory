/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';

export default function NewToken() {

    useEffect(async () => {

    }, []);

    return (
        <>
            <div class="p-10 md:w-3/4 bg-NewGray lg:w-1/2 mx-auto my-auto">
                <div class="flex items-center mb-2">
                    <label for="name" class="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Name</label>
                    <input type="text" id="TokenName" name="TokenName" placeholder="Epic Moon Rocket" class="flex-1 py-2  focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
                </div>
                <div class="flex items-center mb-2">
                    <label for="name" class="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Symbol</label>
                    <input type="text" id="TokenSymbol" name="TokenSymbol" placeholder="MOON" class="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
                </div>
                <div class="flex items-center mb-2">
                    <label for="name" class="inline-block w-20 mr-6 text-right font-bold text-gray-600">Total Supply</label>
                    <input type="number" id="TotalSupply" name="TotalSupply" placeholder="1000000000" class="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
                </div>
                <div class="flex items-center mb-2">
                    <label for="name" class="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Decimal</label>
                    <input type="number" id="TokenDecimal" name="TokenDecimal" placeholder="18" class="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
                </div>
                <div class="flex items-center mb-2">
                    <label for="number" class="inline-block w-20 mr-6 text-right font-bold text-gray-600">Token Icon</label>
                    <input type="file" id="TokenIcon" name="TokenIcon" placeholder="Token Icon" class="flex-1 py-2 border-b-2 border-gray-400 focus:border-green-400 text-gray-200 placeholder-gray-400 outline-none" />
                </div>
                <div class="text-right">
                    <button class="py-3 px-8 bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs rounded">Create Token</button>
                </div>
            </div>
        </>
    );
}