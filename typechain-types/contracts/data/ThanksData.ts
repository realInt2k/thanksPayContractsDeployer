/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface ThanksDataInterface extends utils.Interface {
  functions: {
    "getPartner(uint256)": FunctionFragment;
    "getPartnerThanksPayableBalance(uint256)": FunctionFragment;
    "getPartnerWithdrawableBalance(uint256)": FunctionFragment;
    "getWorker(uint256)": FunctionFragment;
    "getWorkerBalance(uint256)": FunctionFragment;
    "partners(uint256)": FunctionFragment;
    "registerPartner(uint256,uint256)": FunctionFragment;
    "registerWorker(uint256,uint256,uint256)": FunctionFragment;
    "setLatestRequest(uint256,uint256)": FunctionFragment;
    "setLatestWagePay(uint256,uint256)": FunctionFragment;
    "setPartnerBalance(uint256,uint256)": FunctionFragment;
    "setPartnerBonus(uint256,uint256)": FunctionFragment;
    "setWorkerBalance(uint256,uint256)": FunctionFragment;
    "types(uint256)": FunctionFragment;
    "workers(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getPartner"
      | "getPartnerThanksPayableBalance"
      | "getPartnerWithdrawableBalance"
      | "getWorker"
      | "getWorkerBalance"
      | "partners"
      | "registerPartner"
      | "registerWorker"
      | "setLatestRequest"
      | "setLatestWagePay"
      | "setPartnerBalance"
      | "setPartnerBonus"
      | "setWorkerBalance"
      | "types"
      | "workers"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getPartner",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPartnerThanksPayableBalance",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPartnerWithdrawableBalance",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getWorker",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getWorkerBalance",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "partners",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerPartner",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerWorker",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setLatestRequest",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setLatestWagePay",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPartnerBalance",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPartnerBonus",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setWorkerBalance",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "types",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "workers",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "getPartner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPartnerThanksPayableBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPartnerWithdrawableBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getWorker", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getWorkerBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "partners", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerPartner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerWorker",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLatestRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLatestWagePay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPartnerBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPartnerBonus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setWorkerBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "types", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "workers", data: BytesLike): Result;

  events: {
    "companyRegistered(uint256,uint256)": EventFragment;
    "partnerBalanceChanged(uint256,uint256)": EventFragment;
    "partnerRegistered(uint256,uint256)": EventFragment;
    "workerBalanceChanged(uint256,uint256)": EventFragment;
    "workerRegistered(uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "companyRegistered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "partnerBalanceChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "partnerRegistered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "workerBalanceChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "workerRegistered"): EventFragment;
}

export interface companyRegisteredEventObject {
  pId: BigNumber;
  latestPay: BigNumber;
}
export type companyRegisteredEvent = TypedEvent<
  [BigNumber, BigNumber],
  companyRegisteredEventObject
>;

export type companyRegisteredEventFilter =
  TypedEventFilter<companyRegisteredEvent>;

export interface partnerBalanceChangedEventObject {
  pId: BigNumber;
  newBalance: BigNumber;
}
export type partnerBalanceChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  partnerBalanceChangedEventObject
>;

export type partnerBalanceChangedEventFilter =
  TypedEventFilter<partnerBalanceChangedEvent>;

export interface partnerRegisteredEventObject {
  pId: BigNumber;
  latestPay: BigNumber;
}
export type partnerRegisteredEvent = TypedEvent<
  [BigNumber, BigNumber],
  partnerRegisteredEventObject
>;

export type partnerRegisteredEventFilter =
  TypedEventFilter<partnerRegisteredEvent>;

export interface workerBalanceChangedEventObject {
  wId: BigNumber;
  newBalance: BigNumber;
}
export type workerBalanceChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  workerBalanceChangedEventObject
>;

export type workerBalanceChangedEventFilter =
  TypedEventFilter<workerBalanceChangedEvent>;

export interface workerRegisteredEventObject {
  wId: BigNumber;
  pId: BigNumber;
  wage: BigNumber;
}
export type workerRegisteredEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  workerRegisteredEventObject
>;

export type workerRegisteredEventFilter =
  TypedEventFilter<workerRegisteredEvent>;

export interface ThanksData extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ThanksDataInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getPartner(
      pId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        bonus: BigNumber;
        latestPay: BigNumber;
      }
    >;

    getPartnerThanksPayableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPartnerWithdrawableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getWorker(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        wage: BigNumber;
        pId: BigNumber;
        latestRequest: BigNumber;
      }
    >;

    getWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    partners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        bonus: BigNumber;
        latestPay: BigNumber;
      }
    >;

    registerPartner(
      pId: PromiseOrValue<BigNumberish>,
      latestPay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    registerWorker(
      wId: PromiseOrValue<BigNumberish>,
      pId: PromiseOrValue<BigNumberish>,
      wage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setLatestRequest(
      wId: PromiseOrValue<BigNumberish>,
      latestRequest: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setLatestWagePay(
      pId: PromiseOrValue<BigNumberish>,
      timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPartnerBalance(
      pId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPartnerBonus(
      pId: PromiseOrValue<BigNumberish>,
      bonus: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    types(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    workers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        wage: BigNumber;
        pId: BigNumber;
        latestRequest: BigNumber;
      }
    >;
  };

  getPartner(
    pId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      balance: BigNumber;
      bonus: BigNumber;
      latestPay: BigNumber;
    }
  >;

  getPartnerThanksPayableBalance(
    partner: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPartnerWithdrawableBalance(
    partner: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getWorker(
    wId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      balance: BigNumber;
      wage: BigNumber;
      pId: BigNumber;
      latestRequest: BigNumber;
    }
  >;

  getWorkerBalance(
    wId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  partners(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      balance: BigNumber;
      bonus: BigNumber;
      latestPay: BigNumber;
    }
  >;

  registerPartner(
    pId: PromiseOrValue<BigNumberish>,
    latestPay: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  registerWorker(
    wId: PromiseOrValue<BigNumberish>,
    pId: PromiseOrValue<BigNumberish>,
    wage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setLatestRequest(
    wId: PromiseOrValue<BigNumberish>,
    latestRequest: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setLatestWagePay(
    pId: PromiseOrValue<BigNumberish>,
    timestamp: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPartnerBalance(
    pId: PromiseOrValue<BigNumberish>,
    newBalance: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPartnerBonus(
    pId: PromiseOrValue<BigNumberish>,
    bonus: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setWorkerBalance(
    wId: PromiseOrValue<BigNumberish>,
    newBalance: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  types(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  workers(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      balance: BigNumber;
      wage: BigNumber;
      pId: BigNumber;
      latestRequest: BigNumber;
    }
  >;

  callStatic: {
    getPartner(
      pId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        bonus: BigNumber;
        latestPay: BigNumber;
      }
    >;

    getPartnerThanksPayableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPartnerWithdrawableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWorker(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        wage: BigNumber;
        pId: BigNumber;
        latestRequest: BigNumber;
      }
    >;

    getWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    partners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        bonus: BigNumber;
        latestPay: BigNumber;
      }
    >;

    registerPartner(
      pId: PromiseOrValue<BigNumberish>,
      latestPay: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    registerWorker(
      wId: PromiseOrValue<BigNumberish>,
      pId: PromiseOrValue<BigNumberish>,
      wage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setLatestRequest(
      wId: PromiseOrValue<BigNumberish>,
      latestRequest: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setLatestWagePay(
      pId: PromiseOrValue<BigNumberish>,
      timestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPartnerBalance(
      pId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPartnerBonus(
      pId: PromiseOrValue<BigNumberish>,
      bonus: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    types(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    workers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        balance: BigNumber;
        wage: BigNumber;
        pId: BigNumber;
        latestRequest: BigNumber;
      }
    >;
  };

  filters: {
    "companyRegistered(uint256,uint256)"(
      pId?: null,
      latestPay?: null
    ): companyRegisteredEventFilter;
    companyRegistered(
      pId?: null,
      latestPay?: null
    ): companyRegisteredEventFilter;

    "partnerBalanceChanged(uint256,uint256)"(
      pId?: null,
      newBalance?: null
    ): partnerBalanceChangedEventFilter;
    partnerBalanceChanged(
      pId?: null,
      newBalance?: null
    ): partnerBalanceChangedEventFilter;

    "partnerRegistered(uint256,uint256)"(
      pId?: null,
      latestPay?: null
    ): partnerRegisteredEventFilter;
    partnerRegistered(
      pId?: null,
      latestPay?: null
    ): partnerRegisteredEventFilter;

    "workerBalanceChanged(uint256,uint256)"(
      wId?: null,
      newBalance?: null
    ): workerBalanceChangedEventFilter;
    workerBalanceChanged(
      wId?: null,
      newBalance?: null
    ): workerBalanceChangedEventFilter;

    "workerRegistered(uint256,uint256,uint256)"(
      wId?: null,
      pId?: null,
      wage?: null
    ): workerRegisteredEventFilter;
    workerRegistered(
      wId?: null,
      pId?: null,
      wage?: null
    ): workerRegisteredEventFilter;
  };

  estimateGas: {
    getPartner(
      pId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPartnerThanksPayableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPartnerWithdrawableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWorker(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    partners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerPartner(
      pId: PromiseOrValue<BigNumberish>,
      latestPay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    registerWorker(
      wId: PromiseOrValue<BigNumberish>,
      pId: PromiseOrValue<BigNumberish>,
      wage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setLatestRequest(
      wId: PromiseOrValue<BigNumberish>,
      latestRequest: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setLatestWagePay(
      pId: PromiseOrValue<BigNumberish>,
      timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPartnerBalance(
      pId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPartnerBonus(
      pId: PromiseOrValue<BigNumberish>,
      bonus: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    types(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    workers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getPartner(
      pId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPartnerThanksPayableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPartnerWithdrawableBalance(
      partner: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getWorker(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    partners(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerPartner(
      pId: PromiseOrValue<BigNumberish>,
      latestPay: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    registerWorker(
      wId: PromiseOrValue<BigNumberish>,
      pId: PromiseOrValue<BigNumberish>,
      wage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setLatestRequest(
      wId: PromiseOrValue<BigNumberish>,
      latestRequest: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setLatestWagePay(
      pId: PromiseOrValue<BigNumberish>,
      timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPartnerBalance(
      pId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPartnerBonus(
      pId: PromiseOrValue<BigNumberish>,
      bonus: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setWorkerBalance(
      wId: PromiseOrValue<BigNumberish>,
      newBalance: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    types(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    workers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}