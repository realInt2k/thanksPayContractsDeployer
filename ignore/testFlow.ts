import { expect } from "chai";
import { ethers, Contract } from 'ethers';
import * as dotenv from "dotenv";
import ABI from '../../packages/shared/BLOCK_CHAIN_THINGS/abis/LeagueMaker.json';
import { connectAsOwner, connectAsUserWithPrivateKey } from '../scripts/utils/testUtils';
import ganacheAccounts from '../ganacheAccounts.json';
export type AccountData = typeof ganacheAccounts;
let progressiveTestState = true;
const ownerAcc:string = Object.keys(ganacheAccounts.addresses)[0];

const doTest = [
  0,
  0, // account 1 joins league 1
  0, // log the funds only admin level > 2 can access
  0, // it should  sendMoney (from account 0 to account 2) using sendMoney function of smart contract
  // Eddy's sample sequence
  1, // 4 break point 0
  1, // 5 
  1, // 6
  1, // 7
  1, // 8
  1, // 9
  1, // 10
  1, // 11
  1, // 12
  1, // 13 break point 1
  1, // 14
  1, // 15
  1, // 16 break point 2
  1, // 17 try to sing this again to see if D can still claim the rewards
  1, // 18 break point 3
  1, // 19
  1, // 20
  1, // 21
  1 // 22
]
/**
 * Account information:
 * manager A: Object.keys(ganacheAccounts.addresses)[3]
 * manager B: Object.keys(ganacheAccounts.addresses)[4]
 * Player C: Object.keys(ganacheAccounts.addresses)[5]
 * Player D: Object.keys(ganacheAccounts.addresses)[6]
 * Player E: Object.keys(ganacheAccounts.addresses)[7]
 * Player F: Object.keys(ganacheAccounts.addresses)[8]
 */

/**
 * we use this 0x3e2c5ea91371b54340d806b0705bec27c5afc82d789ffab68bc67336a5458baa
 * makeWaitingLeague:
 * tic-tac-toe, 1000 (wei), 1655144138, 1655444138
 * makeWaitingLeague:
 * lol, 2000 (wei), 1655444138, 1655644138
 * makeWaitingLeague:
 * csgo, 3000 (wei), 1665644138, 1665864138
 */

describe("----test0----", function () {
    it("it should open 3 leagues", async function () {
        if(!doTest[0]) {
            this.skip();
        }
        this.timeout(0);
        let data = await connectAsOwner();
        if(!data || !data.contract || !data.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contract = data.contract;
        const account = data.accountAddress;
        try {
          const args1 = ["tic-tac-toe", 1000, 1655144138, 1655444138,10, 0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']];
          let tx = await contract.makeWaitingLeague(
            ...args1
          );
          const txReceipt1 = await tx.wait();
        } catch (e) {
          console.log("cant make tic-tac-toe");
          return;
        }
        try {
          const args2 = ["lol", 2000, 1655444138, 1655644138,10,0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']];
          let tx = await contract.makeWaitingLeague(
            ...args2
          );
          const txReceipt2 = await tx.wait();
        } catch(e) {
          console.log("cant make lol");
          return;
        }
        try {
          const args3 = ["csgo", 3000, 1665644138, 1665864138,10,0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']];
          let tx = await contract.makeWaitingLeague(
            ...args3
          );
          const txReceipt3 = await tx.wait();
        } catch (e) {
          console.log("cant make csgo");
          return;
        }
        console.log("test0 ok");
    });
  })


  describe("----test1----", function () {
    it("account 1 joins league 1", async function () {
        if(!doTest[1]) {
            this.skip();
        }
        this.timeout(0);
        console.log(Object.keys(ganacheAccounts.private_keys)[1], "will join league 1", Object.values(ganacheAccounts.private_keys)[1]);
        let data = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[1]);
        if(!data || !data.contract || !data.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contract = data.contract;
        const account = data.accountAddress;
        try {
          const args1 = [1, "int2k"];
          let tx = await contract.joinLeague(
            ...args1, {value: 1000}
          );
          const txReceipt1 = await tx.wait();
        } catch (e) {
          console.log("Cant join league 1");
          return;
        }
        console.log("test1 ok");

    });
  })

  describe("----test2----", function () {
    it("should log ourFund", async function () {
        if(!doTest[2]) {
            this.skip();
        }
        this.timeout(0);
        let data = await connectAsOwner();
        if(!data || !data.contract || !data.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contract = data.contract;
        const account = data.accountAddress;
        // try {
        //   const args1 = [];
        //   let tx = await contract.getContractBalance(); 
        //   console.log("FUN is: ", parseInt(tx._hex.toString(), 16));
        // } catch (e) {
        //   console.log("cant log funds");
        //   return;
        // }
        console.log("test2 ok");

    });
  })

  describe("----test3----", function () {
    it("should transfer money", async function () {
        if(!doTest[3]) {
            this.skip();
        }
        this.timeout(0);
        let data = await connectAsOwner();
        if(!data || !data.contract || !data.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contract = data.contract;
        const account = data.accountAddress;
        try {
          // let tx = await contract.getContractBalance(); 
          let money = 100; //parseInt(tx._hex.toString(), 16);
          const args1 = [Object.values(ganacheAccounts.addresses)[2], money - 1, "just stop your crying it's the sign of the time"];
          let tx = await contract.withdrawAsAdmin(
            ...args1
          );
          const txReceipt1 = await tx.wait();
        }
        catch (e) {
          console.log("cant transfer money");
          return;
        }
        console.log("test3 ok");
    });
  })
// FROM HERE ONLY use accounts [3] +++
/**
 * doTest[4]:
  {
      Admin Master Invite manager A
      Admin Master Invite manager B
  }
 */
  describe("----test4----", function () {
    it("should invite manager A, B", async function () {
        if(!doTest[4]  || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as owner
        let data = await connectAsOwner();
        if(!data || !data.contract || !data.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contract = data.contract;
        const account = data.accountAddress;
        try {
          const args1 = [Object.values(ganacheAccounts.addresses)[3], 2, "A"];
          let tx = await contract.createUser(
            ...args1
          );
          const txReceipt1 = await tx.wait();
          const args2 = [Object.values(ganacheAccounts.addresses)[4], 2, "B"];
          tx = await contract.createUser(
            ...args2
          );
          const txReceipt2 = await tx.wait();
        }
        catch (e) {
          console.log("cant invite manager A or B");
          return;
        }
        console.log("test4 ok");
    }
    );
  })

  /**
   * doTest[5]:
    {
        Manager A makes league 1 (2022/06/14 2pm) 
        Manager B makes league 2 (2022/06/14 3pm)
        Manager A makes league 3 (2022/06/14 3pm)
        Manager B makes league 4 (2022/06/14 3pm, same time with league 3)
    }
   */
  describe("----test5----", function () {
    it("manager A and B should make league 1, 2, 3, 4", async function () {
        if(!doTest[5]  || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager A
        let dataA = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[3]);
        if(!dataA || !dataA.contract || !dataA.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        // connect as manager B
        let dataB = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[4]);
        if(!dataB || !dataB.contract || !dataB.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }

        let contractA = dataA.contract;
        let contractB = dataB.contract;
        const accountA = dataA.accountAddress;
        try {
          const args1 = ["game1", 1000, 1655216005, 1655219605,10,0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']]; // (2022/06/14 2pm)
          let tx = await contractA.makeWaitingLeague(
            ...args1
          );
          const txReceipt1 = await tx.wait();
          const args2 = ["game2", 2000, 1655219605, 1655226805,10, 0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']]; // (2022/06/14 3pm)
          tx = await contractB.makeWaitingLeague(
            ...args2
          );
          const txReceipt2 = await tx.wait();
          const args3 = ["game3", 3000, 1655219605, 1655230405,10,0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']]; // (2022/06/14 3pm)
          tx = await contractA.makeWaitingLeague(
            ...args3
          );
          const txReceipt3 = await tx.wait();
          const args4 = ["game4", 4000, 1655219605, 1655234405,10,0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']]; // (2022/06/14 3pm)
          tx = await contractB.makeWaitingLeague(
            ...args4
          );
          const txReceipt4 = await tx.wait();
        }
        catch (e) {
          console.log("cant make league 1, 2, 3, 4 by manager A, B");
          return;
        }
        console.log("test5 ok");
    });
  })

  /**
   * make connectAsUserWithPrivateKey of account 5 and 6, then
   * doTest[6]:
    {
        Player C  join league 1 Object.values(ganacheAccounts.addresses)[5]
        Player D  join league 1 Object.values(ganacheAccounts.addresses)[6]
    }
   */
  describe("----test6----", function () {
    it("should join league 1 by player C and D", async function () {
        if(!doTest[6]  || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as player C
        let dataC = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[5]);
        if(!dataC || !dataC.contract || !dataC.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        // connect as player D
        let dataD = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[6]);
        if(!dataD || !dataD.contract || !dataD.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractC = dataC.contract;
        let contractD = dataD.contract;
        try {
          let tx = await contractC.joinLeague(1, "C", {value:1000});
          const txReceipt1 = await tx.wait();
          tx = await contractD.joinLeague(1, "D", {value:1000});
          const txReceipt2 = await tx.wait();
        }
        catch (e) {
          progressiveTestState = false;
          console.log("cant join league 1 by player C and D");
          return;
        }
        console.log("test6 ok");
    }
    );
  })
  /**
   * connectAsUserWithPrivateKey of account of manager A, then:
   * doTest[7]:
   * {
   *  Manager A get start the league 1 
   * }
   */
  describe("----test7----", function () {
    it("manager A should start league 1", async function () {
        if(!doTest[7]  || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager A
        let dataA = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[3]);
        if(!dataA || !dataA.contract || !dataA.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractA = dataA.contract;
        const accountA = dataA.accountAddress;
        try {
          let tx = await contractA.makePlayingLeague(1);
          const txReceipt1 = await tx.wait();
        }
        catch (e) {
          console.log("cant start league 1 by manager A");
          return;
        }
        console.log("test7 ok");
    });
  })

  /**
   * connectAsUserWithPrivateKey of account of player C, D, E, F, then:
   * doTest[8]:
   * {
   * Player C join league 2
   * Player D join league 2
   * Player E join league 2
   * Player F join league 2
   * }
   */
  describe("----test8----", function () {
    it("should join league 2 by player C, D, E, F", async function () {
        if(!doTest[8]  || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as player C
        let dataC = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[5]);
        if(!dataC || !dataC.contract || !dataC.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        // connect as player D
        let dataD = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[6]);
        if(!dataD || !dataD.contract || !dataD.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        // connect as player E
        let dataE = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[7]);
        if(!dataE || !dataE.contract || !dataE.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        // connect as player F
        let dataF = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[8]);
        if(!dataF || !dataF.contract || !dataF.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractC = dataC.contract;
        let contractD = dataD.contract;
        let contractE = dataE.contract;
        let contractF = dataF.contract;
        const accountC = dataC.accountAddress;
        const accountD = dataD.accountAddress;
        const accountE = dataE.accountAddress;
        const accountF = dataF.accountAddress;
        try {
          let tx = await contractC.joinLeague(2, "C", {value:2000});
          const txReceipt1 = await tx.wait();
          tx = await contractD.joinLeague(2, "D", {value:2000});
          const txReceipt2 = await tx.wait();
          tx = await contractE.joinLeague(2, "E", {value:2000});
          const txReceipt3 = await tx.wait();
          tx = await contractF.joinLeague(2, "F", {value:2000});
          const txReceipt4 = await tx.wait();
        }
        catch (e) {
          console.log("cant join league 2 by player C, D, E, F");
          return;
        }
        console.log("test8 ok");
    }
    );
  })

  /**
   * connectAsUserWithPrivateKey of account of manager B, then:
   * doTest[9]:
   * {
   * Manager B cancel league 2 (calling function makeCancelledLeague(_leagueId))
   * }
   */
  describe("----test9----", function () {
    it("manager B should cancel league 2", async function () {
        if(!doTest[9] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager B
        let dataB = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[4]);
        if(!dataB || !dataB.contract || !dataB.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractB = dataB.contract;
        const accountB = dataB.accountAddress;
        try {
          const args1 = [2];
          let tx = await contractB.makeCancelledLeague(
            ...args1
          );
          const txReceipt1 = await tx.wait();
        }
        catch (e) {
          console.log("cant cancel league 2 by manager B");
          return;
        }
        console.log("test9 ok");
    }
    );
  })

  /**
   * connectAsUserWithPrivateKey of account of manager A
   * connectAsOwner (admin), then
   * doTest[10]:
   * {
   * manager A close league 1 with makeDoneLeague(uint256 _leagueId, string[] memory _winners) whereas only player C won 
   * log contract balance (use admin account)}
   */
  describe("----test10----", function () {
    it("manager A should close league 1 with makeDoneLeague", async function () {
        if(!doTest[10] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager A
        let dataA = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[3]);
        if(!dataA || !dataA.contract || !dataA.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractA = dataA.contract;
        const accountA = dataA.accountAddress;
        try {
          let tx = await contractA.makeDoneLeague(1, ["C"]);
          const txReceipt1 = await tx.wait();
        }      
        // connect as owner
        catch (e:any) {
          progressiveTestState = false;
          console.log("cant close league 1 with makeDoneLeague", e.error);
          return;
        }
        let dataO = await connectAsOwner();
        if(!dataO || !dataO.contract || !dataO.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractO = dataO.contract;
        // try {
        //   let tx = await contractO.getContractBalance()
        //   console.log("Admin wants to see contract balance: ", parseInt(tx._hex.toString(), 16))
        // }
        // catch (e) {
        //   progressiveTestState = false;
        //   console.log("cant get contract balance");
        //   return;
        // }

        console.log("test10 ok");
    });
  })
  
  /**
   * connectAsUserWithPrivateKey of account of Player C, D, E
   * doTest[11]:
   * {
   * Player C, D, E join league 3
   * }
   */
  describe("----test11----", function () {
    it("Player C, D, E should join league 3", async function () {
        if(!doTest[11] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as player C
        let dataC = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[5]);
        if(!dataC || !dataC.contract || !dataC.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        // connect as player D
        let dataD = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[6]);
        if(!dataD || !dataD.contract || !dataD.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        // connect as player E
        let dataE = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[7]);
        if(!dataE || !dataE.contract || !dataE.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractE = dataE.contract;
        let contractC = dataC.contract;
        let contractD = dataD.contract;
        try {
          let tx = await contractC.joinLeague(3, "C", {value:3000});
          const txReceipt1 = await tx.wait();
          tx = await contractD.joinLeague(3, "D", {value:3000});
          const txReceipt2 = await tx.wait();
          tx = await contractE.joinLeague(3, "E", {value:3000});
          const txReceipt3 = await tx.wait();
        }
        catch (e) {
          console.log("player C, D, E cant join league 3");
          return;
        }
        console.log("test11 ok");
    });
  })

  /**
   * connectAsUserWithPrivateKey of Player C, then
   * doTest[12]:
   * {
   * Player C claim the reward of league 1, using this function: withdrawRewards([1])
   * }
   */
  describe("----test12----", function () {
    it("Player C should claim the reward of league 1", async function () {
        if(!doTest[12] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as player C
        let dataC = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[5]);
        if(!dataC || !dataC.contract || !dataC.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractC = dataC.contract;
        try {
          let tx = await contractC.withdrawRewards([1])
          const txReceipt1 = await tx.wait();
        }
        catch (e) {
          progressiveTestState = false;
          console.log("player C cant claim the reward of league 1");
          return;
        }
        console.log("test12 ok");
    });
  })

  /**
   * connectAsUserWithPrivateKey of Manager A
   * connectAsUserWithPrivateKey of Player C, D, E, F, then:
   * doTest[13]:
   * {
   * Manager A start league 3
   * Player C, D, E, F join league 4}
   */
  describe("----test13----", function () {
    it("Manager A should start league 3, then C, D, E, F join league 4", async function () {
        if(!doTest[13] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager A
        let dataA = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[3]);
        if(!dataA || !dataA.contract || !dataA.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractA = dataA.contract;
        // connect as Player C, D, E, F:
        let dataC = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[5]);
        if(!dataC || !dataC.contract || !dataC.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractC = dataC.contract;
        let dataD = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[6]);
        if(!dataD || !dataD.contract || !dataD.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractD = dataD.contract;
        let dataE = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[7]);
        if(!dataE || !dataE.contract || !dataE.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractE = dataE.contract;
        let dataF = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[8]);
        if(!dataF || !dataF.contract || !dataF.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractF = dataF.contract;
        try {
          let tx = await contractA.makePlayingLeague(3);
          const txReceipt1 = await tx.wait();
          let tx2 = await contractC.joinLeague(4, "C", {value:4000});
          const txReceipt2 = await tx2.wait();
          let tx3 = await contractD.joinLeague(4, "D", {value:4000});
          const txReceipt3 = await tx3.wait();
          let tx4 = await contractE.joinLeague(4, "E", {value:4000});
          const txReceipt4 = await tx4.wait();
          let tx5 = await contractF.joinLeague(4, "F", {value:4000});
          const txReceipt5 = await tx5.wait();
        }
        catch (e) {
          console.log("manager A cant start league 3 or player C, D, E, F cant join league 4");
          return;
        }
        console.log("test13 ok");
    });
  })

  /**
   * Manager B get start the league 4.
   */
  describe("----test14----", function () {
    it("manager B should start league 4", async function () {
        if(!doTest[14]  || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager B
        let dataB = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[4]);
        if(!dataB || !dataB.contract || !dataB.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractB = dataB.contract;
        try {
          let tx = await contractB.makePlayingLeague(4);
          const txReceipt1 = await tx.wait();
        }
        catch (e) {
          progressiveTestState = false;
          console.log("cant start league 1 by manager B");
          return;
        }
        console.log("test14 ok");
    });
  })
  /**
   * manager A blocks player C on league 3
   */
  describe("----test15----", function () {
    it("manager A should block player C on league 3", async function () {
        if(!doTest[15] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager A
        let dataA = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[3]);
        if(!dataA || !dataA.contract || !dataA.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractA = dataA.contract;
        // block player C
        try {
          let tx = await contractA.blockPlayers(3, ["C"]);
          const txReceipt1 = await tx.wait();
        } catch(e) {
          progressiveTestState = false;
          console.log("cant block player C on league 3");
          return;
        }
        console.log("test15 ok");
    });
  })
  /**
   * Mangager A finish the league 3 (D and E are the winners)
   * // argument should only contain "D"
   * Manger B finish the league 4 (C and D are the winners, but C is blocked on league 3 by Manager A)
   */
  describe("----test16----", function () {
    it("manager A should finish league 3 (D and E are the winners), \
    then manager B should finish league 4 (C and D are the winners, but C is blocked on league 3 by Manager A)", async function () {
        if(!doTest[16] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as manager A
        let dataA = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[3]);
        if(!dataA || !dataA.contract || !dataA.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractA = dataA.contract;
        // connect as manager B
        let dataB = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[4]);
        if(!dataB || !dataB.contract || !dataB.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractB = dataB.contract;
        // finish league 3 (makeDoneLeague)
        try {
          let tx = await contractA.makeDoneLeague(3, ["D", "E"]);
          const txReceipt1 = await tx.wait();
        } catch(e) {
          progressiveTestState = false;
          console.log("A cant finish league 3 with D and E as winner");
          return;
        }
        // finish league 4 (makeDoneLeague)
        try {
          let tx = await contractB.makeDoneLeague(4, ["C", "D"]);
          const txReceipt1 = await tx.wait();
          console.log("this is wrong, can't pass makeDoneLeague 4 ['C', 'D']");
          progressiveTestState = false;
          return;
        } catch(e) {
          console.log("transaction reverted when they pass 'C', which is expected");
          try {
            let tx = await contractB.makeDoneLeague(4, ["D"]);
            const txReceipt1 = await tx.wait();
          } catch(e) {
            progressiveTestState = false;
            console.log("B cant finish league 4 with C as winner");
            return;
          }
        }
        console.log("test16 ok");
    });
  })
  /**
   * Player C claims the reward of league 1
   * Player D claims the reward of league 4
   */
  describe("----test17----", function () {
    it("player C should claim the reward of league 1, player D should claim the reward of league 4", async function () {
        if(!doTest[17] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as player C
        let dataC = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[5]);
        if(!dataC || !dataC.contract || !dataC.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractC = dataC.contract;
        // connect as player D
        let dataD = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[6]);
        if(!dataD || !dataD.contract || !dataD.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractD = dataD.contract;
        // C claim the reward of league 1
        try {
          let tx = await contractC.withdrawRewards([1]);
          const txReceipt1 = await tx.wait();
          console.log("C CAN claim reward albeit he is blocked on league 3");
          progressiveTestState = false;
          return;
        } catch(e) {
          console.log("C cant claim reward of league 1, which is expected");
        }
        // D claim the reward of league 4
        try {
          let tx = await contractD.withdrawRewards([4]);
          const txReceipt1 = await tx.wait();
        } catch(e:any) {
          progressiveTestState = false;
          console.log("D cant claim reward of league 4", e.error);
          return;
        }
        console.log("test17 ok");
    });
  })
  /**
   * owner see fund 
   * owner send money to Object.keys(ganacheAccounts.addresses)[9]
   * owner demote manager B to 0
   */
  describe("----test18----", function () {
    it("owner should see fund, owner should send money to player B, \
    owner should demote manager B to 0", async function () {
        if(!doTest[18] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as owner
        let dataO = await connectAsOwner();
        if(!dataO || !dataO.contract || !dataO.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractO = dataO.contract;
        // owner see fund
        // try {
        //   let fund = await contractO.getContractBalance();
        //   console.log("fund: " + parseInt(fund._hex.toString(), 16));
        // } catch(e) {
        //   progressiveTestState = false;
        //   console.log("owner cant see fund");
        //   return;
        // }
        // owner send money to owner's different account
        try {
          let tx = await contractO.withdrawAsAdmin(Object.keys(ganacheAccounts.addresses)[9], 100, "as it was");
          const txReceipt1 = await tx.wait();
        } catch(e) {
          //console.log(contractO);
          progressiveTestState = false;
          console.log("owner cant send money to his different account");
          return;
        }
        // owner demote manager B to 0
        try {
          let tx = await contractO.updateUser(Object.keys(ganacheAccounts.addresses)[4], 0, "B", false);
          const txReceipt1 = await tx.wait();
        } catch(e:any) {
          progressiveTestState = false;
          console.log("owner cant demote manager B to 0", contractO);
          return;
        }
        console.log("test18 ok");
    });
  })
  /**
   * owner see contract balance (total fund)
   * owner set B to manager (admin level 2) again
   * Manager B make league 5
   */
  describe("----test19----", function () {
    it("owner should see contract balance, owner should set B to manager (admin level 2) again, \
    manager B should make league 5", async function () {
        if(!doTest[19] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as owner
        let dataO = await connectAsOwner();
        if(!dataO || !dataO.contract || !dataO.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractO = dataO.contract;
        // // owner see contract balance
        // try {
        //   let fund = await contractO.getContractBalance();
        //   console.log("fund: " + parseInt(fund._hex.toString(), 16));
        // } catch(e) {
        //   progressiveTestState = false;
        //   console.log("owner cant see fund");
        //   return;
        // }
        // owner set B to manager (admin level 2) again
        try {
          let tx = await contractO.updateUser(Object.keys(ganacheAccounts.addresses)[4], 2, "B", false);
          const txReceipt1 = await tx.wait();
        } catch(e) {
          progressiveTestState = false;
          console.log("owner cant set B to manager (admin level 2) again");
          return;
        }
        // connect as manager B
        let dataB = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[4]);
        if(!dataB || !dataB.contract || !dataB.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractB = dataB.contract;
        // Manager B make league 5
        try {
          let tx = await contractB.makeWaitingLeague("game5", 5000, 1655337775, 1655357775, 10, 0, ["kill 50 minions", "destroy outer tower", "kill opposite player", "dance on the dead body"], ['or', 'or', 'and']);
          const lastLeagueId = await contractB.lastLeagueId();
          console.log(lastLeagueId);
          const txReceipt1 = await tx.wait();
        } catch(e) {
          progressiveTestState = false;
          console.log("manager B cant make league 5");
          return;
        }
        console.log("test19 ok");
    });
  })
  /**
   * player C, D, E joins league 5 with fee 5000
   */
  describe("----test20----", function () {
    it("player C, D, E should join league 5 with fee 5000", async function () {
        if(!doTest[20] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as player C
        let dataC = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[5]);
        if(!dataC || !dataC.contract || !dataC.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractC = dataC.contract;
        // connect as player D
        let dataD = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[6]);
        if(!dataD || !dataD.contract || !dataD.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractD = dataD.contract;
        // connect as player E
        let dataE = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[7]);
        if(!dataE || !dataE.contract || !dataE.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractE = dataE.contract;
        // player C join league 5 with fee 5000
        try {
          let tx = await contractC.joinLeague(5, "C", {value:5000});
          const txReceipt1 = await tx.wait();
          console.log("player C CAN JOIN????? he is blocked!!!!");
          progressiveTestState = false;
          return;
        } catch(e) {
          console.log("player C cant join league 5, which is expected");
        }
        // player D join league 5 with fee 5000
        try {
          let tx = await contractD.joinLeague(5, "D", {value:5000});
          const txReceipt1 = await tx.wait();
        } catch(e) {
          progressiveTestState = false;
          console.log("player D cant join league 5 with fee 5000");
          return;
        }
        // player E join league 5 with fee 5000
        try {
          let tx = await contractE.joinLeague(5, "E", {value:5000});
          const txReceipt1 = await tx.wait();
        }
        catch(e) {
          progressiveTestState = false;
          console.log("player E cant join league 5 with fee 5000");
          return;
        }
        console.log("test20 ok");
    });
  })

    /**
     * Manager B start league 5
     * Owner see fund
     * Manager finsih league 5 where C is winner
     */
  describe("----test21----", function () {
    it("manager B should start league 5, owner should see fund, \
    manager B should finish league 5 where C is winner", async function () {
        if(!doTest[21] || !progressiveTestState) {
            this.skip();
        }
        this.timeout(0);
        // connect as owner
        let dataO = await connectAsOwner();
        if(!dataO || !dataO.contract || !dataO.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractO = dataO.contract;
        // connect as manager B
        let dataB = await connectAsUserWithPrivateKey(Object.values(ganacheAccounts.private_keys)[4]); 
        if(!dataB || !dataB.contract || !dataB.accountAddress) {
          progressiveTestState = false;
          console.log("failed");
          return;
        }
        let contractB = dataB.contract;
        // manager B start league 5
        try {
          let tx = await contractB.makePlayingLeague(5);
          const txReceipt1 = await tx.wait();
        } catch(e) {
          progressiveTestState = false;
          console.log("manager B cant start league 5");
          return;
        }
        // owner see fund
        // try {
        //   let fund = await contractO.getContractBalance();
        //   console.log("fund: " + parseInt(fund._hex.toString(), 16));
        // } catch(e) {
        //   progressiveTestState = false;
        //   console.log("owner cant see fund");
        //   return;
        // }
        // manager B finish league 5 where C is winner
        try {
          let tx = await contractB.makeDoneLeague(5, ["C"]);
          const txReceipt1 = await tx.wait();
          console.log("Manager B can close league 5 with C being winner????? wtf??");
          progressiveTestState = false;
          return;
        } catch(e) {
          console.log("manager B cant finish league 5 where C is winner, which is correct!");
          // manager B finish league 5 where D is winner
          try {
            let tx = await contractB.makeDoneLeague(5, ["D"]);
            const txReceipt1 = await tx.wait();
          } catch(e) {
            progressiveTestState = false;
            console.log("manager B cant finish league 5 where D is winner");
            return;
          }
        }
        console.log("test21 ok");
    });
  });