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
  OldThanks,
} from "@scripts/classes";

import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";
import { getMoney2 } from "./utils/getMoneyUtil";
import { getNetworkName } from "./utils/getNetworkNameUtil";
import { networkNameType } from "./types/networkNameType";

const networkName = getNetworkName(process) as networkNameType;
const oldContract = new OldThanks(networkName);

import * as fs from "fs";

const getPartnerId = () => {
  const read = fs.readFileSync(__dirname + "/testVariable.json", "utf8");
  const jsonContent = JSON.parse(read);
  return jsonContent.partnerId_oldContractTest;
};

const updatePartnerId = () => {
  const read = fs.readFileSync(__dirname + "/testVariable.json", "utf8");
  const jsonContent = JSON.parse(read);
  jsonContent.partnerId_oldContractTest = jsonContent.partnerId_oldContractTest + 1;
  fs.writeFileSync(
    __dirname + "/testVariable.json",
    JSON.stringify(jsonContent)
  );
};

var thanksPay;
const partnerId = getPartnerId();
updatePartnerId();

describe("Test 1", function () {
  it("Should register a partner ", async function () {
    this.timeout(0);
    let newPartnerArgs: ThanksPaySuperType["oldThanks"]["newPartner"] = {
      partnerLicenseId: "0x1234556789" + partnerId.toString(),
      klaytnAcc: "0xed835a425fb8d5beA9c2c7fD202f637B3B95d3f8",
      initialDeposit: 0,
      depositType: 0,
      salaryDay: 1,
      partnerHashData: "0xbitcha425fb8d5beA9c2c7fD202f637B3B95d3f8",
      // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
    };
    const result = await oldContract.methods.newPartner(newPartnerArgs);
    console.log(result);
    if (result.type == "success") {
      console.log(
        "Transaction gas for newPartner is: ",
        "success"
      );
    } else {
      console.log("can't make new partner");
    }
  });
});

describe("Test 2", function () {
  it("Should register new worker ", async function () {
    this.timeout(0);
    let newWorkerArgs: ThanksPaySuperType["oldThanks"]["newWorker"] = {
      workerEmail: "int2k@unist.ac.kr" + partnerId.toString(),
      partnerLicenseId: "0x1234556789" + partnerId.toString(),
      klaytnAcc: "0xb1f226d01554Bb6889C1DFf3016F3Ed6C97C26c8",
      workerHashData: "0xbitchaAssBoobsbeA9c2c7fD202f637B3B95d3f8",
    };
    const result2 = await oldContract.methods.newWorker(newWorkerArgs);
    console.log(result2);
    if (result2.type == "success") {
      console.log(
        "Transaction gas for new Worker is: ",
        getMoney2(result2 as SuccessReturn)
      );
    } else {
      console.log("can't make new worker");
    }
  });
});

describe("Test 3", function () {
  it("Should pump partner som mone ", async function () {
    this.timeout(0);
    /**
     * ADD MORE MONEY TO PARTNER BECAUSE THEY DESERVES IT
     */
    let partnerAddDepositArgs: ThanksPaySuperType["oldThanks"]["partnerAddDeposit"] =
      {
        partnerLicenseId: "0x1234556789" + partnerId.toString(),
        addDeposit: 1000,
        addDepositDate: 1631502342,
      };
    const result3 = await oldContract.methods.partnerAddDeposit(
      partnerAddDepositArgs
    );
    if (result3.type == "success") {
      console.log(
        "Transaction for partnerAddDeposit is: ",
        getMoney2(result3 as SuccessReturn)
      );
    } else {
      console.log("partnerAddDeposit failed: ", result3);
    }
  });
});

describe("Test 4", function () {
  it("Should let worker get salary", async function () {
    this.timeout(0);
    /**
     * Worker gets money via payRequest
     */
    let payRequestArgs: ThanksPaySuperType["oldThanks"]["payRequest"] = {
      workerEmail: "int2k@unist.ac.kr" + partnerId.toString(),
      payReqAmount: 100,
      payReqDate: 1631502343,
    };
    const result4 = await oldContract.methods.payRequest(payRequestArgs);
    if (result4.type == "success") {
      console.log(
        "Transaction for payRequest is: ",
        getMoney2(result4 as SuccessReturn)
      );
    } else {
      console.log("payRequest failed: ", result4);
    }
  });
});
