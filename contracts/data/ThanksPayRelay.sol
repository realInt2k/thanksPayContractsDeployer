// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract ThanksPayRelay{
    
    event dynamicPropertySet(uint256 entityID, uint256 blockchainID, uint256[] propertyID, uint256[] propertyValue);
    event staticPropertySet(uint256 entityID, uint256 blockchainID, uint256[] propertyID, string[] propertyValue);
    event propertyNamesAltered(uint256 entityID, uint256[] propertyIDs, string[] propertyNames, uint256[] propertyTypes);
    event entityNamesAltered(uint256[] _entityIDs, string[] _entityNames);


    uint256[] public entityIDs; // the list of entities, i.e. 1, 2, 3, 4, 5
    mapping(uint256 => string) public entityNamesMap; // the names of entities, i.e. 1=> Partner, 2=> Worker, 3=> Pay
    // first pass entity ("Partner"), then propertyID ("1"), and it will give you the name ("email")
    mapping(uint256 => uint256[]) public AllpropertyIDs; // which properties a given entity has
    mapping(uint256 => mapping (uint256 => string)) public propertyNamesMap; // 1 => 1 => "email" (Partner email)
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) public dynamicPropertiesMap; // 1 => (1 => [1, 2, 3, 4, 5]) (Partner number 1 has 5 dynamic properties)

    function setDynamicProperties(
        uint256 entityID,
        uint256 blockchainID,
        uint256[] memory propertyIDs,
        uint256[] memory propertyValues
    ) external {
        for (uint256 i = 0; i < propertyIDs.length; i++) {
            dynamicPropertiesMap[entityID][blockchainID][propertyIDs[i]] = propertyValues[i];
        }
        emit dynamicPropertySet(entityID, blockchainID, propertyIDs, propertyValues);
    }
    
    function setStaticProperties (
            // properties not needed for business logic, like name, address, etc
        uint256 entityID, // 1: "Partner", 2: "Worker", 3: "Pay"
        uint256 blockchainID, // e.g. "1": worker with ID number 1
        uint256[] memory propertyIDs,  // e.g. "1" (register it first with registerProperty)
        string[] memory  propertyValues // e.g. "10001-99-1009"
    ) external {
        emit staticPropertySet(entityID, blockchainID, propertyIDs, propertyValues); 
    }

    function alterEntityNames(uint256[] memory _entityIDs, string[] memory _entityNames) external {
        // register a new entity, i.e. [1, 2], ["Parter", "Worker"]
        for (uint i=0; i<_entityIDs.length; i++) {
            entityIDs.push(_entityIDs[i]);
            entityNamesMap[_entityIDs[i]] = _entityNames[i];
        }
        emit entityNamesAltered(_entityIDs, _entityNames);
    }

    function alterPropertyNames(uint256 entityID, uint256[] memory _propertyIDs, string[] memory _propertyNames, uint256[] memory propertyTypes) external {
        // register a property name, i.e. 1, [1, 2], ["Partner email", "Partner this"], 1=dynamic, 0 = static
        for (uint i=0; i<_propertyNames.length; i++){
            AllpropertyIDs[entityID].push(_propertyIDs[i]);

            uint256 propertyID = _propertyIDs[i];
            string memory propertyName = _propertyNames[i];
            propertyNamesMap[entityID][propertyID] = propertyName;
        }
        emit propertyNamesAltered(entityID, _propertyIDs, _propertyNames, propertyTypes);
    }


    function getAllEntities() external view returns (uint256[] memory ids, string[] memory names) {
        uint mlength = entityIDs.length;
        string[] memory _entityNames = new string[](mlength);
        uint256[] memory _entityIDs = new uint256[](mlength);
        for (uint i = 0; i<entityIDs.length; i++){
            _entityNames[i] = entityNamesMap[entityIDs[i]];
            _entityIDs[i] = entityIDs[i];
        }
        return (_entityIDs, _entityNames);
    }

    function getAllProperties(uint256 entityID) external view returns(uint256[] memory ids, string[] memory names){
        uint256 mlength = AllpropertyIDs[entityID].length;
        uint256[] memory _propertyIDs = new uint256[](mlength);
        string[] memory _propertyNames = new string[](mlength);

        for (uint i = 0; i < mlength; i++){
            _propertyIDs[i] = AllpropertyIDs[entityID][i];
            _propertyNames[i] = propertyNamesMap[entityID][_propertyIDs[i]];
        }
        return (_propertyIDs, _propertyNames);        
    }
}
