type AuthorizeType = {
  _authorized: string[],
}
type CheckAuthorizedType = {
  account: string,
}
type PartnerAddBalanceType = {
  pId: bigint,
  amount: bigint,
  timestamp: bigint,
}
type PartnerAddBonusType = {
  pId: bigint,
  amount: bigint,
  timestamp: bigint,
}
type PartnerWithdrawType = {
  pId: bigint,
  amount: bigint,
  timestamp: bigint,
}
type RecallAuthorizationType = {
  _notAuthorized: string[],
}
type RevertCheckType = {
  condition: boolean,
  exitCode: bigint,
  reason?: string,
}
type SetLatestWagePayType = {
  pId: bigint,
  timestamp: bigint,
}
type WorkerGetsThanksPayType = {
  wId: bigint,
  pId: bigint,
  amount: bigint,
  bankReceipt: string,
  timestamp: bigint,
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