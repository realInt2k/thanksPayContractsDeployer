const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
var CryptoJS = require("crypto-js");

import { SuccessReturn, ErrorReturn, ViewReturn } from "./types/returnType";
import {
  ThanksPayMain,
  ThanksPayData,
  ThanksPayRelay,
  ThanksPayCheck,
  ThanksPaySecurity,
} from "../scripts/types/contractType";
import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";
import { getMoney } from "../scripts/utils/getMoney";
import { getNetworkName } from "../scripts/utils/getNetworkName";
// import { networkNameType } from "./deploy";
import { networkNameType } from "./types/networkNameType";

const networkName = getNetworkName(process) as networkNameType;
console.log(networkName);

var thanksPay;
const partnerId = 2003;

describe("ThanksPay", function () {
  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(0);

      const thanksPayData = new ThanksPayData(networkName);
      const thanksPayRelay = new ThanksPayRelay(networkName);
      const thanksPayCheck = new ThanksPayCheck(networkName);
      const thanksPaySecurity = new ThanksPaySecurity(networkName);

      let registerPartnerArgs: ThanksPaySuperType["thanksPayData"]["registerPartner"] =
        {
          pId: partnerId,
          latestPay: 1663007942,
        };

      const result = await thanksPayData.methods.registerPartner(
        registerPartnerArgs
      );
      if (result.type == "success") {
        console.log("registered Partner: ", getMoney(result as SuccessReturn));
      } else {
        console.log("failed to register Partner");
      }

      let registerWorkerArgs: ThanksPaySuperType["thanksPayData"]["registerWorker"] =
        {
          wId: partnerId + 1,
          pId: partnerId,
          wage: 100,
          // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
        };
      const result2 = await thanksPayData.methods.registerWorker(
        registerWorkerArgs
      );
      //console.log(result2);
      if (result2.type == "success") {
        console.log("registered Worker: ", getMoney(result2 as SuccessReturn));
      } else {
        console.log("Register worker failed");
      }

      
      // const getWorkerArgs: ThanksPaySuperType["thanksPayData"]["getWorker"] = {
      //   wId: partnerId + 1,
      // };

      // const debug = await thanksPayData.methods.getWorker(getWorkerArgs);
      // console.log("worker info: ", debug);

      // const getWorkerBalanceArgs: ThanksPaySuperType["thanksPayData"]["getWorkerBalance"] =
      //   {
      //     wId: partnerId + 1,
      //   };
      
      // const debug2 = await thanksPayData.methods.getWorkerBalance(getWorkerBalanceArgs);
      // console.log("worker balance: ", debug2);

      // const workerGetsThanksPayCheckArgs: ThanksPaySuperType["thanksPayCheck"]["workerGetsThanksPayCheck"] =
      //   {
      //     wId: partnerId + 1,
      //     amount: 30,
      //   };
      // const debug3 = await thanksPayCheck.methods.workerGetsThanksPayCheck(
      //   workerGetsThanksPayCheckArgs
      // );
      // console.log("worker gets thanks pay check: ", debug3);

      // // const isAuthorizedArgs: ThanksPaySuperType["thanksPaySecurity"]["isAuthorized"] =
      // //   {
      // //     account: "0x08cD219852fa1De6632BfDbDca2A09B6B09DbeEd"
      // //   };
      // // const debug4 = await thanksPaySecurity.methods.isAuthorized(isAuthorizedArgs);
      // // console.log("is authorized: ", debug4);

      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      // const thanksPayMain = new ThanksPayMain(networkName);

      // const workerGetsThanksPayArgs: ThanksPaySuperType["thanksPayMain"]["workerGetsThanksPay"] =
      // {
      //   wId: partnerId + 1,
      //   pId: partnerId,
      //   amount: 30,
      //   bankReceipt: "goodjob, here's salary",
      //   timestamp: 1663007999 + partnerId + 1,
      // };

      // const partnerAddBalanceArgs: ThanksPaySuperType["thanksPayMain"]["partnerAddBalance"] ={
      //   pId: partnerId,
      //   amount: 100 * 5,
      //   timestamp: 1663007999, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
      // }
      // const result3 = await thanksPayMain.methods.partnerAddBalance(partnerAddBalanceArgs);
      // if(result3.type == "success"){
      //   console.log("partner add balance: ", getMoney(result3 as SuccessReturn));
      // }else{
      //   console.log("partner add balance failed");
      // }

      // const result4 = await thanksPayMain.methods.workerGetsThanksPay(workerGetsThanksPayArgs);
      // if (result4.tycScSpe == "success") {
      //   console.log("worker gets ThanksPay: ", getMoney(result4 as SuccessReturn));
      // } else {
      //   console.log("worker gets ThanksPay failed", result4);
      // }
    });
  });
});
