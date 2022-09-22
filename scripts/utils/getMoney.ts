import { SuccessReturn } from "@scripts/types/returnType"
import { ethers } from "ethers";
import contractAddresses from "../contractAddresses.json";

export const getMoney = (result: SuccessReturn) => {
    const gas = (result as SuccessReturn).values.receipt.cumulativeGasUsed;
    const gasPrice = (result as SuccessReturn).values.receipt.effectiveGasPrice;
    const transactionFeeEthers = parseFloat(ethers.utils.formatEther(gas.mul(gasPrice)));

    return {
        gasUsed: gas,
        gasPrice: gasPrice,
        transactionFee: gas*gasPrice,
        transactionFeeEthers: transactionFeeEthers,
        USD: contractAddresses["klaytn"]["network"]["USDprice"]*transactionFeeEthers
    };
} 