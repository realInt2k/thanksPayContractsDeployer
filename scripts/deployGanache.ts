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

async function deployContract(name: string) {
  const Platoon = await ethers.getContractFactory(name);
  const soldier = await Platoon.deploy();
  await soldier.deployed();
  console.log(`${name} deployed to: ${soldier.address}`);
}

async function main() {
  const uri = process.env.NEXT_PUBLIC_GANACHE_TEST_URL || "the fuck?";
  const web3 = new Web3(uri);
  const nearByBlock = await web3.eth.getBlockNumber();
  await deployContract("thanksSecurity");
  await deployContract("thanksData");
  await deployContract("PartnerWon");
  await deployContract("WorkerWon");
  await deployContract("ThanksPay");
  console.log("\nNearbyBlock is ", nearByBlock);

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
