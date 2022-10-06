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
import contractAddresses from "./../contractAddresses.json";
import * as fs from "fs";
import path from "path";
import { Signer } from "@ethersproject/abstract-signer";
import { ThanksPaySecurity } from "@scripts/classes";
import { getNetworkName } from "../utils/getNetworkNameUtil";
import { networkNameType } from "./../types/networkNameType";

const networkName = getNetworkName(process);

async function main(networkName: networkNameType) {
  // We get the contract to deploy
  console.log("DEPLOYING TO " + networkName);

  const uri = contractAddresses[networkName]["network"]["provider"];
  const web3 = new Web3(uri);
  const nearByBlock = await web3.eth.getBlockNumber();

  let Platoon: any;
  let soldier: any;

  var getContractFactory;
  var authorizedAddresses;
  const networkInfo = contractAddresses[networkName]["network"];
  const provider = new ethers.providers.JsonRpcProvider(
    networkInfo["provider"]
  );
  const private_key = networkInfo["key"];
  const wallet = new ethers.Wallet(private_key, provider);
  getContractFactory = (contractName: string) => {
    return ethers.getContractFactory(contractName, wallet);
  };

  authorizedAddresses = [wallet.address];

  Platoon = await getContractFactory("ThanksSecurity");
  const thanksSecuritySoldier = await Platoon.deploy();
  const thanksPaySecurityAddr = thanksSecuritySoldier.address;
  contractAddresses[networkName]["THANKS_PAY_SECURITY_ADDR"] =
    thanksSecuritySoldier.address;
  console.log("ThanksSecurity deployed to:", thanksSecuritySoldier.address);

  Platoon = await getContractFactory("ThanksData");
  soldier = await Platoon.deploy(thanksPaySecurityAddr);
  const thanksPayDataAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_DATA_ADDR"] = soldier.address;
  console.log("ThanksData deployed to:", soldier.address);

  Platoon = await getContractFactory("ThanksPayCheck");
  soldier = await Platoon.deploy(thanksPayDataAddr, thanksPaySecurityAddr);
  const thanksPayCheckAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_CHECK_ADDR"] = soldier.address;
  console.log("ThanksPayCheck deployed to:", soldier.address);

  Platoon = await getContractFactory("ThanksPayMain");
  soldier = await Platoon.deploy(
    thanksPaySecurityAddr,
    thanksPayDataAddr,
    thanksPayCheckAddr
  );
  const thanksPayMainAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_MAIN_ADDR"] = soldier.address;
  console.log("ThanksPayMain deployed to:", soldier.address);

  Platoon = await getContractFactory("ThanksPayRelay");
  soldier = await Platoon.deploy();
  const thanksPayRelayAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_RELAY_ADDR"] = soldier.address;

  Platoon = await getContractFactory("oldThanks");
  soldier = await Platoon.deploy();
  //  const thanksPayRelayAddr = soldier.address;
  contractAddresses[networkName]["OLD_THANKS_ADDR"] = soldier.address;

  console.log("OldThanks deployed to:", soldier.address);

  console.log("\nNearbyBlock is ", nearByBlock);
  fs.writeFileSync(
    path.join(__dirname, '../contractAddresses.json'),
    JSON.stringify(contractAddresses, null, 2)
  );

  // authorize all the smart contracts
  const thanksSecurity = new ThanksPaySecurity(networkName);
  await thanksSecurity.methods.authorize({
    contractAddresses: [
      thanksPayDataAddr,
      thanksPayCheckAddr,
      thanksPayMainAddr,
      thanksPayRelayAddr,
    ], 
    humanAddresses: [
      wallet.address
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(networkName as networkNameType).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
