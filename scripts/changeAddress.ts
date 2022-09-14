import contractAddresses from '@scripts/contractAddresses.json';
import * as fs from 'fs';
contractAddresses["THANKS_PAY_CHECK_ADDR"] = "fuck u";
console.log(contractAddresses);

fs.writeFileSync('./contractAddresses.json', JSON.stringify(contractAddresses, null, 2));