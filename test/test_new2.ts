const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
var CryptoJS = require("crypto-js");

import { SuccessReturn, ErrorReturn, ViewReturn, CheckReturn } from "./types/returnType";
import {
  ThanksPayMain,
  ThanksPayData,
  ThanksPayRelay,
  ThanksPayCheck,
  ThanksPaySecurity,
} from "../scripts/types/contractType";
import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";
import { getMoney2, getMoney } from '../scripts/utils/getMoney';
import { getNetworkName } from "../scripts/utils/getNetworkName";
// import { networkNameType } from "./deploy";
import { networkNameType } from "./types/networkNameType";

const networkName = getNetworkName(process) as networkNameType;
console.log(networkName);

var thanksPay;
const partnerId = 2009; 

describe("ThanksPay", function () {
  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(0);

      const thanksPayData = new ThanksPayData(networkName);
      const thanksPayRelay = new ThanksPayRelay(networkName);
      const thanksPayCheck = new ThanksPayCheck(networkName);
      const thanksPaySecurity = new ThanksPaySecurity(networkName);
    /**
     * REGISTER A PARTNER:
     */
      let registerPartnerArgs: ThanksPaySuperType["thanksPayData"]["registerPartner"] =
        {
          pId: partnerId,
          latestPay: 1663007942,
        };

      const result = await thanksPayData.methods.registerPartner(
        registerPartnerArgs
      );
      if (result.type == "success") {
        console.log("registered Partner: ", result as SuccessReturn);
      } else {
        console.log("failed to register Partner");
      }
    /**
     * REGISTER A WORKER:
     */

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
        console.log("registered Worker: ", (result2 as SuccessReturn));
      } else {
        console.log("Register worker failed");
      }

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

      /**
       * PUMP THAT PARTNER SOME MONEY
       */

      const thanksPayMain = new ThanksPayMain(networkName);

      const partnerAddBalanceArgs: ThanksPaySuperType["thanksPayMain"]["partnerAddBalance"] =
        {
          pId: partnerId,
          amount: 100 * 5,
          timestamp: 1663007999, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
        };
      
      const result3 = await thanksPayMain.methods.partnerAddBalance(
        partnerAddBalanceArgs
      ) as SuccessReturn;
      console.log("Logs of result3: ", result3.values.logs);
      console.log("Money used in the transaction: ", result3.values.money);
      
      if (result3.type == "success") {
        console.log(
          "partner add balance: ",
          (result3 as SuccessReturn)
        );
      } else {
        console.log("partner add balance failed", result3);
      }
      const workerGetsThanksPayArgs: ThanksPaySuperType["thanksPayMain"]["workerGetsThanksPay"] =
        {
          wId: partnerId + 1,
          pId: partnerId,
          amount: 30,
          bankReceipt: "goodjob, here's salary",
          timestamp: 1663007999 + partnerId + 1,
        };
      const result4 = await thanksPayMain.methods.workerGetsThanksPay(
        workerGetsThanksPayArgs
      );
      if (result4.type == "success") {
        const workerBalance = await thanksPayData.methods.getWorkerBalance({
          wId: partnerId + 1,
        });
        console.log(
          "worker gets ThanksPay: ",
          (result4 as SuccessReturn, networkName)
        );
        console.log("worker balance is: ", workerBalance.values.return);
      } else {
        console.log("worker gets ThanksPay failed", result4);
      }
    });
  });
});
