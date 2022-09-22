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
    ThanksPayMain,
    ThanksPayData,
    ThanksPayRelay,
    ThanksPayCheck,
    ThanksPaySecurity,
  } from "../scripts/types/contractType";
    import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";

  var thanksPay;
  const partnerId = 5;
  // const uri = "http://localhost:8545/";
  // const provider = new ethers.providers.JsonRpcProvider(uri);
  // const privateKey =
  //   "0x3fc1627209bee4dda790a4c02a2cd2af5ce28cbdf501023758b8dfbf662e8119";
  // const signer = new ethers.Wallet(privateKey, provider);
  
  describe("ThanksPay", function () {
    describe("Deployment", function () {
      it("Should create contract, the worker and the partner", async function () {
        this.timeout(0);
        const thanksPayMain = new ThanksPayMain("ganache");
        const thanksPayData = new ThanksPayData("ganache");
        const thanksPayRelay = new ThanksPayRelay("ganache");
        const thanksPayCheck = new ThanksPayCheck("ganache");
        const thanksPaySecurity = new ThanksPaySecurity("ganache");

  
        const workerId = Math.floor(Math.random() * 100);
        let registerPartnerArgs: ThanksPaySuperType["thanksPayData"]["registerPartner"] =
          {
            pId: partnerId,
            latestPay: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
          };
        await thanksPayData.methods.registerPartner(registerPartnerArgs);
        let setLatestWagePayArgs: ThanksPaySuperType["thanksPayMain"]["setLatestWagePay"] = {
          pId: partnerId,
          timestamp: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
        };
        await thanksPayMain.methods.setLatestWagePay(setLatestWagePayArgs);
      });
    });
  });
  
//   describe("deploy 10 workers", function () {
//     it("Should create 10 workers", async function () {
//       this.timeout(0);
//       let thanksPayDataClass = new ThanksPayData(signer);
//       for(let workerId = 1; workerId <= 10; ++workerId) {
//         const registerWorkerArgs: ThanksPaySuperType["thanksPayData"]["registerWorker"] =
//           {
//             wId: workerId,
//             pId: partnerId,
//             wage: 1000, // UNIT: whatever, doesn't matter
//           };
//         await thanksPayDataClass.method.registerWorker(registerWorkerArgs);
//       }
//       let thanksPayMainClass = new ThanksPayMain(signer);
//       const partnerAddBalanceArgs: ThanksPaySuperType["thanksPayMain"]["partnerAddBalance"] ={
//         pId: partnerId,
//         amount: 1000 * 5,
//         timestamp: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
//       }
//       await thanksPayMainClass.method.partnerAddBalance(partnerAddBalanceArgs);
//       await thanksPayMainClass.method.partnerAddBonus({
//         pId: partnerId,
//         amount: 1000 * 5,
//         timestamp: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
//       })
//     });
//   });
  
//   describe("workers get money", function() {
//     it("should let first 4 workers get money in a sequence", async function() {
//       this.timeout(0);
//       let thanksPayMainClass = new ThanksPayMain(signer);
//       for(let workerId = 1; workerId <= 4; ++workerId) {
//         const workerGetsThanksPayArgs: ThanksPaySuperType["thanksPayMain"]["workerGetsThanksPay"] = {
//           wId: workerId,
//           pId: partnerId,
//           amount: 30 + workerId,      
//           bankReceipt: workerId === 6 ? "goodjob, here's salary" : `F.U worker ${workerId} you're the worst`,
//           timestamp: 1663007999 + workerId,
//         };
//         await thanksPayMainClass.method.workerGetsThanksPay(workerGetsThanksPayArgs);
//       }
//     });
//   });
  