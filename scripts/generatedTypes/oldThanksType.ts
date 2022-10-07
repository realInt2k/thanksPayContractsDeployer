type CancelPayType = {
  workerEmail: string,
  payReqDate: bigint,
}
type EditPartnerType = {
  partnerLicenseId: string,
  klaytnAcc: string,
  initialDeposit: bigint,
  depositType: bigint,
  salaryDay: bigint,
  partnerState: bigint,
  partnerHashData: string,
}
type EditWorkerType = {
  worker: string,
}
type GetAllPartnerType = {
}
type GetAllWorkerType = {
}
type GetPartnerType = {
  partnerLicenseId: string,
}
type GetPayByPartnerAndDateType = {
  partnerLicenseId: string,
  fromDate: bigint,
  toDate: bigint,
}
type GetPayByWorkerType = {
  workerEmail: string,
}
type GetPayByWorkerAndDateType = {
  workerEmail: string,
  fromDate: bigint,
  toDate: bigint,
}
type NewPartnerType = {
  partnerLicenseId: string,
  klaytnAcc: string,
  initialDeposit: bigint,
  depositType: bigint,
  salaryDay: bigint,
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
  addDeposit: bigint,
  addDepositDate: bigint,
}
type PartnerMapType = {
}
type PartnersType = {
}
type PayType = {
  workerEmail: string,
  payReqDate: bigint,
  payAmount: bigint,
  payDate: bigint,
}
type PayRequestType = {
  workerEmail: string,
  payReqAmount: bigint,
  payReqDate: bigint,
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
  editWorker: EditWorkerType,
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