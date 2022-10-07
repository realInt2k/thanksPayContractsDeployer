type AuthorizeType = {
  _authorized: string[],
}
type CheckAuthorizedType = {
  account: string,
}
type PartnerAddBalanceCheckType = {
  pId: bigint,
  amount: bigint,
  timestamp: bigint,
}
type PartnerAddBonusCheckType = {
  pId: bigint,
  amount: bigint,
  timestamp: bigint,
}
type PartnerWithdrawCheckType = {
  pId: bigint,
  amount: bigint,
}
type RecallAuthorizationType = {
  _notAuthorized: string[],
}
type RegisterPartnerCheckType = {
  pId: bigint,
  latestPay: bigint,
}
type RegisterWorkerCheckType = {
  wId: bigint,
  pId: bigint,
  wage: bigint,
}
type RevertCheckType = {
  condition: boolean,
  exitCode: bigint,
  reason?: string,
}
type SetLatestRequestCheckType = {
  wId: bigint,
  latestRequest: bigint,
}
type SetLatestWagePayCheckType = {
  pId: bigint,
  timestamp: bigint,
}
type SetPartnerBalanceCheckType = {
  pId: bigint,
  newBalance: bigint,
}
type SetPartnerBonusCheckType = {
  pId: bigint,
  bonus: bigint,
}
type SetWorkerBalanceCheckType = {
  wId: bigint,
  newBalance: bigint,
}
type SetWorkerPartnerCheckType = {
  wId: bigint,
  pId: bigint,
}
type SubtractFromPartnerCheckType = {
  pId: bigint,
  amount: bigint,
}
type WorkerGetsThanksPayCheckType = {
  wId: bigint,
  amount: bigint,
}

export type ThanksPayCheckType = {
  authorize: AuthorizeType,
  checkAuthorized: CheckAuthorizedType,
  partnerAddBalanceCheck: PartnerAddBalanceCheckType,
  partnerAddBonusCheck: PartnerAddBonusCheckType,
  partnerWithdrawCheck: PartnerWithdrawCheckType,
  recallAuthorization: RecallAuthorizationType,
  registerPartnerCheck: RegisterPartnerCheckType,
  registerWorkerCheck: RegisterWorkerCheckType,
  revertCheck: RevertCheckType,
  setLatestRequestCheck: SetLatestRequestCheckType,
  setLatestWagePayCheck: SetLatestWagePayCheckType,
  setPartnerBalanceCheck: SetPartnerBalanceCheckType,
  setPartnerBonusCheck: SetPartnerBonusCheckType,
  setWorkerBalanceCheck: SetWorkerBalanceCheckType,
  setWorkerPartnerCheck: SetWorkerPartnerCheckType,
  subtractFromPartnerCheck: SubtractFromPartnerCheckType,
  workerGetsThanksPayCheck: WorkerGetsThanksPayCheckType,
}