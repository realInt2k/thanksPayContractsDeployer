import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;

import thanksSecurityABI from "../abis/ThanksSecurity.json";
import thanksPayDataABI from "../abis/ThanksData.json";
import thanksPayMainABI from "../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../abis/ThanksPayCheck.json";

export type ContractABIType =
  typeof thanksSecurityABI
  | typeof thanksPayDataABI 
  | typeof thanksPayCheckABI
  | typeof thanksPayMainABI // ok
  | typeof thanksPayRelayABI;

// this will be changed with env variable
export const THANKS_PAY_MAIN_ADDR = "0xf300e534d71456bc5b27da205d089b7f495b4eea";
export const THANKS_PAY_DATA_ADDR = "0x7f683960a27603dab905b3b8a3225367144366d6";
export const THANKS_PAY_SECURITY_ADDR = "0x112ace3e6c9254d49acce1e7f64ab925eca96af0";
export const THANKS_PAY_RELAY_ADDR = "0x5ee9fabc145284fee78e93cfd449ecdeefebdb95";
export const THANKS_PAY_CHECK_ADDR = "";

export type ThanksPaySecurityType = {
  // not used
} 

type RegisterPartnerType = {
  pId: number,
  latestPay: number
}

type SetPartnerBonusType = {
  pId: number,
  bonus: number
}

type SetPartnerBalanceType = {
  pId: number,
  newBalance: number
}

type RegisterWorkerType = {
  wId: number,
  pId: number,
  wage: number
}

type SetLatestRequestType = {
  wId: number,
  latestRequest: number
}

type SetLatestWagePayType = {
  pId: number,
  timestamp: number
}

type SetWorkerBalanceType = {
  wId: number,
  newBalance: number
}

type GetWorkerType = {
  wId: number
}

type GetWorkerBalanceType = {
  wId: number
}

type GetPartnerThanksPayableBalanceType = {
  partner: number
}

type GetPartnerWithdrawableBalanceType = {
  partner: number
}

type GetPartnerType = {
  pId: number
}


export type ThansPayDataType = {
  registerPartner: RegisterPartnerType,
  setPartnerBonus: SetPartnerBonusType,
  setPartnerBalance: SetPartnerBalanceType,
  registerWorker: RegisterWorkerType,
  setLatestRequest: SetLatestRequestType,
  setWorkerBalance: SetWorkerBalanceType,
  setLatestWagePay: SetLatestWagePayType,
  getWorker: GetWorkerType,
  getWorkerBalance: GetWorkerBalanceType,
  getPartnerThanksPayableBalance: GetPartnerThanksPayableBalanceType,
  getPartnerWithdrawableBalance: GetPartnerWithdrawableBalanceType,
  getPartner: GetPartnerType
}

type SubtractFromPartner = {
    pId: number,
    amount: number
}

type PartnerAddBonus = {
    pId: number,
    amount: number
}

type PartnerAddBalance = {
    pId: number,
    amount: number
}

type PartnerWithdraw = {
    pId: number,
    amount: number
}

type WorkerGetsThanksPay = {
    wId: number,
    pId: number,
    amount: number,
    bankReceipt: string,
    timestamp: number
}

export type ThanksPayMainType = {
    subtractFromPartner: SubtractFromPartner,
    partnerAddBonus: PartnerAddBonus,
    partnerAddBalance: PartnerAddBalance,
    partnerWithdraw: PartnerWithdraw,
    workerGetsThanksPay: WorkerGetsThanksPay
}

type WorkerGetsSalaryEarlyCheck = {
  wId: number,
  amount: number
}

export type ThanksPayCheckType = {
  workerGetSalaryEarlyCheck: WorkerGetsSalaryEarlyCheck
}

export type ThanksPaySuperType = {
  thanksPaySecurity: ThanksPaySecurityType,
  thanksPayData: ThansPayDataType,
  thanksPayCheckType: ThanksPayCheckType,
  thanksPayMainType: ThanksPayMainType,
  thanksPayRelayType: ThanksPayRelayType,
}

const getSchema = (abi: ContractABIType) => {
  // filter abi where "type" is "function"
  const functions = abi.filter((row: any) => row["type"] === "function");

  // make an array where key is functions['name']
  const arrayOfFunctions = functions.map((func: any) => {
    const funcName = func["name"];
    return {
      name: func["name"],
      inputTypes: func["inputs"].map((input: any) => input["type"]),
      inputNames: func["inputs"].map((input: any) => input["name"]),
    };
  });

  return arrayOfFunctions;
};

const getRequiredTypeOrder = (functionName: string, schema: any) => {
  const func = schema.find((row: any) => row.name === functionName);
  if (func) {
    return func.inputTypes;
  }
  return [];
};

export class ThanksPayContracts extends Contract {
  public schema: any;
  public getRequiredOrder = (functionName: string) => {
    const func = this.schema.find((row: any) => row.name === functionName);
    if (func) {
      return func.inputNames;
    }
    return [];
  };
  constructor(
    signerOrProvider: SignerOrProvider,
    contractAddr: string,
    abi: ContractABIType
  ) {
    super(contractAddr, abi, signerOrProvider);
    this.schema = getSchema(abi);
  }
  public sendTx = async (name: string, args: any): Promise<number> => {
    try {
      const order = this.getRequiredOrder(name);
      const orderedArgs = order.map((item: string) => {
        return (args as any)[item];
      });
      if ("payableAmt" in args) {
        orderedArgs.push(args.payableAmt);
      }
      console.log(
        "in contractType.ts sendTx: orderedArg is: ",
        orderedArgs,
        " method: ",
        name
      );
      const tx = await this[name](...orderedArgs);
      const txReceipt = await tx.wait();

      console.log("txReceipt is: ", txReceipt);
      return 0;
    } catch (e: any) {
      console.log("error is: ", e); // change to alert
      if (e.data && e.data.message) {
        alert(e.data.message);
      }
      return -1;
    }
  };
}

export class thanksPayMain extends ThanksPayContracts {
    constructor(signerOrProvider: SignerOrProvider) {
        super(signerOrProvider, THANKS_PAY_MAIN_ADDR, thanksPayMainABI);
    }

    public method = {
        setLatestWagePay: (args: ThanksPayMainType["setLatestWagePay"]) => {
            this.sendTx("setLatestWagePay", args);
        },
        subtractFromPartner: (args: ThanksPayMainType["subtractFromPartner"]) => {
            this.sendTx("subtractFromPartner", args);
        },
        partnerAddBonus: (args: ThanksPayMainType["partnerAddBonus"]) => {
            this.sendTx("partnerAddBonus", args);
        },
        partnerAddBalance: (args: ThanksPayMainType["partnerAddBalance"]) => {
            this.sendTx("partnerAddBalance", args);
        },
        partnerWithdraw: (args: ThanksPayMainType["partnerWithdraw"]) => {
            this.sendTx("partnerWithdraw", args);
        },
        workerGetsThanksPay: (args: ThanksPayMainType["workerGetsThanksPay"]) => {
            this.sendTx("workerGetsThanksPay", args);
        }
    }
}

export class thanksPayRelay extends ThanksPayContracts {
    constructor(signerOrProvider: SignerOrProvider) {
        super(signerOrProvider, THANKS_PAY_RELAY_ADDR, thanksPayRelayABI);
    }

    public method = {
        setProperty: (args: ThanksPayRelayType["setProperty"]) => {
            this.sendTx("setProperty", args);
        },
        addProperty: (args: ThanksPayRelayType["addProperty"]) => {
            this.sendTx("addProperty", args);
        },
        editProperty: (args: ThanksPayRelayType["editProperty"]) => {
            this.sendTx("editProperty", args);
        },
        getPropertyName: (args: ThanksPayRelayType["getPropertyName"]) => {
            this.sendTx("getPropertyName", args);
        }
      }
}


export class thanksPayCheck extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_CHECK_ADDR, thanksPayCheckABI);
  }
}

export class thanksPayData extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_DATA_ADDR, thanksPayDataABI);
  }

  public method = {
    registerPartner: (args: ThansPayDataType["registerPartner"]) => {
      this.sendTx("registerPartner", args);
    },
    registerWorker: (args: ThansPayDataType["registerWorker"]) => {
      this.sendTx("registerWorker", args);
    },
    setPartnerBonus: (args: ThansPayDataType["setPartnerBonus"]) => {
      this.sendTx("setPartnerBonus", args);
    },
  }
}