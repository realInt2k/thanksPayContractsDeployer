import { networkNameType } from "@scripts/types/networkNameType";

import {
    ThanksPayData,
    ThanksPayMain,
    ThanksPayRelay,
    ThanksPayCheck,
    ThanksPaySecurity,
} from "@scripts/classes"


const NETWORK:networkNameType = "ganache";

export class ThanksPayServer {
    private thanksPayData: ThanksPayData;
    private thanksPayMain: ThanksPayMain;
    private thanksPayRelay: ThanksPayRelay;
    private thanksPayCheck: ThanksPayCheck;
    private thanksPaySecurity: ThanksPaySecurity;

    constructor() {
        this.thanksPayData = new ThanksPayData(NETWORK);
        this.thanksPayMain = new ThanksPayMain(NETWORK);
        this.thanksPayRelay = new ThanksPayRelay(NETWORK);
        this.thanksPayCheck = new ThanksPayCheck(NETWORK);
        this.thanksPaySecurity = new ThanksPaySecurity(NETWORK);
    }

    public methods = {
        registerWorker: async (args: any) => {
        }
    };
}