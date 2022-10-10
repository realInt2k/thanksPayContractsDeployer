import { getSigner } from "@scripts/utils";
import Web3 from 'web3';
import { networkNameType } from '../types/networkNameType';
import contractAddresses from '@scripts/contractAddresses.json';


export const getTransactionCount = async (networkName: networkNameType) => {
  const signer = getSigner(networkName);
  const account = signer.address;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      contractAddresses[networkName]['network']['provider'],
    ),
  );
  const getTransactionCount = await web3.eth.getTransactionCount(account, 'latest');
  return getTransactionCount;
}