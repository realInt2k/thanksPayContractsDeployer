import { expect } from "chai";
import { ethers, Contract } from 'ethers';
import * as dotenv from "dotenv";
import ABI from '../../../packages/shared/BLOCK_CHAIN_THINGS/abis/LeagueMaker.json';

dotenv.config();
const ownerAcc = "0xed835a425fb8d5beA9c2c7fD202f637B3B95d3f8";
export const privateKeysVM = [
];

export type ConnectionType  = {
  contract: ethers.Contract | null,
  accountAddress: string | null,
};

export const connectAsOwner = async (): Promise<ConnectionType | null> => {
  try {
    const uri = process.env.NEXT_PUBLIC_NODE_ENV === "develop" ? 
      process.env.NEXT_PUBLIC_GANACHE_TEST_URL as string : 
      process.env.NEXT_PUBLIC_BNB_TEST_URL as string;
    const provider = new ethers.providers.JsonRpcProvider(uri);
    const privateKey = process.env.NEXT_PUBLIC_NODE_ENV === "develop" ? 
      process.env.NEXT_PUBLIC_GANACHE_PRIVATE_KEY as string :
      process.env.NEXT_PUBLIC_BNBTESTNET_PRIVATE_KEY as string;
    const signer = new ethers.Wallet(privateKey, provider);
    const accountAddr = await signer.getAddress();
    const contractWithSigner = new ethers.Contract(
      process.env.NEXT_PUBLIC_BNB_TEST_LM_ADDRESS as string, // this shit is global
      ABI,
      signer
    );
    return {
      contract: contractWithSigner,
      accountAddress: accountAddr,
    };
  } catch {
    console.error("failed to connect as owner");
    return null;
  }
};

export const connectAsUserWithPrivateKey = async (privateKey: string) => {
  try {
    // same rpc provider
    const uri = process.env.NEXT_PUBLIC_NODE_ENV === "develop" ? 
      process.env.NEXT_PUBLIC_GANACHE_TEST_URL as string : 
      process.env.NEXT_PUBLIC_BNB_TEST_URL as string;
    const provider = new ethers.providers.JsonRpcProvider(uri);
    const signer = new ethers.Wallet(privateKey, provider);
    const accountAddr = await signer.getAddress();
    const contractWithSigner = new ethers.Contract(
      process.env.NEXT_PUBLIC_BNB_TEST_LM_ADDRESS as string,
      ABI,
      signer
    );
    return {
      contract: contractWithSigner,
      accountAddress: accountAddr,
    };
  } catch {
    console.error("failed to connect as user");
    return null;
  }
}

