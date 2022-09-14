const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
var CryptoJS = require("crypto-js");

import thanksSecurityABI from "../abis/ThanksSecurity.json";
import thanksPayDataABI from "../abis/ThanksData.json";
import thanksPayABI from "../abis/ThanksPayMain.json";
import thanksRelayABI from "../abis/ThanksPayRelay.json";
import contractAddresses from "../scripts/contractAddresses.json";
import {
  ThanksPaySuperType,
  ThanksPayData,
  ThanksPayMain,
} from "../scripts/types/contractType";

var thanksPay;
const partnerId = 1;
const uri = "http://localhost:8545/";
const provider = new ethers.providers.JsonRpcProvider(uri);
const privateKey =
  "0x3fc1627209bee4dda790a4c02a2cd2af5ce28cbdf501023758b8dfbf662e8119";
const signer = new ethers.Wallet(privateKey, provider);

describe("ThanksPay", function () {
  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(0);
      const THANKS_PAY_MAIN_ADDR = contractAddresses["THANKS_PAY_MAIN_ADDR"];
      const THANKS_PAY_DATA_ADDR = contractAddresses["THANKS_PAY_DATA_ADDR"];
      const THANKS_PAY_SECURITY_ADDR =
        contractAddresses["THANKS_PAY_SECURITY_ADDR"];
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
      );

      const workerId = Math.floor(Math.random() * 100);
      let thanksPayDataClass = new ThanksPayData(signer);
      let registerPartnerArgs: ThanksPaySuperType["thanksPayData"]["registerPartner"] =
        {
          pId: partnerId,
          latestPay: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
        };
      await thanksPayDataClass.method.registerPartner(registerPartnerArgs);
      let thanksPayMainClass = new ThanksPayMain(signer);
      let setLatestWagePayArgs: ThanksPaySuperType["thanksPayMain"]["setLatestWagePay"] = {
        pId: partnerId,
        timestamp: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
      }
      await thanksPayMainClass.method.setLatestWagePay(setLatestWagePayArgs);
      // var secret = "ThanksPay";

      // var license = CryptoJS.AES.encrypt("09-10-1009", secret);
      // var email = CryptoJS.AES.encrypt("partner@email.com", secret);
      //  U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=

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
  });
});

describe("deploy 10 workers", function () {
  it("Should create 10 workers", async function () {
    this.timeout(0);
    // let thanksPayDataClass = new ThanksPayData(signer);
    // for(let workerId = 1; workerId <= 10; ++workerId) {
    //   const registerWorkerArgs: ThanksPaySuperType["thanksPayData"]["registerWorker"] =
    //     {
    //       wId: workerId,
    //       pId: partnerId,
    //       wage: 1000, // UNIT: whatever, doesn't matter
    //     };
    //   await thanksPayDataClass.method.registerWorker(registerWorkerArgs);
    // }
    // let thanksPayMainClass = new ThanksPayMain(signer);
    // const partnerAddBalanceArgs: ThanksPaySuperType["thanksPayMain"]["partnerAddBalance"] ={
    //   pId: partnerId,
    //   amount: 1000 * 5,
    //   timestamp: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
    // }
    // await thanksPayMainClass.method.partnerAddBalance(partnerAddBalanceArgs);
    // await thanksPayMainClass.method.partnerAddBonus({
    //   pId: partnerId,
    //   amount: 1000 * 5,
    //   timestamp: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
    // })
  });
});

// describe("workers get money", function() {
//   it("should let first 4 workers get money in a sequence", async function() {
//     this.timeout(0);
//     let thanksPayMainClass = new ThanksPayMain(signer);
//     for(let workerId = 1; workerId <= 4; ++workerId) {
//       const workerGetsThanksPayArgs: ThanksPaySuperType["thanksPayMain"]["workerGetsThanksPay"] = {
//         wId: workerId,
//         pId: partnerId,
//         amount: 30 + workerId,      
//         bankReceipt: workerId === 6 ? "goodjob, here's salary" : `F.U worker ${workerId} you're the worst`,
//         timestamp: 1663007999 + workerId,
//       };
//     }
//   });
// });
