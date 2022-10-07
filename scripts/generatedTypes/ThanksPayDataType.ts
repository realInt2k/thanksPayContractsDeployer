type AuthorizeType = {
  _authorized: string[],
}
type CheckAuthorizedType = {
  account: string,
}
type GetPartnerType = {
  pId: bigint,
}
type GetPartnerThanksPayableBalanceType = {
  partner: bigint,
}
type GetPartnerWithdrawableBalanceType = {
  partner: bigint,
}
type GetWorkerType = {
  wId: bigint,
}
type GetWorkerBalanceType = {
  wId: bigint,
}
type PartnersType = {
}
type RecallAuthorizationType = {
  _notAuthorized: string[],
}
type RegisterPartnerType = {
  pId: bigint,
  latestPay: bigint,
}
type RegisterWorkerType = {
  wId: bigint,
  pId: bigint,
  wage: bigint,
}
type RevertCheckType = {
  condition: boolean,
  exitCode: bigint,
  reason?: string,
}
type SetLatestRequestType = {
  wId: bigint,
  latestRequest: bigint,
}
type SetLatestWagePayType = {
  pId: bigint,
  timestamp: bigint,
}
type SetPartnerBalanceType = {
  pId: bigint,
  newBalance: bigint,
}
type SetPartnerBonusType = {
  pId: bigint,
  bonus: bigint,
}
type SetWorkerBalanceType = {
  wId: bigint,
  newBalance: bigint,
}
type SetWorkerPartnerType = {
  wId: bigint,
  pId: bigint,
}
type TypesType = {
}
type WorkersType = {
}

export type ThanksPayDataType = {
  authorize: AuthorizeType,
  checkAuthorized: CheckAuthorizedType,
  getPartner: GetPartnerType,
  getPartnerThanksPayableBalance: GetPartnerThanksPayableBalanceType,
  getPartnerWithdrawableBalance: GetPartnerWithdrawableBalanceType,
  getWorker: GetWorkerType,
  getWorkerBalance: GetWorkerBalanceType,
  partners: PartnersType,
  recallAuthorization: RecallAuthorizationType,
  registerPartner: RegisterPartnerType,
  registerWorker: RegisterWorkerType,
  revertCheck: RevertCheckType,
  setLatestRequest: SetLatestRequestType,
  setLatestWagePay: SetLatestWagePayType,
  setPartnerBalance: SetPartnerBalanceType,
  setPartnerBonus: SetPartnerBonusType,
  setWorkerBalance: SetWorkerBalanceType,
  setWorkerPartner: SetWorkerPartnerType,
  types: TypesType,
  workers: WorkersType,
}