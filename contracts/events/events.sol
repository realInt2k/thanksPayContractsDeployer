contract Events {
    event dynamicPropertySet(uint256 entityID, uint256 blockchainID, uint256[] propertyID, uint256[] propertyValue);
    event staticPropertySet(uint256 entityID, uint256 blockchainID, uint256[] propertyID, string[] propertyValue);
    event propertyNamesAltered(uint256 entityID, uint256[] propertyIDs, string[] propertyNames, uint256[] propertyTypes);
    event entityNamesAltered(uint256[] _entityIDs, string[] _entityNames);

    event partnerRegistered(uint256 pId, uint256 latestPay);
    //event companyRegistered(uint256 pId, uint256 latestPay);
    event partnerBalanceChanged(uint256 pId, uint256 newBalance);
    event workerRegistered(uint256 wId, uint256 pId, uint256 wage);
    event workerBalanceChanged(uint256 wId, uint256 newBalance);
}