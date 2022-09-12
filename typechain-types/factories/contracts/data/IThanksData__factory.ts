/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  IThanksData,
  IThanksDataInterface,
} from "../../../contracts/data/IThanksData";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "pId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "latestPay",
        type: "uint256",
      },
    ],
    name: "companyRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "pId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "partnerBalanceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "pId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "latestPay",
        type: "uint256",
      },
    ],
    name: "partnerRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "kind",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "workerBalanceChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "wId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wage",
        type: "uint256",
      },
    ],
    name: "workerRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "companies",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "partners",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "latestPay",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "types",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "workers",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "saving",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "borrow",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "wage",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "pId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "latestRequest",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610360806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806309b9aef314610051578063355e6ce8146100815780634048a257146100b157806395c33652146100e6575b600080fd5b61006b60048036038101906100669190610230565b610117565b6040516100789190610276565b60405180910390f35b61009b60048036038101906100969190610230565b61012f565b6040516100a89190610276565b60405180910390f35b6100cb60048036038101906100c69190610230565b61014d565b6040516100dd969594939291906102a0565b60405180910390f35b61010060048036038101906100fb9190610230565b6101a9565b60405161010e929190610301565b60405180910390f35b60056020528060005260406000206000915090505481565b60036020528060005260406000206000915090508060000154905081565b60046020528060005260406000206000915090508060000154908060010154908060020154908060030154908060040160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060050154905086565b60026020528060005260406000206000915090508060000154908060010154905082565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101fd826101d2565b9050919050565b61020d816101f2565b811461021857600080fd5b50565b60008135905061022a81610204565b92915050565b600060208284031215610246576102456101cd565b5b60006102548482850161021b565b91505092915050565b6000819050919050565b6102708161025d565b82525050565b600060208201905061028b6000830184610267565b92915050565b61029a816101f2565b82525050565b600060c0820190506102b56000830189610267565b6102c26020830188610267565b6102cf6040830187610267565b6102dc6060830186610267565b6102e96080830185610291565b6102f660a0830184610267565b979650505050505050565b60006040820190506103166000830185610267565b6103236020830184610267565b939250505056fea2646970667358221220e5a39908b6d550c5c24e494de1952a8e3ebd4d4e06253323ee5ab32225f8bd1564736f6c63430008090033";

type IThanksDataConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: IThanksDataConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class IThanksData__factory extends ContractFactory {
  constructor(...args: IThanksDataConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<IThanksData> {
    return super.deploy(overrides || {}) as Promise<IThanksData>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): IThanksData {
    return super.attach(address) as IThanksData;
  }
  override connect(signer: Signer): IThanksData__factory {
    return super.connect(signer) as IThanksData__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): IThanksDataInterface {
    return new utils.Interface(_abi) as IThanksDataInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IThanksData {
    return new Contract(address, _abi, signerOrProvider) as IThanksData;
  }
}
