type AUTHORIZEDType = {
}
type DEFAULT_ADMIN_ROLEType = {
}
type AuthorizeType = {
  authorized: string[],
}
type GetRoleAdminType = {
  role: string,
}
type GetShitType = {
}
type GrantRoleType = {
  role: string,
  account: string,
}
type HasRoleType = {
  role: string,
  account: string,
}
type IsAuthorizedType = {
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
type ShitType = {
}
type SupportsInterfaceType = {
  interfaceId: string,
}

export type ThanksPaySecurityType = {
  aUTHORIZED: AUTHORIZEDType,
  dEFAULT_ADMIN_ROLE: DEFAULT_ADMIN_ROLEType,
  authorize: AuthorizeType,
  getRoleAdmin: GetRoleAdminType,
  getShit: GetShitType,
  grantRole: GrantRoleType,
  hasRole: HasRoleType,
  isAuthorized: IsAuthorizedType,
  renounceRole: RenounceRoleType,
  revertCheck: RevertCheckType,
  revokeRole: RevokeRoleType,
  shit: ShitType,
  supportsInterface: SupportsInterfaceType,
}