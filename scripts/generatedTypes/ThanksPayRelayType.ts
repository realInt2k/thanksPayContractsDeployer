type AllpropertyIDsType = {
}
type AlterEntityNamesType = {
  _entityIDs: bigint[],
  _entityNames: string[],
}
type AlterPropertyNamesType = {
  entityID: bigint,
  _propertyIDs: bigint[],
  _propertyNames: string[],
  propertyTypes: bigint[],
}
type AuthorizeType = {
  _authorized: string[],
}
type CheckAuthorizedType = {
  account: string,
}
type DynamicPropertiesMapType = {
}
type EntityIDsType = {
}
type EntityNamesMapType = {
}
type GetAllEntitiesType = {
}
type GetAllPropertiesType = {
  entityID: bigint,
}
type PropertyNamesMapType = {
}
type RecallAuthorizationType = {
  _notAuthorized: string[],
}
type RevertCheckType = {
  condition: boolean,
  exitCode: bigint,
  reason?: string,
}
type SetDynamicPropertiesType = {
  entityID: bigint,
  blockchainID: bigint,
  propertyIDs: bigint[],
  propertyValues: bigint[],
}
type SetStaticPropertiesType = {
  entityID: bigint,
  blockchainID: bigint,
  propertyIDs: bigint[],
  propertyValues: string[],
}

export type ThanksPayRelayType = {
  AllpropertyIDs: AllpropertyIDsType,
  alterEntityNames: AlterEntityNamesType,
  alterPropertyNames: AlterPropertyNamesType,
  authorize: AuthorizeType,
  checkAuthorized: CheckAuthorizedType,
  dynamicPropertiesMap: DynamicPropertiesMapType,
  entityIDs: EntityIDsType,
  entityNamesMap: EntityNamesMapType,
  getAllEntities: GetAllEntitiesType,
  getAllProperties: GetAllPropertiesType,
  propertyNamesMap: PropertyNamesMapType,
  recallAuthorization: RecallAuthorizationType,
  revertCheck: RevertCheckType,
  setDynamicProperties: SetDynamicPropertiesType,
  setStaticProperties: SetStaticPropertiesType,
}