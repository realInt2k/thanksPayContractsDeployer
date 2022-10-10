import * as path from 'path';
import * as fs from 'fs';
import { contractNameType } from '../types/contractNameType';
import { networkNameType } from '@scripts/types/networkNameType';
import { getTxDetails } from './getTxDetailsUtil';

export const writeToTxLog = (
    txData: any,
    contractName: contractNameType,
    nonce: any,
    destinationNetwork: networkNameType,
    functionName: string) => {
    
    const details = {
        txData: txData,
        contractName: (contractName as contractNameType),
        functionName: functionName,
    };

    // write fs into "../../transaction_log/unsynced/"
    const dir = path.join(__dirname, '../../transaction_log/new_contract/',destinationNetwork,'/unsynced/');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        const dir2 = path.join(__dirname, '../../transaction_log/new_contract/',destinationNetwork,'synced/');
        if(!fs.existsSync(dir2)) {
            fs.mkdirSync(dir2, { recursive: true });
        }
    };
    const filename = nonce + '.json';
    const filepath = path.join(dir, filename);
    // console.log("file path is: ", filepath);
    // write details into filename with fs
    fs.writeFileSync(filepath, JSON.stringify(details));
}

// just for OLD contract
export const writeReceiptTxLog = async (
    receipt: any,
    txData: any,
    contractName: contractNameType,
    functionName: string,
    networkName: networkNameType,
    nonce: any,
) => {
    // write fs into "../../transaction_log/unsynced/"
    const details = await getTxDetails(receipt, networkName);
    const file = {
        txData: txData,
        contractName: (contractName as contractNameType),
        functionName: functionName,
        moneyDetails: details.values.money,
        networkName: networkName,
    }

    const dir = path.join(__dirname, '../../transaction_log/old_contract/',networkName,'/synced/');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    };
    const filename = nonce + '.json';
    const filepath = path.join(dir, filename);

    // write details into filename with fs
    fs.writeFileSync(filepath, JSON.stringify(file));
}