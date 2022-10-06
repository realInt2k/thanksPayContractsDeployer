import { sendRawTxData } from './utils/sendRawTxDataUtil';

import * as fs from 'fs';
import * as path from "path";


const location = path.resolve(__dirname, "../scripts/types/rawTxData/stuff512.json");
const obj = JSON.parse(fs.readFileSync(location, 'utf8'));

sendRawTxData("polygonTest", obj.txData, obj.contractName).then(() => {console.log("Done!")});