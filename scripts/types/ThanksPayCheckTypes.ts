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
  
export type ThanksPayCheckType = {
    workerGetSalaryEarlyCheck: WorkerGetsSalaryEarlyCheckType
    subtractFromPartnerCheck: SubtractFromPartnerCheckType,
    partnerWithdrawCheck: PartnerWithdrawCheckType,
    workerGetsThanksPayCheck: WorkerGetsThanksPayCheckType
}