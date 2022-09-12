const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
var CryptoJS = require("crypto-js");

import thanksSecurityABI from '../abis/ThanksSecurity.json';
import thanksPayDataABI from '../abis/ThanksData.json';
import thanksPayABI from '../abis/ThanksPayMain.json';
import thanksRelayABI from '../abis/ThanksPayRelay.json';
import contractAddresses from '@scripts/contractAddresses.json';

// import thanksSecurityABI from "../../abis/ThanksSecurity.json";
// import thanksPayDataABI from "../../abis/ThanksData.json";
// import thanksPayMainABI from "../../abis/ThanksPayMain.json";
// import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
// import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";

var thanksPay;
describe("ThanksPay", function () {
  
  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(0);

      const uri = "http://localhost:8545/";
      const provider = new ethers.providers.JsonRpcProvider(uri);
      const privateKey = "0x3fc1627209bee4dda790a4c02a2cd2af5ce28cbdf501023758b8dfbf662e8119";
      const signer = new ethers.Wallet(privateKey, provider);

      // const thanksSecurityAddr = "0x112ace3e6c9254d49acce1e7f64ab925eca96af0";
      // const thanksPayDataAddr = "0x7f683960a27603dab905b3b8a3225367144366d6";
      // const thanksPayAddr = "0xf300e534d71456bc5b27da205d089b7f495b4eea";
      // const thanksRelayAddr = "0x5ee9fabc145284fee78e93cfd449ecdeefebdb95";

      const THANKS_PAY_MAIN_ADDR = contractAddresses["THANKS_PAY_MAIN_ADDR"];
      const THANKS_PAY_DATA_ADDR = contractAddresses["THANKS_PAY_DATA_ADDR"];
      const THANKS_PAY_SECURITY_ADDR = contractAddresses["THANKS_PAY_SECURITY_ADDR"];
      const THANKS_PAY_RELAY_ADDR = contractAddresses["THANKS_PAY_RELAY_ADDR"];
      const THANKS_PAY_CHECK_ADDR = contractAddresses["THANKS_PAY_CHECK_ADDR"];

      const thanksPaySecurity = new ethers.Contract(
        THANKS_PAY_SECURITY_ADDR,
        thanksSecurityABI,
        signer
      );
      const thanksPayMain = new ethers.Contract(
        THANKS_PAY_MAIN_ADDR,
        thanksPayABI,
        signer
      );
      const thanksPayData = new ethers.Contract(
        THANKS_PAY_DATA_ADDR,
        thanksPayDataABI,
        signer
      );
      const thanksPayRelay = new ethers.Contract(
        THANKS_PAY_RELAY_ADDR,
        thanksRelayABI,
        signer
      )

      //const { thanksPay, thanksPayData, thanksRelay} = contracts;
      // console.log("There are "+signers +" signers");
      const thanksPayInc = 0;
      const partner = 1;

      // register Eddy and a partner
      await thanksPayData.functions.registerPartner(thanksPayInc, 0);
      await thanksPayData.functions.registerPartner(partner, 0);

      // send 500K each.
      await thanksPayMain.functions.partnerAddBonus(partner, 500);
      await thanksPayMain.functions.partnerAddBalance(partner, 500);

      // register 10 workers, each with 100 money 
      for (let i = 0; i < 10; i++) {
        var index = 2 + i;
        var wId = index;
        await thanksPayData.functions.registerWorker(wId, partner, 100);
      }

      // view balances
      console.log("Partner thankspayable balance: ", await thanksPayData.functions.getPartnerThanksPayableBalance(partner));
      console.log("Partner withdrawable balance: ", await thanksPayData.functions.getPartnerWithdrawableBalance(partner));
      // console.log("Worker address: " + signers[2].address);
      console.log("Worker balance: ", await thanksPayData.functions.getWorkerBalance(3));

      // give them salary

      await thanksPayMain.functions.setLatestWagePay(partner, 100);

      console.log("Worker balance should be 100:", await thanksPayData.functions.getWorkerBalance(3));

      await thanksPayMain.functions.workerGetsThanksPay(3, partner, 40, "receipt", 101);

      console.log("Worker balance should be 60:", await thanksPayData.functions.getWorkerBalance(3));

      console.log("Partner thankspayable balance should be 960", await thanksPayData.functions.getPartnerThanksPayableBalance(partner));

      // await thanksPayRelay.functions.addProperty(1, [0, 1], ["Partner license", "Partner email"]);

      // var secret = "ThanksPay";

      // var license = CryptoJS.AES.encrypt("09-10-1009", secret);
      // var email = CryptoJS.AES.encrypt("partner@email.com", secret);
      //U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=

//      var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");

      // const tx = await thanksPayRelay.functions.setProperty(1, partner, [0, 1], [license.toString(), email.toString()]);
      // const receipt = await tx.wait();
      // // console.log( {
      // //   "receipt is ": receipt,
      // //   "tx is: ": tx
      // // });
      // for (const event of receipt.events) {
      //   console.log(`Event ${event.event} with args ${event.args}`);
      //   for(const i in event.args) {
      //     if(event.args[i].length) {
      //       console.log(event.args[i]);
      //       for(const j in event.args[i]) {
      //         const str = event.args[i][j];
      //         const decriptionBytes = CryptoJS.AES.decrypt(str, secret);
      //         const decription = decriptionBytes.toString(CryptoJS.enc.Utf8); 
      //         console.log({"encripted:: ": str, "decripted:: " : decription});
      //       }
      //     }
      //   }
      // }

    });

    it("Should change the balance correctly", async function () {
      
    });
  });
});