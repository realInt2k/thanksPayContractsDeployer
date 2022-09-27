type GetPartnerType = {
  pId: number,
}
type GetPartnerThanksPayableBalanceType = {
  partner: number,
}
type GetPartnerWithdrawableBalanceType = {
  partner: number,
}
type GetWorkerType = {
  wId: number,
}
type GetWorkerBalanceType = {
  wId: number,
}
type PartnersType = {
}
type RegisterPartnerType = {
  pId: number,
  latestPay: number,
}
type RegisterWorkerType = {
  wId: number,
  pId: number,
  wage: number,
}
type SetLatestRequestType = {
  wId: number,
  latestRequest: number,
}
type SetLatestWagePayType = {
  pId: number,
  timestamp: number,
}
type SetPartnerBalanceType = {
  pId: number,
  newBalance: number,
}
type SetPartnerBonusType = {
  pId: number,
  bonus: number,
}
type SetWorkerBalanceType = {
  wId: number,
  newBalance: number,
}
type SetWorkerPartnerType = {
  wId: number,
  pId: number,
}
type TypesType = {
}
type WorkersType = {
}

export type ThanksPayDataType = {
  getPartner: GetPartnerType,
  getPartnerThanksPayableBalance: GetPartnerThanksPayableBalanceType,
  getPartnerWithdrawableBalance: GetPartnerWithdrawableBalanceType,
  getWorker: GetWorkerType,
  getWorkerBalance: GetWorkerBalanceType,
  partners: PartnersType,
  registerPartner: RegisterPartnerType,
  registerWorker: RegisterWorkerType,
  setLatestRequest: SetLatestRequestType,
  setLatestWagePay: SetLatestWagePayType,
  setPartnerBalance: SetPartnerBalanceType,
  setPartnerBonus: SetPartnerBonusType,
  setWorkerBalance: SetWorkerBalanceType,
  setWorkerPartner: SetWorkerPartnerType,
  types: TypesType,
  workers: WorkersType,
}