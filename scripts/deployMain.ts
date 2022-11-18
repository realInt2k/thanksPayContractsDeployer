import { ethers } from "hardhat";
import { ThanksPaySecurity } from "./types/contractType";
import { getNetworkName } from "./utils/getNetworkName";
import { networkNameType } from "./types/networkNameType";
import Web3 from "web3";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();
import contractAddresses from "./contractAddresses.json";

const networkName = getNetworkName(process);

const SLEEPMS = 2000;

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
  var private_key: string = "";
  if(process.env.ENVIRONMENT == "development") {
    private_key = networkInfo["key"];
  }
  else {
    if(networkName == "klaytnMainnet") {
      if(process.env.KEY_KLAYTN_MAINNET === undefined) {
        console.log("ERROR, need klaytn mainnet private key")
        return;
      }
      private_key = process.env.KEY_KLAYTN_MAINNET;
    } else
    if(networkName == "polygonMainnet") {
      if(process.env.KEY_POLYGON_MAINNET === undefined) {
        console.log("ERROR, need polygon mainnet private key")
        return;
      }
      private_key = process.env.KEY_POLYGON_MAINNET;
    }
  }

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

  await sleep(SLEEPMS);

  Platoon = await getContractFactory("ThanksData");
  soldier = await Platoon.deploy(thanksPaySecurityAddr);
  const thanksPayDataAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_DATA_ADDR"] = soldier.address;
  console.log("ThanksData deployed to:", soldier.address);

  await sleep(SLEEPMS);

  Platoon = await getContractFactory("ThanksPayCheck");
  soldier = await Platoon.deploy(thanksPayDataAddr, thanksPaySecurityAddr);
  const thanksPayCheckAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_CHECK_ADDR"] = soldier.address;
  console.log("ThanksPayCheck deployed to:", soldier.address);

  await sleep(SLEEPMS);

  Platoon = await getContractFactory("ThanksPayMain");
  soldier = await Platoon.deploy(
    thanksPaySecurityAddr,
    thanksPayDataAddr,
    thanksPayCheckAddr
  );
  const thanksPayMainAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_MAIN_ADDR"] = soldier.address;
  console.log("ThanksPayMain deployed to:", soldier.address);

  await sleep(SLEEPMS);

  Platoon = await getContractFactory("ThanksPayRelay");
  soldier = await Platoon.deploy();
  const thanksPayRelayAddr = soldier.address;
  contractAddresses[networkName]["THANKS_PAY_RELAY_ADDR"] = soldier.address;

  Platoon = await getContractFactory("oldThanks");
  soldier = await Platoon.deploy();
  //  const thanksPayRelayAddr = soldier.address;
  contractAddresses[networkName]["OLD_THANKS_ADDR"] = soldier.address;

  console.log("OldThanks deployed to:", soldier.address);

  await sleep(SLEEPMS);

  console.log("\nNearbyBlock is ", nearByBlock);
  fs.writeFileSync(
    __dirname + "/contractAddresses.json",
    JSON.stringify(contractAddresses, null, 2)
  );

  await sleep(SLEEPMS);
  
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


function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}