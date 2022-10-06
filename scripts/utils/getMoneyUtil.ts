import { SuccessReturn } from "@scripts/types/returnType"
import { ethers } from "ethers";
import contractAddresses from "../contractAddresses.json";
import { networkNameType } from "@scripts/types/networkNameType";

export type moneyInfoType = {
    gasUsed: string;
    gasPrice: string;
    transactionFee: string;
    transactionFeeEthers: number;
    USD: number;
}

export const getMoney = (result: any, networkName: networkNameType) => {
    // console.log(result);
    const gas = (result).cumulativeGasUsed;
    const gasPrice = (result).effectiveGasPrice;
    const transactionFee = gasPrice.mul(gas);
    const transactionFeeEthers = parseFloat(ethers.utils.formatEther(transactionFee));

    return {
        gasUsed: gas.toBigInt().toString(),
        gasPrice: gasPrice.toBigInt().toString(),
        transactionFee: gas.mul(gasPrice).toBigInt().toString(),
        transactionFeeEthers: transactionFeeEthers,
        USD: contractAddresses[networkName]["network"]["USD"]*transactionFeeEthers
    };
}

export const getMoney2 = (result: any) => {
    return "success";
} 