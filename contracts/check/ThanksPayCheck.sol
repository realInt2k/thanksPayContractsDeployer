// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
import "./../security/ThanksSecurity.sol";
import "./../data/ThanksData.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ThanksPayCheck {
    using SafeMath for uint256;
    ThanksSecurity private security;
    ThanksData private data;

    constructor(address dataAddr, address securityAddr) {
        security = ThanksSecurity(securityAddr);
        data = ThanksData(dataAddr);
    }

    modifier isAuthorized() {
        security.revertCheck(security.isAuthorized(msg.sender));
        _;
    }

    function subtractFromPartnerCheck(uint256 pId, uint256 amount) public view returns(bool) {
        (uint256 balance, uint256 bonus,) = data.getPartner(pId);
        if (balance + bonus >= amount) {
            return true;
        } else {
            return false;
        }
    }

    function partnerWithdrawCheck(uint256 pId, uint256 amount) public view returns(bool) {
        (uint256 balance, ,) = data.getPartner(pId);
        if (balance >= amount) {
            return true;
        } else {
            return false;
        }
    }

    function workerGetsThanksPayCheck(uint256 wId, uint256 amount) public view returns(bool)  {
        uint256 workerBalance = data.getWorkerBalance(wId);
        // check if the Partner or worker doesn't have eough money is sufficent 
        if(workerBalance < amount) return false;
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