import { sendRawTxData } from "./sendRawTxData";
import * as fs from "fs";
const path = require("path");
import { getSigner, getProvider } from "./getSigner";
import contractAddresses from '../contractAddresses.json';
import { networkNameType } from "@scripts/types/networkNameType";
import { contractNameType } from '../types/contractNameType';

const NETWORKNAME = "polygonTest";

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
      });
  });

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    // https://stackoverflow.com/a/38641281
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
    console.log("_____new interval___")
    const nextNonce = await provider.getTransactionCount(account, "latest");
    const files = readFilesSync(
      __dirname + "../../../transaction_log/unsynced/"
    );
    for (let i = 0; i < files.length; i++) {
      const thisNonce = nextNonce + i;
      console.log(thisNonce);
      const file = files[i];
      const contractName = file.contractName;
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
        console.log("receipt", receipt.transactionHash);
      } catch (e:any) {
        // ignore
        console.log("NO MONEY ????");
        return;
      }

      // move file to synced folder
      const oldPath = __dirname + "../../../transaction_log/unsynced/" + file.name + ".json";
      const newPath = __dirname + "../../../transaction_log/synced/" + file.name + ".json";
      fs.renameSync(oldPath, newPath);
    }
    await delay(2000);
  }
}

function delay(time:number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

main().then(() => console.log(""));
