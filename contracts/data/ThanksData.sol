// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ThanksDataStatic.sol";
import "../security/ThanksSecurityWrapper.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/*
    This has pure set and get, no logics
 */

contract ThanksData is ThanksDataStatic, ThanksSecurityWrapper {
    using SafeMath for uint256;

    constructor(address securityAddr) ThanksSecurityWrapper(securityAddr) {

    }

    function registerPartner(uint256 pId, uint256 latestPay) public isAuthorized(msg.sender){
        partners[pId] = Partner(0, 0, latestPay);
        types[pId] = 1;
        emit partnerRegistered(pId, latestPay);
    }

    function setPartnerBonus(uint256 pId, uint256 bonus) public isAuthorized(msg.sender) {
        partners[pId].bonus = bonus;
    }

    function setPartnerBalance(uint256 pId, uint256 newBalance) public isAuthorized(msg.sender) {
        partners[pId].balance = newBalance;
        emit partnerBalanceChanged(pId, newBalance);
    }

    function registerWorker(uint256 wId, uint256 pId, uint256 wage) public isAuthorized(msg.sender) {
        workers[wId] = Worker(0, wage, pId, 0);
        types[wId] = 2;
        emit workerRegistered(wId, pId, wage);
    }

    function setLatestRequest(uint256 wId, uint256 latestRequest) public isAuthorized(msg.sender) {
        workers[wId].latestRequest = latestRequest;
    }
    
    function setWorkerBalance(uint256 wId, uint256 newBalance) public isAuthorized(msg.sender) {
            workers[wId].balance = newBalance;
            emit workerBalanceChanged(wId, newBalance);
    }

    function setLatestWagePay(uint256 pId, uint256 timestamp) public isAuthorized(msg.sender) {
        partners[pId].latestPay = timestamp;
    }

    function getWorker(uint256 wId) view public returns (uint256 balance, uint256 wage, uint256 pId, uint256 latestRequest) {
        Worker memory worker = workers[wId];
        return (worker.balance,
                worker.wage,
                worker.pId,
                worker.latestRequest
            );
    }

    function getWorkerBalance(uint256 wId) public view returns (uint256) {
        Worker memory worker = workers[wId];
        Partner memory partner = partners[worker.pId];

        if (worker.latestRequest < partner.latestPay) {
            return worker.wage;
        } else {
            return worker.balance;
        }
    }
    function getPartnerThanksPayableBalance(uint256 partner) public view returns (uint256) {
        // return both partner's balance and bonus
        return (partners[partner].balance.add(partners[partner].bonus));
    }

    function getPartnerWithdrawableBalance(uint256 partner) public view returns (uint256) {
        // return both partner's balance and bonus
        return (partners[partner].balance);
    }

    function getPartner(uint256 pId) view public returns (uint256 balance, uint256 bonus, uint256 latestPay) {
        Partner memory partner = partners[pId];
        return (partner.balance, partner.bonus, partner.latestPay);
    }
}