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
    OldThanks
  } from "../scripts/types/contractType";
  import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";
  import { getMoney } from "../scripts/utils/getMoney";
  import { getNetworkName } from "../scripts/utils/getNetworkName";
  // import { networkNameType } from "./deploy";
  import { networkNameType } from "./types/networkNameType";



  const networkName = "klaytn";

  var thanksPay;
  const partnerId = 1735;
  
  describe("ThanksPay", function () {
    describe("Deployment", function () {
      it("Should create contract, the worker and the partner", async function () {
        this.timeout(0);
        const oldContract = new OldThanks(networkName);
 
        let newPartnerArgs: ThanksPaySuperType["oldThanks"]["newPartner"] =
          {
            partnerLicenseId: "0x1234556789",
            klaytnAcc: "0xed835a425fb8d5beA9c2c7fD202f637B3B95d3f8",
            initialDeposit: 0,
            depositType: 0,
            salaryDay: 1,
            partnerHashData: "0xbitcha425fb8d5beA9c2c7fD202f637B3B95d3f8",
            // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
          };
        const result = await oldContract.methods.newPartner(newPartnerArgs);
        console.log(result);
        if (result.type=="success") {
          console.log("Transaction gas for newPartner is: ", getMoney(result as SuccessReturn));
        }

        let newWorkerArgs: ThanksPaySuperType["oldThanks"]["newWorker"] =
        {
            workerEmail: "int2k@unist.ac.kr",
            partnerLicenseId: "0x1234556789",
            klaytnAcc: "0xb1f226d01554Bb6889C1DFf3016F3Ed6C97C26c8",
            workerHashData: "0xbitchaAssBoobsbeA9c2c7fD202f637B3B95d3f8",
        };
      const result2 = await oldContract.methods.newWorker(newWorkerArgs);
      console.log(result2);
      if (result2.type=="success") {
        console.log("Transaction gas for new Worker is: ", getMoney(result2 as SuccessReturn));
      }
      });
    });
  });