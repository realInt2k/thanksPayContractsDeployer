// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract ThanksDataStatic {
    constructor() {

    }

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
}