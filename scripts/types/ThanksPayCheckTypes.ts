type WorkerGetsSalaryEarlyCheckType = {
    wId: number,
    amount: number
}

type SubtractFromPartnerCheckType = {
    pId: number,
    amount: number
}

type PartnerWithdrawCheckType = {
    pId: number,
    amount: number
}

type WorkerGetsThanksPayCheckType = {
    wId: number,
    pId: number,
}

type RegisterWorkerCheckType = {
    wId: number,
    pId: number,
    wage: number
}

type SetWorkerPartnerCheckType = {
    wId: number,
    pId: number,
}

type RegisterPartnerCheckType = {
    pId: number,
    latestPay: number,
}

type SetLatestWagePayCheckType = {
    pId: number,
    timestamp: number,
}

type SetLatestRequestCheckType = {
    wId: number,
    latestRequest: number
}

type SetWorkerBalanceCheckType = {
    wId: number,
    newBalance: number
}

type SetPartnerBalanceCheckType = {
    pId: number,
    newBalance: number
}
  
export type ThanksPayCheckType = {
    workerGetSalaryEarlyCheck: WorkerGetsSalaryEarlyCheckType
    subtractFromPartnerCheck: SubtractFromPartnerCheckType,
    partnerWithdrawCheck: PartnerWithdrawCheckType,
    workerGetsThanksPayCheck: WorkerGetsThanksPayCheckType,
    registerWorkerCheck: RegisterWorkerCheckType,
    setWorkerPartnerCheck: SetWorkerPartnerCheckType,
    registerPartnerCheck: RegisterPartnerCheckType,
    setLatestWagePayCheck: SetLatestWagePayCheckType,
    setLatestRequestCheck: SetLatestRequestCheckType,
    setWorkerBalanceCheck: SetWorkerBalanceCheckType,
    setPartnerBalanceCheck: SetPartnerBalanceCheckType
}