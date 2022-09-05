const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

var thanksPay;
describe("ThanksPay", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployThanksPay() {
    // Contracts are deployed using the first signer/account by default
    const signers = await ethers.getSigners();
    // get the signers, deploy from the first one 
    console.log();

    const _thanksSecurity = await ethers.getContractFactory("ThanksSecurity");
    const _thanksPayData = await ethers.getContractFactory("ThanksData");
    const _ThanksPay = await ethers.getContractFactory("ThanksPayMain");

    // deploy thanksSecurity;
    const thanksSecurity = await _thanksSecurity.deploy([signers[0].address]);
    await thanksSecurity.deployed();

    //console.log(thanksSecurity.address);

    // deploy thanksPayData;
    const thanksPayData = await _thanksPayData.deploy(thanksSecurity.address);
    await thanksPayData.deployed();

    // deploy thanksPay;
    const thanksPay = await _ThanksPay.deploy(thanksSecurity.address, thanksPayData.address);
    await thanksPay.deployed();


    await thanksSecurity.functions.authorize([thanksPay.address]);
    // console.log("So far it's fine!");
    return { contracts: { thanksPay, thanksPayData }, signers };
  }

  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(50000);
      const { contracts, signers } = await loadFixture(deployThanksPay);

      const { thanksPay, thanksPayData } = contracts;
      // console.log("There are "+signers +" signers");
      const thanksPayInc = 0;
      const partner = 1;

      console.log(thanksPayData);

      // register Eddy and a partner
      await thanksPayData.functions.registerPartner(thanksPayInc, 0);
      await thanksPayData.functions.registerPartner(partner, 0);

      // send 500K each.
      await thanksPay.functions.partnerAddBonus(partner, 500);
      await thanksPay.functions.partnerAddBalance(partner, 500);

      // register 10 workers, each with 100 money 
      for (let i = 0; i < 10; i++) {
        var index = 2 + i;
        var wId = index;
        await thanksPayData.functions.registerWorker(wId, partner, 100);
      }

      // view balances
      console.log("Partner thankspayable balance: ", await thanksPayData.functions.getPartnerThanksPayableBalance(partner));
      console.log("Partner withdrawable balance: ", await thanksPayData.functions.getPartnerWithdrawableBalance(partner));
      // console.log("Worker address: " + signers[2].address);
      console.log("Worker balance: ", await thanksPayData.functions.getWorkerBalance(3));


      
    });

    it("Should change the balance correctly", async function () {
      1
    });
  });
});