
### Add a new blockchain network

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


#### Deploy the contracts
In blockchain, contract logic has to be deployed (i.e. instantiated) at a particular address, which can be called by users. This function takes the contracts in `./contracts`, and deploys them into particular addresses, i.e.:
```
    "THANKS_PAY_MAIN_ADDR": "0x36C68670b3c0148B9545f51DB95Bd3A05CB3Dd4E",
    "THANKS_PAY_DATA_ADDR": "0xD30a3503DFb107b07f713C5FC09EBebA273666BF",
    "THANKS_PAY_SECURITY_ADDR": "0xd60Cd6AC163086553a1d7ceB4496d809f78957C0",
    "THANKS_PAY_RELAY_ADDR": "0x0666D6E3B3A5641B9E4E22B5a88c22D226ee0eF1",
    "THANKS_PAY_CHECK_ADDR": "0xc543372AA4e6874d9950b26D828fdACC66C1FC31",
    "OLD_THANKS_ADDR": "0x0000000000000000000000000000000000000000000",
```
To deploy the contracts (currently, the new ThanksPay contracts and the oldThanks contract), run the following terminal command: 
```
npx ts-node ./scripts/deploy.ts --networkName=newNetwork
```
This will deploy BOTH the NEW and OLD contracts.
All contract addresses will be automatically written into `contractAddresses.json` for the `newNetwork`, and when you use tests (see below), you will only have to provide `newNetwork` name. 


#### Run some functions
To test the new Polygon contracts, go to `test/test_polygon.ts` (for ), and change the following:
```
        const thanksPayMain = new ThanksPayMain("newNetwork");
        const thanksPayData = new ThanksPayData("newNetwork");
        const thanksPayRelay = new ThanksPayRelay("newNetwork");
```
This will connect you to the new network! Write the test below, and run them with the terminal command:

```
mocha -r ts-node/register test/test_polygon.ts
```

To view which functions are available, you can check `scripts/types/contractType.ts`.
To view the return objects, see `scripts/types/returnType.ts`. To see the transaction receipt, which includes the transaction fee (in gas), you can print `(result as SuccessReturn).values.receipt.cumulativeGasUsed`, and see the gas price (or something similar). To convert to dollars, google the gas price in the native currency of your blockchain network.