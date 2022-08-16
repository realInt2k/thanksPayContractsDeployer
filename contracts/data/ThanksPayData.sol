// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./../security/thanksSecurity.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

contract ThanksPayData {

    thanksSecurity security;
    constructor(address securityAddress)
    {
        console.log("in ThanksPayData constructor, address for security is: ", securityAddress);
        security = thanksSecurity(securityAddress);
    }

    modifier isAuthorized() {
        console.log("in isAuthorized modifier");
        require(security.isAuthorized(msg.sender));
        _;
    }
    
    event workerRegistered(address wId, address pId, uint256 wage);
    event partnerRegistered(address pId, uint256 relativePayday);
    event companyPoolRegistered(address pId, uint256 relativePayday);
    event partnerBalanceChanged(address pId, uint256 newBalance);
    event workerBalanceChanged(uint256 wId, uint256 newBalance);

    struct Worker {
        uint256 balance;
            // current balance. Is updated every month. 
        uint256 wage;
            // monthly wage for a given worker
        address pId;
            // partnerId.
        uint256 latestRequest;
    }

    struct Partner {
        uint256 balance;
        uint256 relativePayday;
        uint256 latestPay;
    }

    struct Company {
        uint256 balance;
    }

    mapping(address => Worker) public workers;
    mapping(address => Partner) public partners;
    mapping(address => Company) public companyPools;
    mapping(address => uint256) public types; // 1: "Partner", 2: "Worker"
    

    function registerWorker(address wId, address pId, uint256 wage) isAuthorized() public {
            // the partner doesn't exist
        workers[wId] = Worker(0, wage, pId, 0);
        types[wId] = 2;
        emit workerRegistered(wId, pId, wage);
    }

    function registerPartner(address pId, uint256 relativePayday, uint256 latestPay) isAuthorized() public {
        partners[pId] = Partner(0, relativePayday, latestPay);
        types[pId] = 1;
        emit partnerRegistered(pId, relativePayday);
    }

    function setLatestRequest(address wId, uint256 latestRequest) isAuthorized() public {
        workers[wId].latestRequest = latestRequest;
    }

    function setWorkerBalance(address wId, uint256 newBalance) isAuthorized() public {
        workers[wId].balance = newBalance;
        emit partnerBalanceChanged(wId, newBalance);
    }

    function setPartnerBalance(address pId, uint256 newBalance) isAuthorized() public {
        partners[pId].balance = newBalance;
        emit partnerBalanceChanged(pId, newBalance);
    }

    function setRelativePayday(address pId, uint256 relativePayday) isAuthorized() public {
        partners[pId].relativePayday = relativePayday;
    }
}