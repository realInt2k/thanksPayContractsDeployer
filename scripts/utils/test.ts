import * as path from 'path';
import * as fs from 'fs';
import { contractNameType } from '../types/contractNameType';
import { networkNameType } from '@scripts/types/networkNameType';
import { getTxDetails } from './getTxDetails';

function main () {
    const dir = path.join(__dirname, '../../transaction_log/new_contract/unsynced/');
    if (!fs.existsSync(dir)) {
        //console.log("Directory not exists");
        fs.mkdirSync(dir, { recursive: true });
    } else {
        console.log("Directory exists");
    }
}

main();