// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./RevertCheck.sol";

contract ThanksSecurity is AccessControl, RevertCheck {
    bytes32 public constant AUTHORIZED = keccak256("AUTHORIZED");
    uint public constant shit = 100;

    function getShit() pure public returns(uint256) {
        return shit;
    }

    modifier checkAuthorized() {
        require(hasRole(AUTHORIZED, msg.sender));
        _;
    }

    constructor(address[] memory authorized) {
        console.log("in security's constructor: ", msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(AUTHORIZED, msg.sender);
        for (uint i; i<authorized.length; i++){
            grantRole(AUTHORIZED, authorized[i]);
        }
    }

    function authorize(address[] memory authorized) checkAuthorized() public {
        for (uint i; i<authorized.length; i++){
            grantRole(AUTHORIZED, authorized[i]);
        }
    }

    function isAuthorized(address account) public view returns (bool){
        if (hasRole(AUTHORIZED, account)){
            return true;
        } else {
            return false;
        }
    }
}