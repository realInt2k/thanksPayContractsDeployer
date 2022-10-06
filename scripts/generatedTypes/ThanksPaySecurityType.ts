type DEFAULT_ADMIN_ROLEType = {
}
type AuthorizeContractsType = {
  _newlyAuthorized: string[],
}
type AuthorizePeopleType = {
  _newlyAuthorized: string[],
}
type CancelAuthorizationType = {
  _notAuthorized: string[],
}
type GetAuthorizedContractsType = {
}
type GetAuthorizedHumanType = {
}
type GetRoleAdminType = {
  role: string,
}
type GrantRoleType = {
  role: string,
  account: string,
}
type HasRoleType = {
  role: string,
  account: string,
}
type IsPersonOrContractType = {
  addr: string,
}
type RenounceRoleType = {
  role: string,
  account: string,
}
type RevertCheckType = {
  condition: boolean,
  exitCode: number,
  reason?: string,
}
type RevokeRoleType = {
  role: string,
  account: string,
}
type SupportsInterfaceType = {
  interfaceId: string,
}

export type ThanksPaySecurityType = {
  DEFAULT_ADMIN_ROLE: DEFAULT_ADMIN_ROLEType,
  authorizeContracts: AuthorizeContractsType,
  authorizePeople: AuthorizePeopleType,
  cancelAuthorization: CancelAuthorizationType,
  getAuthorizedContracts: GetAuthorizedContractsType,
  getAuthorizedHuman: GetAuthorizedHumanType,
  getRoleAdmin: GetRoleAdminType,
  grantRole: GrantRoleType,
  hasRole: HasRoleType,
  isPersonOrContract: IsPersonOrContractType,
  renounceRole: RenounceRoleType,
  revertCheck: RevertCheckType,
  revokeRole: RevokeRoleType,
  supportsInterface: SupportsInterfaceType,
}