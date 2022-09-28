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
  } from "../scripts/types/contractType";
  import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";
  import { getMoney2 } from "../scripts/utils/getMoney";
  import { getNetworkName } from "../scripts/utils/getNetworkName";
  // import { networkNameType } from "./deploy";
  import { networkNameType } from "./types/networkNameType";
  
  const networkName = getNetworkName(process) as networkNameType;;
  
  var thanksPay;
  const partnerId = 2001;
  
  describe("ThanksPay", function () {
    describe("Deployment", function () {
      it("Should create contract, the worker and the partner", async function () {
        this.timeout(0);
        const oldContract = new OldThanks(networkName);
  
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
            getMoney2(result as SuccessReturn)
          );
        } else {
            console.log(
                "can't make new partner"
            )
        }
  
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
            console.log(
                "can't make new worker"
            )
        }
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
        if(result3.type == "success"){
          console.log(
            "Transaction for partnerAddDeposit is: ",
            getMoney2(result3 as SuccessReturn)
          );
        } else {
          console.log("partnerAddDeposit failed: ", result3);
        }
  
        /**
         * Worker gets money via payRequest
         */
        let payRequestArgs: ThanksPaySuperType["oldThanks"]["payRequest"] = {
          workerEmail: "int2k@unist.ac.kr" + partnerId.toString(),
          payReqAmount: 100,
          payReqDate: 1631502343,
        };
        const result4 = await oldContract.methods.payRequest(payRequestArgs);
        if(result4.type == "success"){
          console.log(
            "Transaction for payRequest is: ",
            getMoney2(result4 as SuccessReturn)
          );
        } else {
          console.log("payRequest failed: ", result4);
        }
  
      });
    });
  });
  