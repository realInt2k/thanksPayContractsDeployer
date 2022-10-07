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
        console.log('NO MONEY ????');
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

      //logger(`${NETWORKNAME} synced ${thisNonce}`);
    }
  }
};

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
