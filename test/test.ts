const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
var CryptoJS = require("crypto-js");


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
    const _thanksRelay = await ethers.getContractFactory("ThanksPayRelay");
    const _thanksCheck = await ethers.getContractFactory("ThanksPayCheck");

    // deploy thanksSecurity;
    const thanksSecurity = await _thanksSecurity.deploy([signers[0].address]);
    await thanksSecurity.deployed();

    //console.log(thanksSecurity.address);

    // deploy thanksPayData;
    const thanksPayData = await _thanksPayData.deploy(thanksSecurity.address);
    await thanksPayData.deployed();

    // deploy check;
    const thanksCheck = await _thanksCheck.deploy(thanksPayData.address, thanksSecurity.address);
    await thanksCheck.deployed();

    // deploy thanksPay;
    const thanksPay = await _ThanksPay.deploy(thanksSecurity.address, thanksPayData.address, thanksCheck.address);
    await thanksPay.deployed();

    // deploy thanksRelay;
    const thanksRelay = await _thanksRelay.deploy(thanksSecurity.address);
    await thanksRelay.deployed();

    await thanksSecurity.functions.authorize([thanksPay.address]);
    // console.log("So far it's fine!");
    return { contracts: { thanksPay, thanksPayData, thanksRelay }, signers };
  }

  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(50000);
      const { contracts, signers } = await loadFixture(deployThanksPay);

      const { thanksPay, thanksPayData, thanksRelay} = contracts;
      // console.log("There are "+signers +" signers");
      const thanksPayInc = 0;
      const partner = 1;

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

      // give them salary

      await thanksPay.functions.setLatestWagePay(partner, 100);

      console.log("Worker balance should be 100:", await thanksPayData.functions.getWorkerBalance(3));

      await thanksPay.functions.workerGetsThanksPay(3, partner, 40, "receipt", 101);

      console.log("Worker balance should be 60:", await thanksPayData.functions.getWorkerBalance(3));


      // try to take more than balance, fail
      await thanksPay.functions.workerGetsThanksPay(3, partner, 61, "receipt", 102);



      console.log("Partner thankspayable balance should be 960", await thanksPayData.functions.getPartnerThanksPayableBalance(partner));

      await thanksRelay.functions.addProperty(1, [0, 1], ["Partner license", "Partner email"]);

      var secret = "ThanksPay";

      var license = CryptoJS.AES.encrypt("09-10-1009", secret);
      var email = CryptoJS.AES.encrypt("partner@email.com", secret);
      //U2FsdGVkX18ZUVvShFSES21qHsQEqZXMxQ9zgHy+bu0=

      // var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
      const tx = await thanksRelay.functions.setProperty(1, partner, [0, 1], [license.toString(), email.toString()]);
      const receipt = await tx.wait();
      console.log("Receipt: ", receipt);

      
      for (const event of receipt.events) {
        console.log(`Event ${event.event} with args ${event.args}`);
        for(const i in event.args) {
          if(event.args[i].length) {
            console.log(event.args[i]);
            for(const j in event.args[i]) {
              const str = event.args[i][j];
              const decriptionBytes = CryptoJS.AES.decrypt(str, secret);
              const decription = decriptionBytes.toString(CryptoJS.enc.Utf8); 
              console.log({"encripted:: ": str, "decripted:: " : decription});
            }
          }
        }
      }



    });

    it("Should change the balance correctly", async function () {

      
    });
  });
});