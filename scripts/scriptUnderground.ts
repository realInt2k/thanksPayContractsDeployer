import * as fs from 'fs';
const path = require('path');
import {
  getTxDetails,
  getSigner,
  getProvider,
  getNetworkName,
} from '@scripts/utils';
import contractAddresses from './contractAddresses.json';
import { networkNameType } from '@scripts/types/networkNameType';
import { contractNameType } from '@scripts/types/contractNameType';
import { SuccessReturn } from '@scripts/types/returnType';
import Web3 from 'web3';
import { writeToTxLog } from './utils/writeToTransactionLogUtil';
import e from 'express';
import ganacheAccount from '@scripts/contractAddresses.json';

const logger = (data: any) => {
  const dir = path.join(
    __dirname,
    '../transaction_log/backGroundScriptLog.txt',
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.appendFileSync(dir, data);
};

const NETWORKNAME: networkNameType = getNetworkName(process);

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

    const content = fs.readFileSync(path.join(dir, filename), 'utf8');
    const JSONcontent = JSON.parse(content);

    if (isFile)
      files.push({
        name,
        txData: JSONcontent.txData,
        contractName: JSONcontent.contractName,
        functionName: JSONcontent.functionName,
      });
  });

  files.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });

  return files;
}

const getNetworkNameFromAddr = (addr: string): contractNameType => {
  const ganacheContractAddr = contractAddresses['ganache'];
  if (
    addr.toLowerCase() ===
    ganacheContractAddr['THANKS_PAY_MAIN_ADDR'].toLowerCase()
  ) {
    return 'THANKS_PAY_MAIN_ADDR';
  } else if (
    addr.toLowerCase() ===
    ganacheContractAddr['THANKS_PAY_MAIN_ADDR'].toLowerCase()
  ) {
    return 'THANKS_PAY_MAIN_ADDR';
  } else if (
    addr.toLowerCase() ===
    ganacheContractAddr['THANKS_PAY_SECURITY_ADDR'].toLowerCase()
  ) {
    return 'THANKS_PAY_SECURITY_ADDR';
  } else if (
    addr.toLowerCase() ===
    ganacheContractAddr['THANKS_PAY_RELAY_ADDR'].toLowerCase()
  ) {
    return 'THANKS_PAY_RELAY_ADDR';
  } else if (
    addr.toLowerCase() ===
    ganacheContractAddr['THANKS_PAY_CHECK_ADDR'].toLowerCase()
  ) {
    return 'THANKS_PAY_CHECK_ADDR';
  } else if (
    addr.toLowerCase() === ganacheContractAddr['OLD_THANKS_ADDR'].toLowerCase()
  ) {
    return 'OLD_THANKS_ADDR';
  }
  // unreachable!!!!
  return 'OLD_THANKS_ADDR';
};


/** TIS FUNCTION WILL ONLY BE CALLED ONCE
 *  EVERYTIME THE SERVER IS UP
 * 
 * x1 = get startBlock from ganache
 * y1 = get startBlock from klaytn
 * 
 * x2 = get endBlock from ganache
 * y2 = get endBlock from klaytn
 * 
 * if(x2 - x1 > y2 - y1) 
 *  it means that klaytn is slower by diff = (x2 - x1) - (y2 - y1) blocks
 *  So, we go from nonce x2 - 1 ->  x2 - diff of ganache,
 *    and write it to unsynced folder (it it is not there in the first place)
 * 
 */

// INCASE ganache writting to unsynced get cut off
export const syncMissingTransactionIfAny = async () => {
  const unsyncedDirKlaytn = path.join(
    __dirname,
    '../transaction_log/new_contract/klaytn/unsynced/',
  );
  const syncedDirKlaytn = path.join(
    __dirname,
    '../transaction_log/new_contract/klaytn/synced/',
  );
  const unsyncedDirPolygon = path.join(
    __dirname,
    '../transaction_log/new_contract/polygon/unsynced/',
  );
  const syncedDirPolygon = path.join(
    __dirname,
    '../transaction_log/new_contract/polygon/synced/',
  );
  if (
    !fs.existsSync(unsyncedDirKlaytn) ||
    !fs.existsSync(syncedDirKlaytn) ||
    !fs.existsSync(unsyncedDirPolygon) ||
    !fs.existsSync(syncedDirPolygon)
  ) {
    console.log(
      'syncMissingTransactionIfAny: transaction_log folder for real network not found',
    );
    return -1;
  }

  const unsyncedFilesKlaytn = readFilesSync(unsyncedDirKlaytn);
  const unsyncedFilesPolygon = readFilesSync(unsyncedDirPolygon);
  const syncedFilesKlaytn = readFilesSync(syncedDirKlaytn);
  const syncedFilesPolygon = readFilesSync(syncedDirPolygon);
  const klaytnFiles = syncedFilesKlaytn.concat(unsyncedFilesKlaytn);
  const polygonFiles = syncedFilesPolygon.concat(unsyncedFilesPolygon);

  const provider = getProvider('ganache');
  const signer = getSigner('ganache');
  const account = signer.address;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      contractAddresses['ganache']['network']['provider'],
    ),
  );
  const ganacheEndNonce =
    (await provider.getTransactionCount(account, 'latest')) - 1; // n.o transactions - 1
  const ganacheStartNonce =
    contractAddresses['ganache']['network']['startBlock']; // first transaction after deployment
  for (let nonce = ganacheStartNonce; nonce <= ganacheEndNonce; nonce++) {
    // ignore deployment in future deployment
    const transaction = await web3.eth.getTransactionFromBlock(nonce, 0);
    if (transaction.to === null) {
      continue;
    }
    if (
      klaytnFiles.find((file) => file.name === nonce.toString()) === undefined
    ) {
      // const transaction = await web3.eth.getTransactionFromBlock(nonce, 0);
      // const hash = transaction.hash;
      // const receipt = await web3.eth.getTransactionReceipt(hash);
      // write to unsynced folder
      writeToTxLog(
        transaction.input,
        getNetworkNameFromAddr(transaction.to as string),
        nonce,
        'klaytn',
        'unknown',
      );
    }
    if (
      polygonFiles.find((file) => file.name === nonce.toString()) === undefined
    ) {
      // const transaction = await web3.eth.getTransactionFromBlock(nonce, 0);
      // const hash = transaction.hash;
      // const receipt = await web3.eth.getTransactionReceipt(hash);
      // write to unsynced folder
      writeToTxLog(
        transaction.input,
        getNetworkNameFromAddr(transaction.to as string),
        nonce,
        'polygonTest',
        'unknown',
      );
      // send to polygon
    }
  }
  return 1;
};

async function main(NETWORKNAME: networkNameType) {
  const provider = getProvider(NETWORKNAME);
  const signer = getSigner(NETWORKNAME);
  const account = signer.address;
  while (1) {
    await delay(5000);
    //console.log(`_____new interval ${NETWORKNAME}___`)
    const nextNonce = await provider.getTransactionCount(account, 'latest');
    const fileDir = path.join(
      __dirname,
      '../transaction_log/new_contract/' + NETWORKNAME + '/unsynced/',
    );
    if (!fs.existsSync(fileDir)) {
      continue;
    }
    const files = readFilesSync(path.join(fileDir));
    for (let i = 0; i < files.length; i++) {
      const thisNonce = nextNonce + i;
      //console.log(thisNonce);
      const fileName = files[i].name;
      var file = files[i];

      const contractName = file.contractName;
      const functionName = file.functionName;
      const data = file.txData;
      const targetContract =
        contractAddresses[NETWORKNAME as networkNameType][
          contractName as contractNameType
        ];

      const tx = {
        from: account,
        to: targetContract,
        nonce: thisNonce,
        data: data,
      };

      try {
        const sentTx = await signer.sendTransaction(tx);
        const receipt = await sentTx.wait();
        const details = (await getTxDetails(
          receipt,
          NETWORKNAME as networkNameType,
        )) as SuccessReturn;
        const moneyDetails = details.values.money;

        file['moneyDetails'] = moneyDetails;
        file['networkName'] = NETWORKNAME;
        file['functionName'] = functionName;
      } catch (e: any) {
        // ignore
        console.log('NO MONEY ????');
        return;
      }
      // save file
      const filePath = path.join(
        __dirname,
        '../transaction_log/new_contract/' +
          NETWORKNAME +
          '/synced/' +
          fileName +
          '.json',
      );
      if (!fs.existsSync(filePath)) continue;
      fs.writeFileSync(filePath, JSON.stringify(file));

      // delete the old file
      const oldFilePath = path.join(
        __dirname,
        '../transaction_log/new_contract/' +
          NETWORKNAME +
          '/unsynced/' +
          fileName +
          '.json',
      );
      if (!fs.existsSync(oldFilePath)) continue;
      fs.unlinkSync(oldFilePath);

      logger(`${NETWORKNAME} synced ${thisNonce}`);
    }
  }
}

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

main(NETWORKNAME).then(() => {
  logger(`${NETWORKNAME} terminated`);
});
