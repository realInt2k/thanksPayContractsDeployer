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

async function deployContract(name: string, args: any[] | null) {
  const Platoon = await ethers.getContractFactory(name);
  let soldier:any;
  if(args !== null){
    console.log(...args)
    soldier = await Platoon.deploy(...args);
  }
  else {
    soldier = await Platoon.deploy();
  }
  await soldier.deployed();
  if(name === "ThanksSecurity") {
    contractAddresses["THANKS_PAY_SECURITY_ADDR"] = soldier.address;
  } else if(name === "ThanksData") {
    contractAddresses["THANKS_PAY_DATA_ADDR"] = soldier.address;
  } else if(name === "ThanksPayCheck") {
    contractAddresses["THANKS_PAY_CHECK_ADDR"] = soldier.address;
  } else if(name === "thanksPayMain") {
    contractAddresses["THANKS_PAY_MAIN_ADDR"] = soldier.address;
  } else if(name === "thanksPayRelay") {
    contractAddresses["THANKS_PAY_RELAY_ADDR"] = soldier.address;
  }
  console.log(`${name} deployed to: ${soldier.address}`);
  return soldier.address;
}

async function main() {
  console.log("DEPLOYING TO GANACHE");
  const uri = "http://localhost:8545/";
  const web3 = new Web3(uri);
  const nearByBlock = await web3.eth.getBlockNumber();
  const authorizedAddresses = ["0xed835a425fb8d5bea9c2c7fd202f637b3b95d3f8"];
  let Platoon: any;
  let soldier: any;
  
  Platoon = await ethers.getContractFactory("ThanksSecurity");
  const thanksSecuritySoldier = await Platoon.deploy(authorizedAddresses);
  const thanksPaySecurityAddr = thanksSecuritySoldier.address;
  contractAddresses["THANKS_PAY_SECURITY_ADDR"] = thanksSecuritySoldier.address;
  console.log("ThanksSecurity deployed to:", thanksSecuritySoldier.address);

  Platoon = await ethers.getContractFactory("ThanksData");
  soldier = await Platoon.deploy(thanksPaySecurityAddr);
  const thanksPayDataAddr = soldier.address;
  contractAddresses["THANKS_PAY_DATA_ADDR"] = soldier.address;
  console.log("ThanksData deployed to:", soldier.address);

  Platoon = await ethers.getContractFactory("ThanksPayCheck");
  soldier = await Platoon.deploy(thanksPayDataAddr, thanksPaySecurityAddr);
  const thanksPayCheckAddr = soldier.address;
  contractAddresses["THANKS_PAY_CHECK_ADDR"] = soldier.address;
  console.log("ThanksPayCheck deployed to:", soldier.address);

  Platoon = await ethers.getContractFactory("ThanksPayMain");
  soldier = await Platoon.deploy(thanksPaySecurityAddr, thanksPayDataAddr, thanksPayCheckAddr);
  const thanksPayMainAddr = soldier.address;
  contractAddresses["THANKS_PAY_MAIN_ADDR"] = soldier.address;
  console.log("ThanksPayMain deployed to:", soldier.address);

  Platoon = await ethers.getContractFactory("ThanksPayRelay");
  soldier = await Platoon.deploy();
  const thanksPayRelayAddr = soldier.address;
  contractAddresses["THANKS_PAY_RELAY_ADDR"] = soldier.address;
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
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
