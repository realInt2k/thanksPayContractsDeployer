// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./data/ThanksData.sol";
import "hardhat/console.sol";
import "./security/RevertCheck.sol";
import "./check/ThanksPayCheck.sol";
import "./security/ThanksSecurityWrapper.sol";

contract ThanksPayMain is ThanksSecurityWrapper{
    using SafeMath for uint256;
    ThanksData private data;
    ThanksPayCheck check;

    event workerGotThanksPay(uint256 wId, uint256 pId, uint256 amount, string bankReceipt, uint256 timestamp);
    // event partnerGotThanksPay(uint256 pId, uint256 amount, string bankReceipt, uint256 timestamp);
    event partnerGotBonus(uint256 pId, uint256 amount);
    
    constructor(address _security, address dataAddr) ThanksSecurityWrapper(_security) {
        data = ThanksData(dataAddr);
    }

    function setLatestWagePay(uint256 pId, uint256 timestamp) public isAuthorized(msg.sender){
        data.setLatestWagePay(pId, timestamp);
    }

    // TS calls workerGetSalaryEarlyCheck first, so there is no checking 
    // because we assume everything is fine
    function subtractFromPartner(uint256 pId, uint256 amount) public isAuthorized(msg.sender){
        (uint256 balance, uint256 bonus, ) = data.getPartner(pId);

        if (amount <= balance) {
            data.setPartnerBalance(pId, balance.sub(amount));
        } else {
            data.setPartnerBalance(pId, 0);
            data.setPartnerBonus(pId, bonus.sub(amount.sub(balance)));
        }
    }

    // added by the GivingDays.Inc
    function partnerAddBonus(uint256 pId, uint256 amount) public isAuthorized(msg.sender){
        (uint256 balance, uint256 bonus, ) = data.getPartner(pId);
        data.setPartnerBonus(pId, bonus.add(amount));
        emit partnerGotBonus(pId, amount);
    }

    // added by partner himself
    function partnerAddBalance(uint256 pId, uint256 amount) public isAuthorized(msg.sender){
        (uint256 balance, uint256 bonus, ) = data.getPartner(pId);
        data.setPartnerBalance(pId, balance.add(amount));
    }

    function workerGetsThanksPay( // like getting money
        uint256 wId, 
        uint256 pId, // typically same as partner address
        uint256 amount, 
        string memory bankReceipt,
        uint256 timestamp 
    ) public isAuthorized(msg.sender) {
        uint256 wBalance = data.getWorkerBalance(wId);
        uint256 newWBalance = wBalance.sub(amount);

        subtractFromPartner(pId, amount); // subtract from partner
        data.setWorkerBalance(wId, newWBalance); 
        data.setLatestRequest(wId, timestamp);

        emit workerGotThanksPay(wId, pId, amount, bankReceipt, timestamp);
    }
}