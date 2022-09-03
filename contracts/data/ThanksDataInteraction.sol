// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ThanksDataDeclaration.sol";

/*
    This has pure set and get, no logics
 */

contract ThanksDataInteraction is ThanksDataDeclaration {
    
    function registerPartner(address pId, uint256 latestPay) public {
        partners[pId] = Partner(0, latestPay);
        companies[pId] = Company(0);
        types[pId] = 1;
        emit partnerRegistered(pId, latestPay);
    }

    function registerWorker(address wId, address pId, uint256 wage) public {
        workers[wId] = Worker(0, 0, 0,wage, pId, 0);
        types[wId] = 2;
        emit workerRegistered(wId, pId, wage);
    }

    function setLatestRequest(address wId, uint256 latestRequest) public {
        workers[wId].latestRequest = latestRequest;
    }
    
    function setWorkerBalance(uint256 kind, address wId, uint256 newBalance) public {
        if(kind == 1) {
            workers[wId].balance = newBalance;
        } else if (kind == 2) {
            workers[wId].saving = newBalance;
        }
        emit workerBalanceChanged(kind, wId, newBalance);
    }

    function setLatestWagePay(address pId, uint256 timestamp) public {
        partners[pId].latestPay = timestamp;
    }

    function setCompanyBalance(address pId, uint256 newBalance) public {
        companies[pId].balance = newBalance;
    }

    function setPartnerBalance(address pId, uint256 newBalance) public {
        partners[pId].balance = newBalance;
        emit partnerBalanceChanged(pId, newBalance);
    }

    // ------------------------------------------------------------------

    function getWorker(address wId) view public returns (uint256 balance, uint256 saving, uint256 borrow, uint256 wage, address pId, uint256 latestRequest) {
        Worker memory worker = workers[wId];
        return (worker.balance, 
                worker.saving,
                worker.borrow,
                worker.wage,
                worker.pId,
                worker.latestRequest
                );
    }

    function getWorkerBalance(uint256 kind, address account) public view returns (uint256) {
        Worker memory worker = workers[account];
        if(kind == 1) {
            Partner memory partner = partners[worker.pId];
            if (worker.latestRequest <= partner.latestPay) {
                return worker.wage;
            } else {
                return worker.balance;
            }
        } else if(kind == 2) {
            return worker.saving;
        } else if(kind == 3) {
            return worker.borrow;
        }
    }

    function getCompanyBalance(address company) public view returns (uint256) {
        return companies[company].balance;
    }

    function getPartnerBalance(address partner) public view returns (uint256) {
        return partners[partner].balance;
    }

    function getPartner(address pId) view public returns (uint256 balance, uint256 latestPay) {
        Partner memory partner = partners[pId];
        return (partner.balance, partner.latestPay);
    }

    function getCompany(address pId) view public returns (uint256 balance) {
        return companies[pId].balance;
    }
}