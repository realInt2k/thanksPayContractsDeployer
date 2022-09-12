/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  ThanksDataStatic,
  ThanksDataStaticInterface,
} from "../../../contracts/data/ThanksDataStatic";

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
        internalType: "uint256",
        name: "pId",
        type: "uint256",
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
        internalType: "uint256",
        name: "pId",
        type: "uint256",
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
        internalType: "uint256",
        name: "pId",
        type: "uint256",
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
        name: "wId",
        type: "uint256",
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
        internalType: "uint256",
        name: "wId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pId",
        type: "uint256",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        name: "bonus",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        name: "wage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "pId",
        type: "uint256",
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
  "0x608060405234801561001057600080fd5b50610291806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063c3b49d0414610046578063cefbfa3614610078578063f1a22dc2146100a8575b600080fd5b610060600480360381019061005b9190610188565b6100db565b60405161006f939291906101c4565b60405180910390f35b610092600480360381019061008d9190610188565b610105565b60405161009f91906101fb565b60405180910390f35b6100c260048036038101906100bd9190610188565b61011d565b6040516100d29493929190610216565b60405180910390f35b60016020528060005260406000206000915090508060000154908060010154908060020154905083565b60036020528060005260406000206000915090505481565b60026020528060005260406000206000915090508060000154908060010154908060020154908060030154905084565b600080fd5b6000819050919050565b61016581610152565b811461017057600080fd5b50565b6000813590506101828161015c565b92915050565b60006020828403121561019e5761019d61014d565b5b60006101ac84828501610173565b91505092915050565b6101be81610152565b82525050565b60006060820190506101d960008301866101b5565b6101e660208301856101b5565b6101f360408301846101b5565b949350505050565b600060208201905061021060008301846101b5565b92915050565b600060808201905061022b60008301876101b5565b61023860208301866101b5565b61024560408301856101b5565b61025260608301846101b5565b9594505050505056fea2646970667358221220a3f133b45c4fe450d358836ce63bfc2911c9f487d7d1567d1ded4e12ac96fff664736f6c63430008090033";

type ThanksDataStaticConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ThanksDataStaticConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ThanksDataStatic__factory extends ContractFactory {
  constructor(...args: ThanksDataStaticConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ThanksDataStatic> {
    return super.deploy(overrides || {}) as Promise<ThanksDataStatic>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ThanksDataStatic {
    return super.attach(address) as ThanksDataStatic;
  }
  override connect(signer: Signer): ThanksDataStatic__factory {
    return super.connect(signer) as ThanksDataStatic__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ThanksDataStaticInterface {
    return new utils.Interface(_abi) as ThanksDataStaticInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ThanksDataStatic {
    return new Contract(address, _abi, signerOrProvider) as ThanksDataStatic;
  }
}
