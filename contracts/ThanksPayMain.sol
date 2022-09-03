// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./data/ThanksPayData.sol";
import "hardhat/console.sol";
import "./security/RevertCheck.sol";

contract ThanksPayMain{
    using SafeMath for uint256;
    ThanksSecurity private security;
    ThanksDataInteraction private data;
    
    constructor(address _security, address dataAddr) {
        data = ThanksDataInteraction(dataAddr);
        security = ThanksSecurity(_security);
        uint256 shit = security.getShit();
        console.log("security.shit is: ", shit);
    }

    // function partnerTransaction(
    //     uint256 addRemove,
    //         // 0: add, 1: remove
    //     address company,
    //         // By default, same as partner address for this company
    //     address pledger,
    //         // The entity putting the money: either ThanksPay or Parent company
    //     uint256 amount,
    //     string memory bankReceipt
    // ) public {
    //     if (addRemove == 0){
    //         // i.e. if you want to add money to the ThanksPay pool
    //         //partnerWon.mintFor(pledger, amount);
    //             // mint money for the pledger

    //         uint256 newBalance = data.getCompanyBalance(company).add(amount);
    //         data.setCompanyBalance(company, newBalance);
    //             // company's money is virtual one
    //             // add the amount to the company's pool
    //     }

    //     if (addRemove == 1){
    //         // i.e. if you want to withdraw money from the ThanksPay pool
    //         // uint256 withdrawable = companyPools[company].balance ;
    //         //require(partnerWon.balanceOf(pledger)>=amount, "You cannot withdraw this much!");
    //         //partnerWon.burnFrom(pledger, amount);
    //         // burn from the pledger 
    //         uint256 newBalance = data.getCompanyBalance(company).sub(amount);
    //         data.setCompanyBalance(company, newBalance);
    //     }
    // }

    function setLatestWagePay(
        address pId, uint256 timestamp
    ) public {
        data.setLatestWagePay(pId, timestamp);
    }


    // TS calls workerGetSalaryEarlyCheck first
    function workerGetSalaryEarly( // like getting money
        address workerAddress,
        address company, // typically same as partner address
        uint256 amount,
        string memory bankReceipt,
        uint256 timestamp
    ) public {
        
        // i.e. if you want to withdraw money from the ThanksPay pool
        //require(companyPools[company].balance >= amount, "You cannot withdraw this much!");
        // partnerWon.transferFrom();
        // partnerWon.burnFrom(company, amount);
        /**
            check if their worker's balance is greater than amount
            */
        //uint256 balance = workerWon.balanc+eOf(workerAddress);
        //revertCheck(balance >= amount);
        //workerWon.burnFrom(workerAddress, amount, timestamp);
    }
}