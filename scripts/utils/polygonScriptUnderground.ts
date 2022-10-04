import { getTxDetails } from "./getTxDetails";
import * as fs from "fs";
const path = require("path");
import { getSigner, getProvider } from "./getSigner";
import contractAddresses from '../contractAddresses.json';
import { networkNameType } from "@scripts/types/networkNameType";
import { contractNameType } from '../types/contractNameType';
import { SuccessReturn } from "@scripts/types/returnType";

const NETWORKNAME:networkNameType = "polygonTest";

/**
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 */
function readFilesSync(dir: any) {
  const files: any[] = [];

  fs.readdirSync(dir).forEach((filename) => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    const content = fs.readFileSync(path.join(dir, filename), "utf8");
    const JSONcontent = JSON.parse(content);

    if (isFile)
      files.push({
        name,
        txData: JSONcontent.txData,
        contractName: JSONcontent.contractName,
        functionName: JSONcontent.functionName
      });
  });

  files.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return files;
}

async function main() {
  const provider = getProvider(NETWORKNAME);
  const signer = getSigner(NETWORKNAME);
  const account = signer.address;
  while(1) {
    console.log("_____new interval polygon___")
    const nextNonce = await provider.getTransactionCount(account, "latest");
    const files = readFilesSync(
      __dirname + "../../../transaction_log/new_contract/"+NETWORKNAME+"/unsynced/"
    );
    for (let i = 0; i < files.length; i++) {
      const thisNonce = nextNonce + i;
      console.log(thisNonce);
      const fileName = files[i].name;
      var file = (files[i]);

      const contractName = file.contractName;
      const functionName = file.functionName;
      const data = file.txData;
      const targetContract = contractAddresses[NETWORKNAME as networkNameType][contractName as contractNameType];

      const tx = {
        from: account,
        to: targetContract,
        nonce: thisNonce,
        data: data,
      };

      try {
        const sentTx = await signer.sendTransaction(tx);
        const receipt = await sentTx.wait();
        const details = await getTxDetails(receipt, NETWORKNAME as networkNameType) as SuccessReturn;
        const moneyDetails = details.values.money;
        
        file["moneyDetails"] = moneyDetails;
        file["networkName"] = NETWORKNAME;
        file["functionName"] = functionName;
        
        
      } catch (e:any) {
        // ignore
        console.log("NO MONEY ????");
        return;
      }
      // save file 
      const filePath = __dirname + "../../../transaction_log/new_contract/"+NETWORKNAME+"/synced/" + fileName + ".json";
      fs.writeFileSync(filePath, JSON.stringify(file));

      // delete the old file
      const oldFilePath = __dirname + "../../../transaction_log/new_contract/"+NETWORKNAME+"/unsynced/" + fileName + ".json";
      fs.unlinkSync(oldFilePath);
    }
    await delay(2000);
  }
}

function delay(time:number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

main().then(() => console.log(""));