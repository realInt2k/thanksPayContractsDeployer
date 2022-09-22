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
  import { getMoney } from "./utils/getMoney";
  import { SuccessReturn, ErrorReturn, ViewReturn } from "../scripts/types/returnType";
  import {
    ThanksPayMain,
    ThanksPayData,
    ThanksPayRelay,
    ThanksPayCheck,
    ThanksPaySecurity,
    OldThanks
  } from "../scripts/types/contractType";
    import { ThanksPaySuperType} from "./generatedTypes/ThanksPaySuperType";
    import { oldThanksType } from './generatedTypes/oldThanksType';
  var thanksPay;
  const partnerId = 1;
  
  describe("ThanksPay", function () {
    describe("Deployment", function () {
      it("Should create contract, the worker and the partner", async function () {
        this.timeout(0);
        const oldThanks = new OldThanks("klaytn");
  
        const workerId = Math.floor(Math.random() * 100);
        let registerPartnerArgs: oldThanksType["newPartner"] =
          {
            partnerLicenseId: "parnerId3223265",
            klaytnAcc: "0xB0246401E074B0BB813381d8954F91d4C9C3e804",
            initialDeposit: 10,
            depositType: 1,
            salaryDay: 10,
            partnerHashData: "string1623325" // date Tue Sep 13 2022 03:39:02 GMT+0900 (Korean Standard Time)
          };
        const result = await oldThanks.methods.newPartner(registerPartnerArgs);
        if (result.type=="success") {
            console.log("Transaction gas is: ", getMoney(result as SuccessReturn));
        }
      });
    });
  });
  