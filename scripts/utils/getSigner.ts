import contractAddresses from '../contractAddresses.json';
import { ethers } from 'ethers';
import { networkNameType } from '../types/networkNameType';

export const getProvider = (networkName: networkNameType) => {
    const providerName = contractAddresses[networkName]["network"]["provider"];
    const provider = new ethers.providers.JsonRpcProvider(providerName);
    return provider;
}
export const getSigner = (networkName: networkNameType) => {
    const provider = getProvider(networkName);
    const privateKey = contractAddresses[networkName]["network"]["key"];
    const signer = new ethers.Wallet(privateKey, provider);
    return signer;
}