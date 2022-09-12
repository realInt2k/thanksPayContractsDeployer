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

export interface ThanksPayRelayInterface extends utils.Interface {
  functions: {
    "addProperty(uint256,uint256[],string[])": FunctionFragment;
    "editProperty(uint256,uint256[],string[])": FunctionFragment;
    "getPropertyName(uint256,uint256)": FunctionFragment;
    "setProperty(uint256,uint256,uint256[],string[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addProperty"
      | "editProperty"
      | "getPropertyName"
      | "setProperty"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addProperty",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "editProperty",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getPropertyName",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setProperty",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>[]
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addProperty",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "editProperty",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPropertyName",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProperty",
    data: BytesLike
  ): Result;

  events: {
    "propertyAdded(uint256,uint256[],string[])": EventFragment;
    "propertyEdited(uint256,uint256[],string[])": EventFragment;
    "propertySet(uint256,uint256,uint256[],string[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "propertyAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "propertyEdited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "propertySet"): EventFragment;
}

export interface propertyAddedEventObject {
  entityID: BigNumber;
  propertyIDs: BigNumber[];
  propertyNames: string[];
}
export type propertyAddedEvent = TypedEvent<
  [BigNumber, BigNumber[], string[]],
  propertyAddedEventObject
>;

export type propertyAddedEventFilter = TypedEventFilter<propertyAddedEvent>;

export interface propertyEditedEventObject {
  entityID: BigNumber;
  propertyIDs: BigNumber[];
  propertyNames: string[];
}
export type propertyEditedEvent = TypedEvent<
  [BigNumber, BigNumber[], string[]],
  propertyEditedEventObject
>;

export type propertyEditedEventFilter = TypedEventFilter<propertyEditedEvent>;

export interface propertySetEventObject {
  entityID: BigNumber;
  blockchainID: BigNumber;
  propertyID: BigNumber[];
  propertyValue: string[];
}
export type propertySetEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber[], string[]],
  propertySetEventObject
>;

export type propertySetEventFilter = TypedEventFilter<propertySetEvent>;

export interface ThanksPayRelay extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ThanksPayRelayInterface;

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
    addProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    editProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getPropertyName(
      entityID: PromiseOrValue<BigNumberish>,
      propertyID: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setProperty(
      entityID: PromiseOrValue<BigNumberish>,
      blockchainID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      propertyValues: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addProperty(
    entityID: PromiseOrValue<BigNumberish>,
    propertyIDs: PromiseOrValue<BigNumberish>[],
    _propertyNames: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  editProperty(
    entityID: PromiseOrValue<BigNumberish>,
    propertyIDs: PromiseOrValue<BigNumberish>[],
    _propertyNames: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getPropertyName(
    entityID: PromiseOrValue<BigNumberish>,
    propertyID: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  setProperty(
    entityID: PromiseOrValue<BigNumberish>,
    blockchainID: PromiseOrValue<BigNumberish>,
    propertyIDs: PromiseOrValue<BigNumberish>[],
    propertyValues: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    editProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    getPropertyName(
      entityID: PromiseOrValue<BigNumberish>,
      propertyID: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    setProperty(
      entityID: PromiseOrValue<BigNumberish>,
      blockchainID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      propertyValues: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "propertyAdded(uint256,uint256[],string[])"(
      entityID?: null,
      propertyIDs?: null,
      propertyNames?: null
    ): propertyAddedEventFilter;
    propertyAdded(
      entityID?: null,
      propertyIDs?: null,
      propertyNames?: null
    ): propertyAddedEventFilter;

    "propertyEdited(uint256,uint256[],string[])"(
      entityID?: null,
      propertyIDs?: null,
      propertyNames?: null
    ): propertyEditedEventFilter;
    propertyEdited(
      entityID?: null,
      propertyIDs?: null,
      propertyNames?: null
    ): propertyEditedEventFilter;

    "propertySet(uint256,uint256,uint256[],string[])"(
      entityID?: null,
      blockchainID?: null,
      propertyID?: null,
      propertyValue?: null
    ): propertySetEventFilter;
    propertySet(
      entityID?: null,
      blockchainID?: null,
      propertyID?: null,
      propertyValue?: null
    ): propertySetEventFilter;
  };

  estimateGas: {
    addProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    editProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getPropertyName(
      entityID: PromiseOrValue<BigNumberish>,
      propertyID: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setProperty(
      entityID: PromiseOrValue<BigNumberish>,
      blockchainID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      propertyValues: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    editProperty(
      entityID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      _propertyNames: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getPropertyName(
      entityID: PromiseOrValue<BigNumberish>,
      propertyID: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setProperty(
      entityID: PromiseOrValue<BigNumberish>,
      blockchainID: PromiseOrValue<BigNumberish>,
      propertyIDs: PromiseOrValue<BigNumberish>[],
      propertyValues: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}