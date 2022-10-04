
# How to re-produce the test in the spread-sheet (IMPORTANT)

- https://docs.google.com/spreadsheets/d/1v1RKLA-Yhwed0x9qBSTzaXiDYA-SZZjcI7eSJ6er1XU/edit?usp=sharing

First, clone the repo

then from $rootRepo:

- MAC/Linux: ```rm -rf transaction_log/*```
- Windows: ```rm -r -Force transaction_log/*```

## Start ganache:

```npm run start:ganache```

^ If error: try deleting $rootRepo/ganacheDB/ directory and run again

-Successful run: 

![image](https://user-images.githubusercontent.com/49155740/193948318-a6d27cd3-7d35-4648-a355-4767e8733a3e.png)

## Deploy the contracts to ganache, klaytn, Polygon:

- Ganache: ```npm run deploy:ganache:testnet```
- Polygon: ```npm run deploy:polygon:testnet```
- Klaytn: ```npm run deploy:klaytn:testnet```

^ That will deploy both old and new contracts to these 3 networks.

^ It will take a while.

^ If error: Contact Devs to pump more money to these test accounts.

- Example of successful klaytn deployment: 

![image](https://user-images.githubusercontent.com/49155740/193948461-aac0c029-8b55-4034-a664-47b877a13aff.png)

- It should be the same with Ganache, Polygon!

Now, you should understand the *order* of the test to read logs:

- Register 1 partner, 
- Register 1 worker to that partner, 
- Said partner deposits some money,
- Said Worker get some money from salary

Logs will be named after "nonce", don't need to understand what's nonce, it's basically
a number, and you can read say, last 4 largest numbers are the latest test transactions for example.

## Get results for old contracts:

### Polygon: 
- npm run ```test:old2:polygon:testnet```

**Read on the terminal how much time does each transaction take**

-Example: 

![image](https://user-images.githubusercontent.com/49155740/193948999-df57620b-7cd7-4a88-94c9-20e7362b3c87.png)
![image](https://user-images.githubusercontent.com/49155740/193949019-c1f0da81-c82f-4bf8-a9b9-6aa3ade82935.png)

^ The red time (i.e: 13018ms) means 13,018 seconds.

Then navigate to $rootRepo/transaction_log/old_contract/polygontest/synced/

Then read latest 4 logs

-Example of one log: ![image](https://user-images.githubusercontent.com/49155740/193949170-e54bfd2a-8135-49ed-8f77-8538a2f0ef77.png)

^ Things to read: gasUsed, gasPrice, USD, networkname, function used by the old contract.

### Klaytn:
- Klaytn: ```npm run test:old2:klaytn:testnet```

Read on the terminal how much time does each transaction take

Then navigate to $rootRepo/transaction_log/old_contract/klaytn/synced/

Then read latest 4 logs

- Example is the same as Polygon

## Get results for new contracts:
### First you HAVE to send them to ganache (to measure speed)
- ```npm run test:new2:ganache:testnet```

**Read on the terminal how much time each transaction takes**
-Example:

![image](https://user-images.githubusercontent.com/49155740/193949494-6a0d038d-f35c-494a-8c3d-dea72f37d6d0.png)
![image](https://user-images.githubusercontent.com/49155740/193949508-46edddfa-bacc-496d-9b7c-917fefee525c.png)

- Read the red time thingy

Then an un-synced transaction logs will be here: 

- $rootRepo/transaction_log/new_contract/polygonTest/unsynced/*
- $rootRepo/transaction_log/new_contract/klaytn/unsynced/*

But you don't need to read it

### Then you run the background Klaytn, Polygon (to measure cost):

- On one terminal: ```ts-node $rootRepo/scripts/utils/klaytnScriptUnderground.ts```
- On other terminal: ```ts-node $rootRepo/scripts/utils/polygonScriptUnderground.ts```

example of klaytn background script:
- ![image](https://user-images.githubusercontent.com/49155740/193946992-98a7f195-7214-4699-8972-6cf80ecb9855.png)

Then, the synced transaction logs will be here:

- $rootRepo/transaction_log/new_contract/polygonTest/synced/*
- $rootRepo/transaction_log/new_contract/klaytn/synced/*

You read them to collect costs.

- Example: 

![image](https://user-images.githubusercontent.com/49155740/193949625-faaab011-686f-4824-ac94-22b893b63fe7.png)

![image](https://user-images.githubusercontent.com/49155740/193949642-9ae2505d-21a8-47a3-91f6-930c4383dc98.png)

- Well, you know what to look at!


## Read background-speed (OPTIONAL)

- Example for Polygon (klaytn apply same method): 
```npm run test:new2:polygon:testnet```

![image](https://user-images.githubusercontent.com/49155740/193948734-5e5a185b-4ff3-4074-9434-d93cb9b0c4e2.png)

---


## Add a new blockchain network

To add a new blockchain network (i.e. Polygon or Klaytn), go to `scripts/contractAddresses`, and add a new object with network specifications:
```
"newNetwork": {
    "THANKS_PAY_MAIN_ADDR": "",
    "THANKS_PAY_DATA_ADDR": "",
    "THANKS_PAY_SECURITY_ADDR": "",
    "THANKS_PAY_RELAY_ADDR": "",
    "THANKS_PAY_CHECK_ADDR": "",
    "network": {
      "provider": "https://rpc-mumbai.maticvigil.com/",
      "key": "0x29b2e592b4f40ee0d6fee08be9a65290d7afdd30a9dfb7883c8ae7b970618a98",
      "account": "0x0bb1d88859FEe17c7F9C13CB55B83784ce7Eb402"
    }
  }
```
Provider: RPC provider for the network (google it)
Key: private key of your account (in case you are using a public network, you should have some currency of that blockchain).

## Testing the new system

#### 0. Install Ganache and set up folders: DO THIS ONLY ONCE!
Ganache is a blockchain simulator. We need it to make the system faster and more responsive. You can install it globally (recommended) by typing:
```
npm install -g ganache@latest
```

Also, run the following script to create a `transaction_log` folder (it will hold the information about the transactions and associated costs):
```
npm run init:transaction_log
```
(this instruction will take a while. This is because git doesn't allow to push empty folders, so we have to create their structure anew. If you have other suggestions, please contact me).


#### 1. Start Ganache (VM) and Polygon Polling
Start Ganache (VM) with the following commands:
```
npm run start:ganache
```
First, we will submit all transactions to Ganache (Virtual Machine), and then polygon will listen to these transactions and replicate them (using a special script).

Deploy all smart contracts on both Ganache and Polygon:
```
npx hardhat compile
npm run deploy:ganache:testnet
npm run deploy:polygon:testnet
```

All contract addresses will be automatically written into `contractAddresses.json` for the `newNetwork`, and when you use tests (see below), you will only have to provide `newNetwork` name. 


Now, start the script that syncs the transactions with the Polygon:
```
npm run start:polygonPolling
```

This script will listen to all transactions submitted to VM, and then duplicate them to Polygon. You can see the list of transactions on `./transaction_log/new_contract`.
Also, the money price will be automatically appended in `./transaction_log/new_contract/synced/__.json`, assuming price of Polygon MATIC is 0.7 dollars (you can recalculate later).


#### Run some functions
Now, we can send some transactions to Ganache, and they will be synced with Polygon later (as long as the process is running).
To test the contracts, you can go to `./test/test_new2.ts`. 
To use the API, you can just do the following:

```
// import the return types
import { SuccessReturn, ErrorReturn, ViewReturn, CheckReturn } from "./types/returnType";
// import the new contracts
import {
  ThanksPayMain,
  ThanksPayData,
  ThanksPayRelay,
  ThanksPayCheck,
  ThanksPaySecurity,
} from "../scripts/types/contractType";
// import the types
import { ThanksPaySuperType } from "./generatedTypes/ThanksPaySuperType";
import { getMoney2, getMoney } from '../scripts/utils/getMoney';
import { getNetworkName } from "../scripts/utils/getNetworkName";
import { networkNameType } from "./types/networkNameType";

// first, send transactions to ganache
const networkName = "ganache";
console.log(networkName);

var thanksPay;
// change to a unique ID.
const partnerId = 2011; 

describe("ThanksPay", function () {
  describe("Deployment", function () {
    it("Should create contract, the worker and the partner", async function () {
      this.timeout(0);

      // create a connection to smart contract. It will handle connection etc for you.
      const thanksPayData = new ThanksPayData(networkName);
      const thanksPayRelay = new ThanksPayRelay(networkName);
      const thanksPayCheck = new ThanksPayCheck(networkName);
      const thanksPaySecurity = new ThanksPaySecurity(networkName);
    /**
     * REGISTER A PARTNER:
     */
      let registerPartnerArgs: ThanksPaySuperType["thanksPayData"]["registerPartner"] =
        {
          pId: partnerId,
          latestPay: 1663007942,
        };

      const result = await thanksPayData.methods.registerPartner(
        registerPartnerArgs
      );
      if (result.type == "success") {
        console.log("registered Partner: ", result as SuccessReturn);
      } else {
        console.log("failed to register Partner");
      }
...

```
Alternaitvely, you can run some tests directly:
```
npm run test:new2:ganache:testnet
```
Currently, it is testing: registering a partner, registering a worker, partner putting in some money, and worker getting a thanksPay (some more functions can be added, see the list of available functions at `./scripts/types/contractType.ts`):



### Successful transactions
The successful transactions give information about the update of the Blockchain state (in event logs),
and some information about the money (I think this one is more important in case of a polygonScript).
Here is how you can get this information:
```
  const result3 = await thanksPayMain.methods.partnerAddBalance(
    partnerAddBalanceArgs
  ) as SuccessReturn;
  console.log("Logs of result3: ", result3.values.logs);
  console.log("Money used in the transaction: ", result3.values.logs);
```
Note: this information is for the network you are ORIGINALLY sending to (in case of the new implementation, it's Ganache).
If you want to know Polygon-specific price, you can check it at `transaction_log/new_contract/synced` folder. 

If you want to change this process, please refer to `polygonScriptUnderground.ts` file and find this information there (see `getTxDetails` function in `scripts/utils`: submit a tx receipt in there and you will get the money information, the logs, etc.).

This will give the following information:
```
Logs of result3:  [
LogDescription {
    ...
    name: 'partnerAddBalanceEvent',
    ...        
    args: [
      ...
      pId: [BigNumber],
      amount: [BigNumber],
      timestamp: [BigNumber]
    ]
  }
]
Money used in the transaction:  {
  gasUsed: BigNumber { _hex: '0x012e0b', _isBigNumber: true },
  gasPrice: BigNumber { _hex: '0x596835e0', _isBigNumber: true },
  transactionFee: BigNumber { _hex: '0x697cc70890a0', _isBigNumber: true },
  transactionFeeEthers: 0.00011598463608848,
  USD: 0
}
```
This assumes that a transaction is successfully passed. It can also be not successfully passed, in this case, see all possible\ return objects at `scripts/types/returnType.ts`.


## Testing the old system

In the old system, there is no Virtual Machine (Ganache) and all transactions are sent directly to the blockchain.
You can check the prices in the `transaction_log/old_contract/synced` folder. 

(Note: technically speaking, Klaytn price has dropped by 10 times in the last year, and is currently dramatically fluctuating, so the actual transaction fees on Klaytn might be cheaper...
However, our contracts are still cheaper & faster, so it is better to compare on the same network (Polygon or Klaytn).
Our contracts are guaranteed to be faster due to the use of VM, and they are cheaper because of restructuring of data and so on. Now that all setup with VM and passing transactions work, we may work a bit more to optimize the contracts in terms of price) 

So:
```
import { OldThanks } from "./types/contractType";
  import { oldThanksType } from './generatedTypes/oldThanksType';
  var thanksPay;
  const partnerId = 1;
  
  describe("ThanksPay", function () {
    describe("Deployment", function () {
      const networkName = "polygonTest"
      it("Should create contract, the worker and the partner", async function () {
        this.timeout(0);
        const oldThanks = new OldThanks("polygonTest");
  
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
            console.log("Transaction gas is: ", getMoney2(result as SuccessReturn));
        }
      });
    });
  });
```
Just run:
```
npm run test:old2:polygon:testnet
<<<<<<< HEAD
```
=======
```

(Note: technically speaking, Klaytn price has dropped by 10 times in the last year, and is currently dramatically fluctuating, so the actual transaction fees on Klaytn might be cheaper...
However, our contracts are still cheaper & faster, so it is better to compare on th same network (Polygon or Klaytn). Our contracts are guaranteed to be faster due to the use of VM, and they are cheaper because of restructuring of data and so on. Now that all setup with VM and passing transactions work, we may work a bit more to optimize the contracts in terms of price.) 
>>>>>>> 3c04f520411c13a5550c5cd322730fe994220739
