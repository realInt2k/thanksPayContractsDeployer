// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import Web3 from "web3";
import * as dotenv from "dotenv";
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
  if(args !== null)
    soldier = await Platoon.deploy(... args);
  else
    soldier = await Platoon.deploy();
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
  const uri = "http://localhost:8545/";
  const web3 = new Web3(uri);
  const nearByBlock = await web3.eth.getBlockNumber();
  const authorizedAddresses = ["0xed835a425fb8d5bea9c2c7fd202f637b3b95d3f8"];
  const thanksPaySecurityAddr = await deployContract("ThanksSecurity", [authorizedAddresses]);
  const thanksPayDataAddr = await deployContract("ThanksData", [thanksPaySecurityAddr]);
  const thanksPayCheckAddr = await deployContract("ThanksPayCheck", [thanksPayDataAddr, thanksPaySecurityAddr]);
  const thanksPayMainAddr = await deployContract("ThanksPayMain", [thanksPaySecurityAddr, thanksPayDataAddr, thanksPayCheckAddr]);
  const thanksPayRelayAddr = await deployContract("ThanksPayRelay", null);
  console.log("\nNearbyBlock is ", nearByBlock);
  fs.writeFileSync(__dirname + '/contractAddresses.json', JSON.stringify(contractAddresses, null, 2));
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
