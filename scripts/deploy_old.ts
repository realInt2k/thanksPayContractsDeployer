// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { ethers } from "hardhat";
import Web3 from "web3";
import * as dotenv from "dotenv";
//import {ThanksPaySuperType, ThanksPaySecurity} from "./types/contractType";
//import * as fs from "fs";
//import changeEnv, { changeSubgraphYaml } from "./changeEnvAddress";

//const filepath = "./logs";
dotenv.config();
console.log(__dirname + './contractAddresses.json');
import contractAddresses from './contractAddresses.json';
import * as fs from 'fs';
import { Signer } from "@ethersproject/abstract-signer";
dotenv.config();
console.log(__dirname + './contractAddresses.json');

import { getNetworkName } from "./utils/getNetworkName";
import { networkNameType } from "./types/networkNameType";

const networkName = getNetworkName(process);

async function main(networkName: networkNameType) {
  // We get the contract to deploy
  console.log("DEPLOYING TO "+ networkName);
  
  const uri = contractAddresses[networkName]["network"]["provider"];
  const web3 = new Web3(uri);
  const nearByBlock = await web3.eth.getBlockNumber();
  
  
  let Platoon: any;
  let soldier: any;

  var getContractFactory;
  var authorizedAddresses;
  const networkInfo = contractAddresses[networkName]["network"];
  const provider = new ethers.providers.JsonRpcProvider(networkInfo["provider"]);
  const private_key = networkInfo["key"];
  const wallet = new ethers.Wallet(private_key, provider);
  getContractFactory = (contractName: string) => {return ethers.getContractFactory(contractName, wallet)};
  
  authorizedAddresses = [wallet.address];
  
  Platoon = await getContractFactory("oldThanks");
  soldier = await Platoon.deploy();
//  const thanksPayRelayAddr = soldier.address;
  contractAddresses[networkName]["OLD_THANKS_ADDR"] = soldier.address;
  
  console.log("OldThanks deployed to:", soldier.address);

  console.log("\nNearbyBlock is ", nearByBlock);
  fs.writeFileSync(__dirname + '/contractAddresses.json', JSON.stringify(contractAddresses, null, 2));

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(networkName as networkNameType).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
