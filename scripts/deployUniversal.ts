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



export type networkNameType = "ganache" | "polygonTest" 

export async function deployContract(networkName: networkNameType, name: string, args: any[] | null) {
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
    contractAddresses[networkName]["THANKS_PAY_SECURITY_ADDR"] = soldier.address;
  } else if(name === "ThanksData") {
    contractAddresses[networkName]["THANKS_PAY_DATA_ADDR"] = soldier.address;
  } else if(name === "ThanksPayCheck") {
    contractAddresses[networkName]["THANKS_PAY_CHECK_ADDR"] = soldier.address;
  } else if(name === "thanksPayMain") {
    contractAddresses[networkName]["THANKS_PAY_MAIN_ADDR"] = soldier.address;
  } else if(name === "thanksPayRelay") {
    contractAddresses[networkName]["THANKS_PAY_RELAY_ADDR"] = soldier.address;
  }
  console.log(`${name} deployed to: ${soldier.address}`);
  return soldier.address;
}