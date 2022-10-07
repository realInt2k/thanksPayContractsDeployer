// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./ThanksSecurityWrapper.sol";
import "./RevertCheck.sol";

contract ThanksSecurity is AccessControl, RevertCheck {
    address[] registeredAddress;
        // the addresses that ever interacted with the system. Includes legacy
    mapping(address => int256) authorized;
    // mapping(address => bool) isAPerson;
        // the addresses curently authorized to interact with the system
    address Master;
        // the guy who can authorize/revoke authorization
    
    modifier isAuthorized() {
        revertCheck(authorized[msg.sender]>0, "FUCK");
        _;
    }

    function authorizeContracts(address[] memory _newlyAuthorized) public isAuthorized() {
        for (uint i = 0; i < _newlyAuthorized.length; i++) 
            if (authorized[_newlyAuthorized[i]] == 0 || authorized[_newlyAuthorized[i]] == -1) {
                authorized[_newlyAuthorized[i]] = 1;
                if(authorized[_newlyAuthorized[i]] == 0)
                    registeredAddress.push(_newlyAuthorized[i]);
            }
    }

    function authorizePeople(address[] memory _newlyAuthorized) public isAuthorized() {
        for (uint i = 0; i < _newlyAuthorized.length; i++) 
            if(authorized[_newlyAuthorized[i]] == 0 || authorized[_newlyAuthorized[i]] == -1){
                authorized[_newlyAuthorized[i]] = 2;
                if(authorized[_newlyAuthorized[i]] == 0)
                    registeredAddress.push(_newlyAuthorized[i]);
            }
    }

    function cancelAuthorization(address[] memory _notAuthorized) public isAuthorized() {
        for (uint i = 0; i < _notAuthorized.length; i++) {
            authorized[_notAuthorized[i]] = -1;
        }
    }

    function getAuthorizedContracts() public view returns (address[] memory) {
        address[] memory authorizedContracts = new address[](registeredAddress.length);
        uint authorizedCount = 0;
        for (uint i = 0; i < registeredAddress.length; i++) {
            if (authorized[registeredAddress[i]] == 1) {
                authorizedContracts[authorizedCount] = registeredAddress[i];
                authorizedCount++;
            }
        }
        return authorizedContracts;
    }

    function getAuthorizedHuman() public view returns (address[] memory) {
        address[] memory authorizedHuman = new address[](registeredAddress.length);
        uint authorizedCount = 0;
        for (uint i = 0; i < registeredAddress.length; i++) {
            if (authorized[registeredAddress[i]] == 2) {
                authorizedHuman[authorizedCount] = registeredAddress[i];
                authorizedCount++;
            }
        }
        return authorizedHuman;
    }

    function isPersonOrContract(address addr) public view returns (int256) {
        return authorized[addr];
        // 1 is contract 2 is human
    }

    constructor() {
        authorized[msg.sender] = 2;
        registeredAddress.push(msg.sender);
    }
}