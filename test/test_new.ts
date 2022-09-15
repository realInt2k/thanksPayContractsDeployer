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
  const partnerId = 1735;
  
  describe("ThanksPay", function () {
    describe("Deployment", function () {
      it("Should create contract, the worker and the partner", async function () {
        this.timeout(0);
        const thanksPayMain = new ThanksPayMain(networkName);
        const thanksPayData = new ThanksPayData(networkName);
        const thanksPayRelay = new ThanksPayRelay(networkName);
        const thanksPayCheck = new ThanksPayCheck(networkName);
        const thanksPaySecurity = new ThanksPaySecurity(networkName);
  

        let registerPartnerArgs: ThanksPaySuperType["thanksPayData"]["registerPartner"] =
          {
            pId: partnerId,
            latestPay: 1663007942,
          };

        const result = await thanksPayData.methods.registerPartner(registerPartnerArgs);
        console.log(result);
        if (result.type=="success") {
          console.log("Transaction gas is: ", getMoney(result as SuccessReturn));
        }

      //   let registerWorkerArgs: ThanksPaySuperType["thanksPayData"]["registerWorker"] =
      //   {
      //     wId: partnerId+1,
      //     pId: partnerId,
      //     wage: 100,
      //     // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
      //   };
      // const result2 = await thanksPayData.methods.registerWorker(registerWorkerArgs);
      // console.log(result2);
      // if (result2.type=="success") {
      //   console.log("Transaction gas is: ", getMoney(result2 as SuccessReturn));
      // }
      });
    });
  });