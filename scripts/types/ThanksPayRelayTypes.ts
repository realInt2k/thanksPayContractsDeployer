type SetPropertyType = {
    entityID: number,
    blockchainID: number,
    propertyIDs: number[],
    propertyValues: string[]
  }
  
  type AddPropertyType = {
    entityID: number,
    propertyIDs: number[],
    propertyNames: string[]
  }
  
  type EditPropertyType = {
    entityID: number,
    propertyIDs: number[],
    propertyNames: string[]
  }
  
  type GetPropertyNameType = {
    entityID: number,
    propertyID: number
  }

  type setDynamicPropertiesType = {
    entityID: number,
    blockchainID: number,
    propertyIDs: number[],
    propertyValues: number[]
  }

  type setStaticPropertiesType = {
    entityID: number,
    blockchainID: number,
    propertyIDs: number[],
    propertyValues: string[]
  }

  type alterEntityNamesType = {
    entityIds: number[],
    entityNames: string[]
  }

  type alterPropertyNamesType = {
    entityID: number,
    propertyIDs: number[],
    propertyNames: string[],
    propertyTypes: number[]
  }
  
  type getAllEntitiesType = {
    ids: number[]
    names: string[]
  }

  type getAllPropertiesType = {
    entityID: number
  }
  
  export type ThanksPayRelayType = { 
    setDynamicProperties: setDynamicPropertiesType,
    setStaticProperties: setStaticPropertiesType,
    alterEntityNames: alterEntityNamesType,
    alterPropertyNames: alterPropertyNamesType,
    getAllEntities: getAllEntitiesType,
    getAllProperties: getAllPropertiesType,
    setProperty: SetPropertyType,
    addProperty: AddPropertyType,
    editProperty: EditPropertyType,
    getPropertyName: GetPropertyNameType,
  }