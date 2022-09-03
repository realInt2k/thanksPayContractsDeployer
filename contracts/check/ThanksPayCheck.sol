// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
import "./../security/ThanksSecurity.sol";
import "./../data/ThanksDataInteraction.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ThanksPayCheck {
    using SafeMath for uint256;
    ThanksSecurity private security;
    ThanksDataInteraction private data;

    constructor(address dataAddr, address securityAddr) {
        security = ThanksSecurity(securityAddr);
        data = ThanksDataInteraction(dataAddr);
    }

    modifier isAuthorized() {
        security.revertCheck(security.isAuthorized(msg.sender));
        _;
    }

    function workerGetSalaryEarlyCheck (
        address workerAddress,
        uint256 amount
    ) public view returns(bool)  {
        uint256 moneyInquiry = data.getWorkerBalance(1, workerAddress);
        // check if the withdrawable salary is sufficent 
        if(moneyInquiry < amount) 
            return false;
        
        return true;
    }

    function registerWorkerCheck() public view returns(bool) {
        return security.isAuthorized(msg.sender);
    }

    function registerPartnerCheck() public view returns(bool) {
        return security.isAuthorized(msg.sender);
    }

    function setLatestWagePayCheck() public view returns(bool) {
        return security.isAuthorized(msg.sender);
    }

    function setLatestRequestCheck() public view returns(bool) {
        return security.isAuthorized(msg.sender);
    }

    function setWorkerBalanceCheck() public view returns(bool) {
        return security.isAuthorized(msg.sender);
    }

    function setCompanyBalanceCheck() public view returns(bool) {
        return security.isAuthorized(msg.sender);
    }

    function setPartnerBalanceCheck() public view returns(bool) {
        return security.isAuthorized(msg.sender);
    }
}