/**
 * MOST of the types for the contract functions
 * are generated from the ABI using @scripts/abiToTypes.ts
 */

import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;
import thanksSecurityABI from "../../abis/ThanksSecurity.json";
import thanksPayDataABI from "../../abis/ThanksData.json";
import thanksPayMainABI from "../../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";
import oldThanksABI from "../../abis/oldThanks.json";

export type ContractABIType =
  | any
  | typeof thanksSecurityABI
  | typeof thanksPayDataABI
  | typeof thanksPayCheckABI
  | typeof thanksPayMainABI
  | typeof thanksPayRelayABI
  | typeof oldThanksABI;

type AuthorizeType = {
  contractAddresses: string[];
  humanAddresses: string[];
};

type IsAuthorizedType = {
  account: string;
};

export type ThanksPaySecurityAdditionalType = {
  authorize: AuthorizeType;
  isAuthorized: IsAuthorizedType;
  // not used
};