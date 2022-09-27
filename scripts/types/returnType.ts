import { LogDescription } from "ethers/lib/utils";
import {moneyInfoType} from "../utils/getMoney";
export type SuccessReturn = {
    type: "success",
    values: {
        hash: string;
        logs: LogDescription[],
        money: moneyInfoType;
    },

}
export type ErrorReturn = {
    type: "error",
    values: {
        reason: string
    }
};

export type ViewReturn = {
    type: "view",
    values: {
        ok: boolean
    }
};