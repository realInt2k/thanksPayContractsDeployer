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
    const [owner, otherAccount] = await ethers.getSigners();
    //console.log(owner.address);
    
    const _thanksSecurity = await ethers.getContractFactory("thanksSecurity");
    const _thanksPayData = await ethers.getContractFactory("ThanksPayData");
    const _PartnerWon = await ethers.getContractFactory("PartnerWon");
    const _WorkerWon = await ethers.getContractFactory("WorkerWon");
    const _ThanksPay = await ethers.getContractFactory("ThanksPay");
    
    // deploy thanksSecurity;
    const thanksSecurity = await _thanksSecurity.deploy([owner.address]);
    await thanksSecurity.deployed();

    //console.log(thanksSecurity.address);

    // deploy thanksPayData;
    const thanksPayData = await _thanksPayData.deploy(thanksSecurity.address);
    await thanksPayData.deployed();

    // deploy ERC20 tokens;
    const partnerWon = await _PartnerWon.deploy(thanksPayData.address,  thanksSecurity.address);
    await partnerWon.deployed();

    const workerWon = await _WorkerWon.deploy(thanksSecurity.address, thanksPayData.address);
    await workerWon.deployed();

    // deploy thanksPay;
    const thanksPay = await _ThanksPay.deploy(thanksPayData.address, partnerWon.address, workerWon.address, thanksSecurity.address);
    await thanksPay.deployed();


    await thanksSecurity.functions.authorize([partnerWon.address, workerWon.address, thanksPay.address]);

    return { contracts: {thanksPay, partnerWon, workerWon, thanksPayData}, owner};
  }

  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(50000);
      const {contracts, owner} = await loadFixture(deployThanksPay);

      const {thanksPay, partnerWon, workerWon, thanksPayData} = contracts;
      
      const partner = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      const worker = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

      await thanksPay.functions.registerPartner(partner, 0, 0);

      await thanksPay.functions.registerWorker(worker, partner, 100);

      await thanksPay.functions.partnerTransaction(0, partner, partner, 100, "Receipt");

      const balance = await partnerWon.functions.balanceOf(partner);

      console.log(balance);


      // thanksPay = contract;
      // console.log(thanksPay.address);
      // const partner = await thanksPay.registerPartner(
      //   1, // pId
      //   "p_license", // license,
      //   15 // payday
      //   );

      // const partnerBalance = await thanksPay.changePartnerBalance(
      //   1, // pId
      //   50000, // change);
      // );

      // const worker = await thanksPay.registerWorker(
      //   1, //wId
      //   1, // pId
      //   "ollie041114@gmail.com",
      //   "w_license",
      //   100,
      //   90, // initialBalance
      // );

      // const p_balance = await thanksPay.getPartnerBalance(1);

      // const w_balance = await thanksPay.getWorkerBalance(1, 0);

      // console.log(p_balance, w_balance);
      // expect(await p_balance.to.equal(50000));
      // expect(await w_balance.to.equal(90));
    });

    it("Should change the balance correctly", async function () {

    });

  //   it("Should receive and store the funds to thankspay", async function () {
  //     const { thankspay, thankspayedAmount } = await loadFixture(
  //       deployThanksPay
  //     );

  //     expect(await ethers.provider.getBalance(thankspay.address)).to.equal(
  //       thankspayedAmount
  //     );
  //   });

  //   it("Should fail if the unthankspayTime is not in the future", async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest();
  //     const ThanksPay = await ethers.getContractFactory("ThanksPay");
  //     await expect(ThanksPay.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //       "Unthankspay time should be in the future"
  //     );
  //   });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { thankspay } = await loadFixture(deployOneYearLockFixture);

  //       await expect(thankspay.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { thankspay, unthankspayTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unthankspayTime);

  //       // We use thankspay.connect() to send a transaction from another account
  //       await expect(thankspay.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unthankspayTime has arrived and the owner calls it", async function () {
  //       const { thankspay, unthankspayTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unthankspayTime);

  //       await expect(thankspay.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { thankspay, unthankspayTime, thankspayedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unthankspayTime);

  //       await expect(thankspay.withdraw())
  //         .to.emit(thankspay, "Withdrawal")
  //         .withArgs(thankspayedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { thankspay, unthankspayTime, thankspayedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unthankspayTime);

  //       await expect(thankspay.withdraw()).to.changeEtherBalances(
  //         [owner, thankspay],
  //         [thankspayedAmount, -thankspayedAmount]
  //       );
  //     });
  //   });
  });
});