
type SetLatestWagePayType = {
    pId: number,
    timestamp: number
}

type SubtractFromPartnerType = {
    pId: number,
    amount: number
}

type PartnerAddBonusType = {
    pId: number,
    amount: number,
    timestamp: number
}

type PartnerAddBalanceType = {
    pId: number,
    amount: number,
    timestamp: number
}

type PartnerWithdrawType = {
    pId: number,
    amount: number
}

type WorkerGetsThanksPayType = {
    wId: number,
    pId: number,
    amount: number,
    bankReceipt: string,
    timestamp: number
}

export type ThanksPayMainType = {
    setLatestWagePay: SetLatestWagePayType,
    subtractFromPartner: SubtractFromPartnerType,
    partnerAddBonus: PartnerAddBonusType,
    partnerAddBalance: PartnerAddBalanceType,
    partnerWithdraw: PartnerWithdrawType,
    workerGetsThanksPay: WorkerGetsThanksPayType
}