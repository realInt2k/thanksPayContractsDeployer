import { SuccessReturn, ErrorReturn, ViewReturn } from "../types/returnType";
import { networkNameType } from "../types/networkNameType";
import { writeToTxLog } from "@scripts/utils/writeToTransactionLogUtil";
import { contractNameType } from "../types/contractNameType";
import { ethers } from "ethers";
import { getMoney } from "./getMoneyUtil";


export const getTxDetails = async (
    txReceipt: any,
    networkName: networkNameType,
    iface?: any,
    ): Promise<SuccessReturn> => {
    // console.log(txReceipt);
        return {
        type: "success",
        values: {
            hash: txReceipt.transactionHash,
            logs: txReceipt.logs.map((log: any) => {
                try {
                    if (iface) {
                        return iface.parseLog(log);
                    } else {
                        return "No iface!";
                    }
                } catch (e: any) {
                    console.log("Some unknown error, but everything seems fine");
                }
            }),
            money: getMoney(txReceipt, networkName)
        }
    };
}