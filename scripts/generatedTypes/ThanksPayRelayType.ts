type AllpropertyIDsType = {
}
type AlterEntityNamesType = {
  _entityIDs: number[],
  _entityNames: string[],
}
type AlterPropertyNamesType = {
  entityID: number,
  _propertyIDs: number[],
  _propertyNames: string[],
  propertyTypes: number[],
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
  entityID: number,
}
type PropertyNamesMapType = {
}
type RecallAuthorizationType = {
  _notAuthorized: string[],
}
type RevertCheckType = {
  condition: boolean,
  exitCode: number,
  reason?: string,
}
type SetDynamicPropertiesType = {
  entityID: number,
  blockchainID: number,
  propertyIDs: number[],
  propertyValues: number[],
}
type SetStaticPropertiesType = {
  entityID: number,
  blockchainID: number,
  propertyIDs: number[],
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