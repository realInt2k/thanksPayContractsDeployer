type AuthorizeType = {
  _authorized: string[],
}
type CheckAuthorizedType = {
  account: string,
}
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
type RecallAuthorizationType = {
  _notAuthorized: string[],
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
type WorkerGetsThanksPayType = {
  wId: number,
  pId: number,
  amount: number,
  bankReceipt: string,
  timestamp: number,
}

export type ThanksPayMainType = {
  authorize: AuthorizeType,
  checkAuthorized: CheckAuthorizedType,
  partnerAddBalance: PartnerAddBalanceType,
  partnerAddBonus: PartnerAddBonusType,
  partnerWithdraw: PartnerWithdrawType,
  recallAuthorization: RecallAuthorizationType,
  revertCheck: RevertCheckType,
  setLatestWagePay: SetLatestWagePayType,
  workerGetsThanksPay: WorkerGetsThanksPayType,
}