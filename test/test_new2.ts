const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
var CryptoJS = require("crypto-js");

import {
  SuccessReturn,
  ErrorReturn,
  ViewReturn,
  CheckReturn,
} from "./types/returnType";
import {
  ThanksPayMain,
  ThanksPayData,
  ThanksPayRelay,
  ThanksPayCheck,
  ThanksPaySecurity,
} from "../scripts/types/contractType";
import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";
import { getMoney2, getMoney } from "../scripts/utils/getMoney";
import { getNetworkName } from "../scripts/utils/getNetworkName";
// import { networkNameType } from "./deploy";
import { networkNameType } from "./types/networkNameType";

const networkName = getNetworkName(process) as networkNameType;
console.log(networkName);

import * as fs from "fs";

const getPartnerId = () => {
  const read = fs.readFileSync(__dirname + "/testVariable.json", "utf8");
  const jsonContent = JSON.parse(read);
  return jsonContent.partnerId;
}

const updatePartnerId = () => {
  const read = fs.readFileSync(__dirname + "/testVariable.json", "utf8");
  const jsonContent = JSON.parse(read);
  jsonContent.partnerId = jsonContent.partnerId + 1;
  fs.writeFileSync(__dirname + "/testVariable.json", JSON.stringify(jsonContent));
}

var thanksPay;
const partnerId = getPartnerId();
updatePartnerId();

const thanksPayData = new ThanksPayData(networkName);
const thanksPayMain = new ThanksPayMain(networkName);
const thanksPayRelay = new ThanksPayRelay(networkName);
const thanksPayCheck = new ThanksPayCheck(networkName);
const thanksPaySecurity = new ThanksPaySecurity(networkName);

describe("test 1", function () {
  it("Should register partner", async function () {
    this.timeout(0);
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
      console.log("registered Partner: ", 
      (result as SuccessReturn).values.money
      );
    } else {
      console.log("failed to register Partner", result);
    }
  });
});

describe("test 2", function () {
  it("Should register worker", async function () {
    this.timeout(0);
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
      console.log("registered Worker: ", 
      (result2 as SuccessReturn).values.money
      );
    } else {
      console.log("Register worker failed");
    }
  });
});

describe("test 3", function () {
  it("Should pump the partner sum $", async function () {
    this.timeout(0);
    /**
     * PUMP THAT PARTNER SOME MONEY
     */

    const partnerAddBalanceArgs: ThanksPaySuperType["thanksPayMain"]["partnerAddBalance"] =
      {
        pId: partnerId,
        amount: 100 * 5,
        timestamp: 1663007999, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
      };

    const result3 = (await thanksPayMain.methods.partnerAddBalance(
      partnerAddBalanceArgs
    )) as SuccessReturn;
    //console.log("Logs of result3: ", result3.values.logs);
    //console.log("Money used in the transaction: ", result3.values.money);

    if (result3.type == "success") {
      console.log("partner add balance: ", 
      (result3 as SuccessReturn).values.money
      );
    } else {
      console.log("partner add balance failed", result3);
    }
  });
});

describe("test 4", function () {
  it("Should let worker get early salary", async function () {
    this.timeout(0);
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
        (result4 as SuccessReturn).values.money
      );
      console.log(
        "worker balance is: ",
        workerBalance.values.return.toBigInt()
      );
    } else {
      console.log("worker gets ThanksPay failed", result4);
    }
  });
});


