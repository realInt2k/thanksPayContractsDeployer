// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./thanksCommons.sol";



contract ThanksPayRelay is thanksCommons{
    
    event propertyAdded(uint256 entityID, uint256 blockchainID, uint256[] propertyID, string[] propertyValue);

    function setProperty (
        uint256 entityID, // 1: "Partner", 2: "Worker", 3: "Pay"
        uint256 blockchainID, // e.g. "1": worker with ID number 1
        uint256[] memory propertyIDs,  // e.g. "1" (register it first with registerProperty)
        string[] memory  propertyValues // e.g. "10001-99-1009"
    ) external {
        emit propertyAdded(entityID, blockchainID, propertyIDs, propertyValues); 
    }

    // first pass entity ("Partner"), then propertyID ("1"), and it will give you the name ("email")
    mapping(uint256 => mapping (uint256 => string)) propertyNames;
    

    function addProperty(uint256 entityID, uint256[] memory propertyIDs, string[] memory _propertyNames) external {
        for (uint i=0; i<_propertyNames.length; i++){
            uint256 propertyID = propertyIDs[i];
            string memory propertyName = _propertyNames[i];
            propertyNames[entityID][propertyID] = propertyName;
        }
    }

    function getPropertyName(uint256 entityID, uint256 propertyID) external view returns (string memory) {
        return propertyNames[entityID][propertyID];
    }
}