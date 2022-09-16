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

export type ThanksPayRelayTypes = {
  allpropertyIDs: AllpropertyIDsType,
  alterEntityNames: AlterEntityNamesType,
  alterPropertyNames: AlterPropertyNamesType,
  dynamicPropertiesMap: DynamicPropertiesMapType,
  entityIDs: EntityIDsType,
  entityNamesMap: EntityNamesMapType,
  getAllEntities: GetAllEntitiesType,
  getAllProperties: GetAllPropertiesType,
  propertyNamesMap: PropertyNamesMapType,
  setDynamicProperties: SetDynamicPropertiesType,
  setStaticProperties: SetStaticPropertiesType,
}