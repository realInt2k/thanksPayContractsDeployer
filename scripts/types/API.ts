function (saveToDB: function, parameters: any, functionName: any) => {
    const ganacheContract = contractType(networkName = "ganache");
    const polygonContract = contractType(networkName = "polygon");

    const receipt = await ganacheContract[functionName];
    // listen to events here
    const events = await receipts.events();
    saveToDB(events);
}