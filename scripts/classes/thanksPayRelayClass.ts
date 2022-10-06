import { networkNameType } from "@scripts/types/networkNameType";
import { ThanksPayContracts } from "./baseContractClass";
import thanksPayRelayABI from "@abis/ThanksPayRelay.json";
import { ThanksPayRelayType } from "@scripts/generatedTypes/ThanksPayRelayType";

// up-to-date as of 2021-09-12
export class ThanksPayRelay extends ThanksPayContracts {
  constructor(networkName: networkNameType) {
    super("THANKS_PAY_RELAY_ADDR", networkName, thanksPayRelayABI);
  }
  public methods = {
    setDynamicProperties: async (
      args: ThanksPayRelayType["setDynamicProperties"]
    ) => {
      return await this.sendTx("setDynamicProperties", args);
    },
    setStaticProperties: async (
      args: ThanksPayRelayType["setStaticProperties"]
    ) => {
      return await this.sendTx("setStaticProperties", args);
    },
    alterEntityNames: async (args: ThanksPayRelayType["alterEntityNames"]) => {
      return await this.sendTx("alterEntityNames", args);
    },
    alterPropertyNames: async (
      args: ThanksPayRelayType["alterPropertyNames"]
    ) => {
      return await this.sendTx("alterPropertyNames", args);
    },
    getAllEntities: async (args: ThanksPayRelayType["getAllEntities"]) => {
      return await this.sendTx("getAllEntities", args);
    },
    getAllProperties: async (args: ThanksPayRelayType["getAllProperties"]) => {
      return await this.sendTx("getAllProperties", args);
    },
  };
}
