import * as path from 'path';
import * as fs from 'fs';
import { contractNameType } from '../types/contractNameType';
import { networkNameType } from '@scripts/types/networkNameType';
import { getTxDetails } from './getTxDetailsUtil';
import { getProvider, getSigner } from './getSignerUtil';
import ganacheAccount from '@scripts/contractAddresses.json';
import Web3 from 'web3';
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    ganacheAccount['ganache']['network']['provider'],
  ),
);

async function main() {
  const provider = getProvider('ganache');
  const signer = getSigner('ganache');
  const account = signer.address;
  const nextNonce = await provider.getTransactionCount(account, 'latest');
  console.log(nextNonce);
  const shit = await web3.eth.getTransactionFromBlock(nextNonce, 0);
  console.log(shit);
}

main();
