
# How to re-produce the test in the spread-sheet (IMPORTANT)

- https://docs.google.com/spreadsheets/d/1v1RKLA-Yhwed0x9qBSTzaXiDYA-SZZjcI7eSJ6er1XU/edit?usp=sharing

First, clone the repo

then from $rootRepo:

- MAC/Linux: ```rm -rf transaction_log/*```
- Windows: ```rm -r -Force transaction_log/*```

## Compile contract:

```npx hardhat compile```

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

^ The red time (i.e: 13018ms) means 13.018 seconds or 13018 milliseconds.

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

for devs (more info behind the scene): https://github.com/realInt2k/thanksPayContractsDeployer/blob/olzhas/devREADME.md
