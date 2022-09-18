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


const arg = process.argv[2]; // ["networkName=ganache"]
const networkName = arg.split("=")[1]; // "ganache"

console.log(networkName, process.argv);


export type networkNameType = "ganache" | "polygonTest";

function getGanacheFactory() {
  return (contractName: string) => {
    return ethers.getContractFactory(contractName)
  };
}

function getPolygonFactory(wallet: any) {
  return (contractName: string) => {
    return ethers.getContractFactory(contractName, wallet)
  };
}



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

  if (networkName=="polygonTest"){
    const networkInfo = contractAddresses[networkName]["network"];
    
    const provider = new ethers.providers.JsonRpcProvider(networkInfo["provider"]);
    const private_key = networkInfo["key"];
    const wallet = new ethers.Wallet(private_key, provider);
    getContractFactory = getPolygonFactory(wallet);
    authorizedAddresses = [wallet.address];
  } else {
    getContractFactory = getGanacheFactory();
    authorizedAddresses = ["0xed835a425fb8d5bea9c2c7fd202f637b3b95d3f8"];
  }
  
  Platoon = await getContractFactory("ThanksSecurity");
  const thanksSecuritySoldier = await Platoon.deploy(authorizedAddresses);
  const thanksPaySecurityAddr = thanksSecuritySoldier.address;
  contractAddresses[networkName]["THANKS_PAY_SECURITY_ADDR"] = thanksSecuritySoldier.address;
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
  soldier = await Platoon.deploy(thanksPaySecurityAddr, thanksPayDataAddr, thanksPayCheckAddr);
  const thanksPayMainAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_MAIN_ADDR"] = soldier.address;
  console.log("ThanksPayMain deployed to:", soldier.address);

  Platoon = await getContractFactory("ThanksPayRelay");
  soldier = await Platoon.deploy();
  const thanksPayRelayAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_RELAY_ADDR"] = soldier.address;
  
  console.log("ThanksPayRelay deployed to:", soldier.address);

  console.log("\nNearbyBlock is ", nearByBlock);
  fs.writeFileSync(__dirname + '/contractAddresses.json', JSON.stringify(contractAddresses, null, 2));

  // authorize all the smart contract
  
  await thanksSecuritySoldier.authorize([thanksPaySecurityAddr, thanksPayDataAddr, thanksPayCheckAddr, thanksPayMainAddr, thanksPayRelayAddr]);
  /*const fileContent = ThanksPay.address + '\n';
  if (fs.existsSync(filepath)) {
    fs.appendFileSync(filepath, fileContent);
  } else {
    fs.writeFile(filepath, fileContent, (err) => {
      if (err) throw err;
    });
  }*/
  // console.log("written address to file logs");
  // changeEnv(
  //   ["NEXT_PUBLIC_BNB_TEST_LM_ADDRESS", "NEXT_PUBLIC_BNB_TEST_LM_ADDRESS", "NEXT_PUBLIC_BNB_TEST_LM_ADDRESS", "NEXT_PUBLIC_BNB_TEST_LM_ADDRESS"],
  //   [LM.address, LM.address, LM.address, LM.address],
  //   [__dirname + "/../.env", __dirname + "/../../packages/shared/.env",
  //   __dirname + "/../../packages/admin/.env", __dirname + "/../../packages/client/.env"]
  // );
  // changeSubgraphYaml(LM.address, nearByBlock, __dirname + "/../subgraph.yaml");
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(networkName as networkNameType).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
