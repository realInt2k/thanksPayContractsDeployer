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
  import { SuccessReturn, ErrorReturn, ViewReturn } from "../scripts/types/returnType";
  import {
    ThanksPayMain,
    ThanksPayData,
    ThanksPayRelay,
    ThanksPayCheck,
    ThanksPaySecurity,
  } from "../scripts/types/contractType";
    import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";

  var thanksPay;
  const partnerId = 1;
  
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
        const result = await thanksPayData.methods.registerPartner(registerPartnerArgs);
        let setLatestWagePayArgs: ThanksPaySuperType["thanksPayMain"]["setLatestWagePay"] = {
          pId: partnerId,
          timestamp: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
        };
        const result2 = await thanksPayMain.methods.setLatestWagePay(setLatestWagePayArgs);
        if (result.type=="success"){
          console.log("Transaction gas is:", (result as SuccessReturn).values.receipt.cumulativeGasUsed);
        }
        if (result.type=="error"){
          console.log("Transaction error is:", (result as ErrorReturn).values.reason);
        }
      });
    });
  });
  