type CancelPayType = {
  workerEmail: string,
  payReqDate: number,
}
type EditPartnerType = {
  partnerLicenseId: string,
  klaytnAcc: string,
  initialDeposit: number,
  depositType: number,
  salaryDay: number,
  partnerState: number,
  partnerHashData: string,
}
// type EditWorkerType = {
//   worker: tuple,
// }
type GetAllPartnerType = {
}
type GetAllWorkerType = {
}
type GetPartnerType = {
  partnerLicenseId: string,
}
type GetPayByPartnerAndDateType = {
  partnerLicenseId: string,
  fromDate: number,
  toDate: number,
}
type GetPayByWorkerType = {
  workerEmail: string,
}
type GetPayByWorkerAndDateType = {
  workerEmail: string,
  fromDate: number,
  toDate: number,
}
type NewPartnerType = {
  partnerLicenseId: string,
  klaytnAcc: string,
  initialDeposit: number,
  depositType: number,
  salaryDay: number,
  partnerHashData: string,
}
type NewWorkerType = {
  workerEmail: string,
  partnerLicenseId: string,
  klaytnAcc: string,
  workerHashData: string,
}
type PartnerAddDepositType = {
  partnerLicenseId: string,
  addDeposit: number,
  addDepositDate: number,
}
type PartnerMapType = {
}
type PartnersType = {
}
type PayType = {
  workerEmail: string,
  payReqDate: number,
  payAmount: number,
  payDate: number,
}
type PayRequestType = {
  workerEmail: string,
  payReqAmount: number,
  payReqDate: number,
}
type ThanksAdminType = {
}
type WorkerMapType = {
}
type WorkersType = {
}

export type oldThanksType = {
  cancelPay: CancelPayType,
  editPartner: EditPartnerType,
  //editWorker: EditWorkerType,
  getAllPartner: GetAllPartnerType,
  getAllWorker: GetAllWorkerType,
  getPartner: GetPartnerType,
  getPayByPartnerAndDate: GetPayByPartnerAndDateType,
  getPayByWorker: GetPayByWorkerType,
  getPayByWorkerAndDate: GetPayByWorkerAndDateType,
  newPartner: NewPartnerType,
  newWorker: NewWorkerType,
  partnerAddDeposit: PartnerAddDepositType,
  partnerMap: PartnerMapType,
  partners: PartnersType,
  pay: PayType,
  payRequest: PayRequestType,
  thanksAdmin: ThanksAdminType,
  workerMap: WorkerMapType,
  workers: WorkersType,
}