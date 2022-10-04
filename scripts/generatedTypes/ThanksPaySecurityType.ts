type DEFAULT_ADMIN_ROLEType = {
}
type GetAuthorizedAddressesType = {
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
type TransferMastershipType = {
  newMaster: string,
}

export type ThanksPaySecurityType = {
  DEFAULT_ADMIN_ROLE: DEFAULT_ADMIN_ROLEType,
  getAuthorizedAddresses: GetAuthorizedAddressesType,
  getRoleAdmin: GetRoleAdminType,
  grantRole: GrantRoleType,
  hasRole: HasRoleType,
  renounceRole: RenounceRoleType,
  revertCheck: RevertCheckType,
  revokeRole: RevokeRoleType,
  supportsInterface: SupportsInterfaceType,
  transferMastership: TransferMastershipType,
}