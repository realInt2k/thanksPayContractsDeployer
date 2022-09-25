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
  import contractAddresses from "./contractAddresses.json";
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

  var thanksPay;
  const partnerId = 15;
  
  describe("ThanksPay", function () {
    describe("Deployment", function () {
      it("Should create contract, the worker and the partner", async function () {
        this.timeout(0);
        const thanksPayMain = new ThanksPayMain("polygonTest");
        const thanksPayData = new ThanksPayData("polygonTest");
        const thanksPayRelay = new ThanksPayRelay("polygonTest");
        const thanksPayCheck = new ThanksPayCheck("polygonTest");
        const thanksPaySecurity = new ThanksPaySecurity("polygonTest");

  

        let registerPartnerArgs: ThanksPaySuperType["thanksPayData"]["registerPartner"] =
          {
            pId: partnerId,
            latestPay: 1663007942, // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
          };
        const result = await thanksPayData.methods.registerPartner(registerPartnerArgs);
        console.log(result);
        if (result.type=="success") {
          console.log("Transaction gas is: ", getMoney(result as SuccessReturn));
        }
      });
    });
  });