type PartnerAddBalanceType = {
  pId: number,
  amount: number,
  timestamp: number,
}
type PartnerAddBonusType = {
  pId: number,
  amount: number,
  timestamp: number,
}
type PartnerWithdrawType = {
  pId: number,
  amount: number,
  timestamp: number,
}
type RevertCheckType = {
  condition: boolean,
  exitCode: number,
  reason?: string,
}
type SetLatestWagePayType = {
  pId: number,
  timestamp: number,
}
type SubtractFromPartnerType = {
  pId: number,
  amount: number,
}
type WorkerGetsThanksPayType = {
  wId: number,
  pId: number,
  amount: number,
  bankReceipt: string,
  timestamp: number,
}

export type ThanksPayMainType = {
  partnerAddBalance: PartnerAddBalanceType,
  partnerAddBonus: PartnerAddBonusType,
  partnerWithdraw: PartnerWithdrawType,
  revertCheck: RevertCheckType,
  setLatestWagePay: SetLatestWagePayType,
  subtractFromPartner: SubtractFromPartnerType,
  workerGetsThanksPay: WorkerGetsThanksPayType,
}