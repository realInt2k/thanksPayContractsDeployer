import * as path from 'path';
import * as fs from 'fs';
import { contractNameType } from '../types/contractNameType';

export const writeToTxLog = (txData: any, contractName: contractNameType, nonce: any) => {
    const details = {
        txData: txData,
        contractName: (contractName as contractNameType),
    };

    // write fs into "../../transaction_log/unsynced/"
    const dir = path.join(__dirname, '../../transaction_log/unsynced/');
    const filename = nonce + '.json';
    const filepath = path.join(dir, filename);

    // write details into filename with fs
    fs.writeFileSync(filepath, JSON.stringify(details));
}