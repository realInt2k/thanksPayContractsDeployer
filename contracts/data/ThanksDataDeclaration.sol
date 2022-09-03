// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract ThanksDataDeclaration {
    constructor() {}
    event partnerRegistered(address pId, uint256 latestPay);
    event companyRegistered(address pId, uint256 latestPay);
    event partnerBalanceChanged(address pId, uint256 newBalance);
    event workerRegistered(address wId, address pId, uint256 wage);
    event workerBalanceChanged(uint256 kind, address wId, uint256 newBalance);

    struct Partner {
        uint256 balance;
        uint256 latestPay;
    }

    struct Company {
        uint256 balance;
    }

    address[] partnerPool;    
    address[] workersPool;
    
    struct Worker {
        uint256 balance;
            // current balance. Is updated every month.
        uint256 saving;
            // saving money that user saves to their account
        uint256 borrow;
            // borrowed money
        uint256 wage;
            // monthly wage for a given worker
        address pId;
            // partnerId.
        uint256 latestRequest;
    }

    mapping(address => Partner) public partners;
    mapping(address => Company) public companies;
    mapping(address => Worker) public workers;
    mapping(address => uint256) public types;
        // 1: "Partner", 2: "Worker", 3: "Company"
}