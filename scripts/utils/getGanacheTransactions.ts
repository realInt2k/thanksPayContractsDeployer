import * as path from 'path';
import * as fs from 'fs';
import { getProvider, getSigner } from '@scripts/utils';
import ganacheAccount from '@scripts/contractAddresses.json';
import Web3 from 'web3';

const NETWORK = 'ganache';

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    ganacheAccount[NETWORK]['network']['provider'],
  ),
);

/**
 *
 * Make sure ganache transactions are fully captured
 */

const getReceiptFromBlock = async (blockNumber: number) => {
  const shit = await web3.eth.getTransactionFromBlock(blockNumber, 0);
  const hash = shit.hash;
  const receipt = await web3.eth.getTransactionReceipt(hash);
  return shit;
};

const checkIfUnsyncedIsUTD = async () => {
  const provider = getProvider(NETWORK);
  const signer = getSigner(NETWORK);
  const account = signer.address;

  const noTransactions = await provider.getTransactionCount(account, 'latest');

  for (let i = noTransactions; i > noTransactions - 2; i--) {
    const receipt = await getReceiptFromBlock(i);
    console.log(receipt);
  }
};

checkIfUnsyncedIsUTD();
