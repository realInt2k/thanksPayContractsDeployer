// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract ThanksDataStatic {
    constructor() {

    }

    event partnerRegistered(uint256 pId, uint256 latestPay);
    //event companyRegistered(uint256 pId, uint256 latestPay);
    event partnerBalanceChanged(uint256 pId, uint256 newBalance);
    event workerRegistered(uint256 wId, uint256 pId, uint256 wage);
    event workerBalanceChanged(uint256 wId, uint256 newBalance);

    struct Partner {
        uint256 balance; // withdrawable balance
        uint256 bonus; // bonus provided by GivingDays
        uint256 latestPay;
        bool exist;
    }

    uint256[] partnerPool;
    
    struct Worker {
        uint256 balance;
            // balance for a given worker
        uint256 wage;
            // monthly wage for a given worker
        uint256 pId;
            // partnerId.
        uint256 latestRequest;

        bool exist;
    }

    mapping(uint256 => Partner) public partners;
    mapping(uint256 => Worker) public workers;
    mapping(uint256 => uint256) public types;
        // 1: "Partner", 2: "Worker", 3: "Pay"
}