// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./data/ThanksData.sol";
import "hardhat/console.sol";
import "./security/RevertCheck.sol";
import "./check/ThanksPayCheck.sol";
import "./security/ThanksSecurityWrapper.sol";

contract ThanksPayMain is ThanksSecurityWrapper, RevertCheck {
    using SafeMath for uint256;
    ThanksData private data;
    ThanksPayCheck check;

    event setLatestWagePayEvent(uint256 pId, uint256 timestamp);
    event partnerAddBonusEvent(uint256 pId, uint256 amount, uint256 timestamp);
    event partnerAddBalanceEvent(uint256 pId, uint256 amount, uint256 timestamp);
    event partnerWithdrawEvent(uint256 pId, uint256 amount, uint256 timestamp);
    event workerGetsThanksPayEvent(uint256 wId, uint256 pId, uint256 amount, string bankReceipt, uint256 timestamp);
    // event partnerGotThanksPay(uint256 pId, uint256 amount, string bankReceipt, uint256 timestamp);
    // event partnerAddBonusEvent(uint256 pId, uint256 amount);
    
    constructor(address _security, address dataAddr, address _check) ThanksSecurityWrapper(_security) {
        data = ThanksData(dataAddr);
        check = ThanksPayCheck(_check);
        
    }

    function setLatestWagePay(uint256 pId, uint256 timestamp) public isAuthorized(msg.sender){
        data.setLatestWagePay(pId, timestamp);
        emit setLatestWagePayEvent(pId, timestamp);
    }

    // TS calls workerGetSalaryEarlyCheck first, so there is no checking 
    // because we assume everything is fine
    function subtractFromPartner(uint256 pId, uint256 amount) public isAuthorized(msg.sender){
        revertCheck(check.subtractFromPartnerCheck(pId, amount), 1);
        (uint256 balance, uint256 bonus, ) = data.getPartner(pId);

        if (amount <= balance) {
            data.setPartnerBalance(pId, balance.sub(amount));
        } else {
            data.setPartnerBalance(pId, 0);
            data.setPartnerBonus(pId, bonus.sub(amount.sub(balance)));
        }
    }

    // added by the GivingDays.Inc, no check
    function partnerAddBonus(uint256 pId, uint256 amount, uint256 timestamp) public isAuthorized(msg.sender){
        (uint256 balance, uint256 bonus, ) = data.getPartner(pId);
        data.setPartnerBonus(pId, bonus.add(amount));
        emit partnerAddBonusEvent(pId, amount, timestamp);
    }

    // added by partner himself, no check
    function partnerAddBalance(uint256 pId, uint256 amount, uint256 timestamp) public isAuthorized(msg.sender){
        (uint256 balance, , ) = data.getPartner(pId);
        data.setPartnerBalance(pId, balance.add(amount));
        emit partnerAddBalanceEvent(pId, amount, timestamp);
    }

    function partnerWithdraw(uint256 pId, uint256 amount, uint256 timestamp) public isAuthorized(msg.sender) {
        revertCheck(check.partnerWithdrawCheck(pId, amount), 2);
        (uint256 balance,,) = data.getPartner(pId);
        data.setPartnerBalance(pId, balance.sub(amount));
        emit partnerWithdrawEvent(pId, amount, timestamp);
    }

    function workerGetsThanksPay( // like getting money
        uint256 wId, 
        uint256 pId, // typically same as partner address
        uint256 amount, 
        string memory bankReceipt,
        uint256 timestamp 
    ) public isAuthorized(msg.sender) {
        revertCheck(check.workerGetsThanksPayCheck(wId, amount), 3);
        uint256 wBalance = data.getWorkerBalance(wId);
        uint256 newWBalance = wBalance.sub(amount);

        subtractFromPartner(pId, amount); // subtract from partner
        data.setWorkerBalance(wId, newWBalance); 
        data.setLatestRequest(wId, timestamp);

        emit workerGetsThanksPayEvent(wId, pId, amount, bankReceipt, timestamp);
    }
}