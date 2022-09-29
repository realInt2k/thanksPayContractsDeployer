import * as path from 'path';
import * as fs from 'fs';
import { contractNameType } from '../types/contractNameType';
import { networkNameType } from '@scripts/types/networkNameType';
import { getTxDetails } from './getTxDetails';

export const writeToTxLog = (
    txData: any,
    contractName: contractNameType,
    nonce: any) => {
    
    const details = {
        txData: txData,
        contractName: (contractName as contractNameType),
    };

    // write fs into "../../transaction_log/unsynced/"
    const dir = path.join(__dirname, '../../transaction_log/new_contract/unsynced/');
    const filename = nonce + '.json';
    const filepath = path.join(dir, filename);

    // write details into filename with fs
    fs.writeFileSync(filepath, JSON.stringify(details));
}

export const writeReceiptTxLog = async (
    receipt: any,
    txData: any,
    contractName: contractNameType,
    networkName: networkNameType,
    nonce: any,
) => {
    // write fs into "../../transaction_log/unsynced/"
    const details = await getTxDetails(receipt, networkName);
    const file = {
        txData: txData,
        contractName: (contractName as contractNameType),
        moneyDetails: details.values.money,
        networkName: networkName,
    }
    const dir = path.join(__dirname, '../../transaction_log/old_contract/synced/');
    const filename = nonce + '.json';
    const filepath = path.join(dir, filename);

    // write details into filename with fs
    fs.writeFileSync(filepath, JSON.stringify(receipt));
}