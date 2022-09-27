type PartnerAddBalanceCheckType = {
  pId: number,
  amount: number,
  timestamp: number,
}
type PartnerAddBonusCheckType = {
  pId: number,
  amount: number,
  timestamp: number,
}
type PartnerWithdrawCheckType = {
  pId: number,
  amount: number,
}
type RegisterPartnerCheckType = {
  pId: number,
  latestPay: number,
}
type RegisterWorkerCheckType = {
  wId: number,
  pId: number,
  wage: number,
}
type SetLatestRequestCheckType = {
  wId: number,
  latestRequest: number,
}
type SetLatestWagePayCheckType = {
  pId: number,
  timestamp: number,
}
type SetPartnerBalanceCheckType = {
  pId: number,
  newBalance: number,
}
type SetPartnerBonusCheckType = {
  pId: number,
  bonus: number,
}
type SetWorkerBalanceCheckType = {
  wId: number,
  newBalance: number,
}
type SetWorkerPartnerCheckType = {
  wId: number,
  pId: number,
}
type SubtractFromPartnerCheckType = {
  pId: number,
  amount: number,
}
type WorkerGetsThanksPayCheckType = {
  wId: number,
  amount: number,
}

export type ThanksPayCheckType = {
  partnerAddBalanceCheck: PartnerAddBalanceCheckType,
  partnerAddBonusCheck: PartnerAddBonusCheckType,
  partnerWithdrawCheck: PartnerWithdrawCheckType,
  registerPartnerCheck: RegisterPartnerCheckType,
  registerWorkerCheck: RegisterWorkerCheckType,
  setLatestRequestCheck: SetLatestRequestCheckType,
  setLatestWagePayCheck: SetLatestWagePayCheckType,
  setPartnerBalanceCheck: SetPartnerBalanceCheckType,
  setPartnerBonusCheck: SetPartnerBonusCheckType,
  setWorkerBalanceCheck: SetWorkerBalanceCheckType,
  setWorkerPartnerCheck: SetWorkerPartnerCheckType,
  subtractFromPartnerCheck: SubtractFromPartnerCheckType,
  workerGetsThanksPayCheck: WorkerGetsThanksPayCheckType,
}