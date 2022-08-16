import * as dotenv from "dotenv";
import "hardhat-abi-exporter";

import { HardhatUserConfig, task } from "hardhat/config";
import "hardhat-contract-sizer";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  //defaultNetwork:"bnb_test",
  defaultNetwork: process.env.NEXT_PUBLIC_NODE_ENV === "develop" ? "ganache" : "bnb_test",
  networks: {
    ganache: {
      url: "http://localhost:8545/",
      accounts:
        ["0x3fc1627209bee4dda790a4c02a2cd2af5ce28cbdf501023758b8dfbf662e8119"]
    },
    bnb_test: { //chapel I think
      url: process.env.NEXT_PUBLIC_BNB_TEST_URL || "",
      accounts:
        process.env.NEXT_PUBLIC_BNBTESTNET_PRIVATE_KEY !== undefined ? [process.env.NEXT_PUBLIC_BNBTESTNET_PRIVATE_KEY] : [],
    }
  },
  abiExporter: {
    path: process.env.abi_path,
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 2,
    pretty: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  }
};

export default config;
