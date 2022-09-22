
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


#### Deploy all contracts 

Run the following terminal command: 

```
npx ts-node ./scripts/deploy.ts --networkName=newNetwork
```
This will deploy new contracts, and authorize you appropriately.

#### Run some functions
To test some contracts and functions, go to `test/test_olzhas.ts`, and change the following:
```
        const thanksPayMain = new ThanksPayMain("newNetwork");
        const thanksPayData = new ThanksPayData("newNetwork");
        const thanksPayRelay = new ThanksPayRelay("newNetwork");
```
This will connect you to the new network! Write the test below, and run them with the terminal command:

```
mocha -r ts-node/register test/test_olzhas.ts
```

To view which functions are available, you can check `scripts/types/contractType.ts`. To view the return objects, see `scripts/types/returnType.ts`. To see the transaction receipt, which includes the transaction fee (in gas), you can print `(result as SuccessReturn).values.receipt.cumulativeGasUsed`, and see the gas price (or something similar). To convert to dollars, google the gas price in the native currency of your blockchain network.




