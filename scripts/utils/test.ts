import * as path from 'path';
import * as fs from 'fs';
import { contractNameType } from '../types/contractNameType';
import { networkNameType } from '@scripts/types/networkNameType';
import { getTxDetails } from './getTxDetails';

function main () {
    const dir = path.join(__dirname, '../../transaction_log/new_contract/klaytn/synced/293.json');
    fs.writeFileSync(dir, JSON.stringify({a: 1}));
    
}

main();