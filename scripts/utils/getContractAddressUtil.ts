import { contractNameType } from "@scripts/types/contractNameType";
import { networkNameType } from "@scripts/types/networkNameType";
import contractAddresses from "../contractAddresses.json";

export const getContractAddress = (
    networkName: networkNameType,
    contractName: contractNameType
  ) => {
    return contractAddresses[networkName][contractName];
  };