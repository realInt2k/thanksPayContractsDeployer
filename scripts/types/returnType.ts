import { LogDescription } from "ethers/lib/utils";

export type SuccessReturn = {
    type: "success",
    values: {
        hash: string;
        logs: LogDescription[],
        receipt: any;
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