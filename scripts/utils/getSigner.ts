import contractAddresses from '../contractAddresses.json';
import { ethers } from 'ethers';
import { networkNameType } from '../types/networkNameType';

import * as dotenv from "dotenv";
dotenv.config();

export const getProvider = (networkName: networkNameType) => {
    const providerName = contractAddresses[networkName]["network"]["provider"];
    const provider = new ethers.providers.JsonRpcProvider(providerName);
    return provider;
}
export const getSigner = (networkName: networkNameType) => {
    const provider = getProvider(networkName);
    let privateKey = "";
    if(process.env.ENVIRONMENT == "development") {
        privateKey = contractAddresses[networkName]["network"]["key"];;
    }
    else {
        if(networkName == "klaytnMainnet") {
            if(process.env.KEY_KLAYTN_MAINNET === undefined) {
            console.log("ERROR, need klaytn mainnet private key")
            return;
            }
            privateKey = process.env.KEY_KLAYTN_MAINNET;
        } else
        if(networkName == "polygonMainnet") {
            if(process.env.KEY_POLYGON_MAINNET === undefined) {
            console.log("ERROR, need polygon mainnet private key")
            return;
            }
            privateKey = process.env.KEY_POLYGON_MAINNET;
        }
    }

    const signer = new ethers.Wallet(privateKey, provider);
    return signer;
}