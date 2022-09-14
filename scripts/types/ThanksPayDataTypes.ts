
type RegisterPartnerType = {
    pId: number,
    latestPay: number
  }
  
  type SetPartnerBonusType = {
    pId: number,
    bonus: number
  }
  
  type SetPartnerBalanceType = {
    pId: number,
    newBalance: number
  }
  
  type RegisterWorkerType = {
    wId: number,
    pId: number,
    wage: number
  }
  
  type SetLatestRequestType = {
    wId: number,
    latestRequest: number
  }
  
  type SetLatestWagePayType = {
    pId: number,
    timestamp: number
  }
  
  type SetWorkerBalanceType = {
    wId: number,
    newBalance: number
  }
  
  type GetWorkerType = {
    wId: number
  }
  
  type GetWorkerBalanceType = {
    wId: number
  }
  
  type GetPartnerThanksPayableBalanceType = {
    partner: number
  }
  
  type GetPartnerWithdrawableBalanceType = {
    partner: number
  }
  
  type GetPartnerType = {
    pId: number
  }
  
  
  export type ThanksPayDataType = {
    registerPartner: RegisterPartnerType,
    setPartnerBonus: SetPartnerBonusType,
    setPartnerBalance: SetPartnerBalanceType,
    registerWorker: RegisterWorkerType,
    setLatestRequest: SetLatestRequestType,
    setWorkerBalance: SetWorkerBalanceType,
    setLatestWagePay: SetLatestWagePayType,
    getWorker: GetWorkerType,
    getWorkerBalance: GetWorkerBalanceType,
    getPartnerThanksPayableBalance: GetPartnerThanksPayableBalanceType,
    getPartnerWithdrawableBalance: GetPartnerWithdrawableBalanceType,
    getPartner: GetPartnerType
  }
