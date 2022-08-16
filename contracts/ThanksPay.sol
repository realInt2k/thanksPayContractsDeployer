import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ERC20/PartnerWon.sol";
import "./ERC20/WorkerWon.sol";
import "./data/thanksData.sol";
import "./utils/thanksSecurity.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


contract ThanksPay {
    using SafeMath for uint256;
    ThanksPayData data;
    PartnerWon partnerWon;
    WorkerWon workerWon;
    
    constructor(address dataAddress, address _partnerWon, address _workerWon) {
        data = ThanksPayData(dataAddress);
        partnerWon = PartnerWon(_partnerWon);
        workerWon = WorkerWon(_workerWon);
    }

    struct CompanyPool {
        uint256 balance;
    }
    
    mapping (address => CompanyPool) public companyPools;

    function registerPartner(address pId, uint256 relativePayday, uint256 latestPay) public {
        data.registerPartner(pId, relativePayday, latestPay);
        companyPools[pId] = CompanyPool(0);
    }

    function registerWorker(address wId, address pId, uint256 wage) public {
        data.registerWorker(wId, pId, wage);
    }

    function partnerTransaction(
        uint256 addRemove,
            // 0: add, 1: remove
        address company,
            // By default, same as partner address for this company
        address pledger, 
            // The entity putting the money: either ThanksPay or Parent company
        uint256 amount,
        string memory bankReceipt
    ) public {
        if (addRemove == 0){
            // i.e. if you want to add money to the ThanksPay pool
            partnerWon.mintFor(pledger, amount);
            companyPools[company].balance = companyPools[company].balance.add(amount);
        }

        if (addRemove == 1){
            // i.e. if you want to withdraw money from the ThanksPay pool
            require(partnerWon.balanceOf(pledger)>amount, "You cannot withdraw this much!");
            partnerWon.burnFrom(pledger, amount);
            companyPools[company].balance = companyPools[company].balance.sub(amount);
        }

    }

    function workerTransaction(
        address worker, 
        address company, // typically same as partner address
        uint256 amount,
        string memory bankReceipt
    ) public {
        // i.e. if you want to withdraw money from the ThanksPay pool
            require(companyPools[company].balance > amount, "You cannot withdraw this much!");
            // partnerWon.transferFrom();
            partnerWon.burnFrom(company, amount);
            workerWon.burnFrom(worker, amount);
    }
}