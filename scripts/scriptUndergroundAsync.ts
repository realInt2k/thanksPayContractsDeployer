import * as fs from 'fs';
const path = require('path');
import {
  getTxDetails,
  getSigner,
  getProvider,
  getNetworkName,
  writeToTxLog,
  getTransactionCount,
} from '@scripts/utils';
import contractAddresses from './contractAddresses.json';
import { networkNameType } from '@scripts/types/networkNameType';
import { contractNameType } from '@scripts/types/contractNameType';
import { SuccessReturn } from '@scripts/types/returnType';
import Web3 from 'web3';

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

export const makingTheTransactionLogFolder = async () => {
  const unsyncedDirKlaytn = path.join(
    __dirname,
    '../transaction_log/new_contract/klaytn/unsynced/',
  );

  const unsyncedDirPolygon = path.join(
    __dirname,
    '../transaction_log/new_contract/polygonTest/unsynced/',
  );

  const syncedDirKlaytn = path.join(
    __dirname,
    '../transaction_log/new_contract/klaytn/synced/',
  );

  const syncedDirPolygon = path.join(
    __dirname,
    '../transaction_log/new_contract/polygonTest/synced/',
  );

  if (!fs.existsSync(unsyncedDirKlaytn)) {
    fs.mkdirSync(unsyncedDirKlaytn, { recursive: true });
  }
  if (!fs.existsSync(unsyncedDirPolygon)) {
    fs.mkdirSync(unsyncedDirPolygon, { recursive: true });
  }
  if (!fs.existsSync(syncedDirKlaytn)) {
    fs.mkdirSync(syncedDirKlaytn, { recursive: true });
  }
  if (!fs.existsSync(syncedDirPolygon)) {
    fs.mkdirSync(syncedDirPolygon, { recursive: true });
  }
}

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
    ganacheContractAddr['THANKS_PAY_DATA_ADDR'].toLowerCase()
  ) {
    return 'THANKS_PAY_DATA_ADDR';
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
// currently testing with klaytn
export const syncMissingTransactionIfAny = async () => {
  const unsyncedDirKlaytn = path.join(
    __dirname,
    '../transaction_log/new_contract/klaytn/unsynced/',
  );
  // const unsyncedDirPolygon = path.join(
  //   __dirname,
  //   '../transaction_log/new_contract/polygon/unsynced/',
  // );
  if (!fs.existsSync(unsyncedDirKlaytn)
    //  || !fs.existsSync(unsyncedDirPolygon)
  ) {
    console.log(
      'syncMissingTransactionIfAny: transaction_log folder for real network not found',
    );
    return -1;
  }

  const unsyncedFilesKlaytn = readFilesSync(unsyncedDirKlaytn);
  // const unsyncedFilesPolygon = readFilesSync(unsyncedDirPolygon);

  const ganacheEndNonce = (await getTransactionCount('ganache')) - 1; // n.o transactions - 1
  const ganacheStartNonce: any =
    contractAddresses['ganache']['network']['startBlock'] - 1; // first transaction after deployment
  const klaytnEndNonce = (await getTransactionCount('klaytn')) - 1; // n.o transactions - 1
  const klaytnStartNonce: any =
    contractAddresses['klaytn']['network']['startBlock'] - 1; // first transaction after deployment
  if (
    klaytnStartNonce === 'undefined' ||
    ganacheStartNonce === 'undefined' ||
    klaytnEndNonce === undefined ||
    ganacheEndNonce === undefined
  ) {
    console.log({
      error: {
        klaytnStartNonce,
        klaytnEndNonce,
        ganacheStartNonce,
        ganacheEndNonce
      }
    });
    return -1;
  } else {
    console.log({
      success: {
        klaytnStartNonce,
        klaytnEndNonce,
        ganacheStartNonce,
        ganacheEndNonce
      }
    });
  }

  const nonceDiff =
    ganacheEndNonce - ganacheStartNonce - (klaytnEndNonce - klaytnStartNonce);
  if (nonceDiff > 0) {
    const signer = getSigner('ganache');
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        contractAddresses['ganache']['network']['provider'],
      ),
    );
    for (
      let nonce = ganacheEndNonce;
      nonce >= ganacheEndNonce - nonceDiff + 1;
      nonce--
    ) {
      // get hash from ganache with nonce
      const transaction = await web3.eth.getTransactionFromBlock(nonce, 0);
      if(transaction.to === null || transaction.to === undefined) {
        continue;
      }
      //console.log(transaction, " ", getNetworkNameFromAddr(transaction.to as string));
      // write to unsynced folder
      writeToTxLog(
        transaction.input,
        getNetworkNameFromAddr(transaction.to as string),
        nonce,
        'klaytn',
        'unknown',
      );
    }
  }
  return 1;
};

export const runTransactionBackGround = async (
  NETWORKNAME: networkNameType,
) => {
  const provider = getProvider(NETWORKNAME);
  const signer = getSigner(NETWORKNAME);
  const account = signer.address;
  while (1) {
    await delay(5000);
    //console.log(`_____new interval ${NETWORKNAME}___`);
    const nextNonce = await provider.getTransactionCount(account, 'latest');
    const fileDir = path.join(
      __dirname,
      '../transaction_log/new_contract/' + NETWORKNAME + '/unsynced/',
    );
    if (!fs.existsSync(fileDir)) {
      continue;
    }

    // avoid sending transaction.
    const toBeSyncedFilePath = path.join(
      __dirname,
      '../transaction_log/new_contract/' + NETWORKNAME + '/synced/',
    );
    if (!fs.existsSync(toBeSyncedFilePath)) {
      continue;
    }

    const unSyncFilePath = path.join(
      __dirname,
      '../transaction_log/new_contract/' + NETWORKNAME + '/unsynced/',
    );
    if (!fs.existsSync(unSyncFilePath)) {
      continue;
    }

    const files = readFilesSync(path.join(fileDir));
    /**
     * First write the nonce back to the file.
     * So if it gets interrupted, the nonce will either be written or
     * not written to the file.
     *
     * Then, read the file again. Only send transaction when the nonce is
     * presented.
     */
    for (let i = 0; i < files.length; i++) {
      const thisNonce = nextNonce + i;
      console.log(`${NETWORKNAME} nonce: ${thisNonce}`);
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
        console.log('NO MONEY ????', e);
        return;
      }

      // save file
      fs.writeFileSync(
        path.join(toBeSyncedFilePath, fileName + '.json'),
        JSON.stringify(file),
      );

      // delete the old file
      const unSyncFilePathWithFileName = path.join(
        __dirname,
        '../transaction_log/new_contract/' +
          NETWORKNAME +
          '/unsynced/' +
          fileName +
          '.json',
      );
      if (!fs.existsSync(unSyncFilePathWithFileName)) {
        logger(
          'unSyncFilePathWithFileName should be synced but somehow not found in directory to be deleted',
        );
        continue;
      } // expected impossible
      fs.unlinkSync(unSyncFilePathWithFileName);
      console.log("SENT!!");
      //logger(`${NETWORKNAME} synced ${thisNonce}`);
    }
  }
};

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
