import contractAddresses from '../contractAddresses.json';
import { ethers } from 'ethers';
import {contractNameType} from '../types/contractNameType';
import { networkNameType } from '../types/networkNameType';
import { getSigner, getProvider } from './getSignerUtil';


// Creating a transaction param

// ONLY for calling POLYGON

export const sendRawTxData = async (
    networkName: networkNameType,
    data: string,
    contractName: contractNameType,
    nonce: number,
    )  => {
    
    const signer = getSigner(networkName);
    const provider = getProvider(networkName);
    const account = signer.address;

    const targetContract = contractAddresses[networkName][contractName];
    
    const tx = {
        from: account,
        to: targetContract,
        nonce: await provider.getTransactionCount(account, "latest"),
        data: data
        // gasLimit: ethers.utils.hexlify(10000),
        // gasPrice: ethers.utils.hexlify(parseInt(ethers.utils.await provider.getGasPrice())),
    };

    signer.sendTransaction(tx).then((transaction:any) => {
        console.dir(transaction);
        alert("Send finished!");
    });
}

