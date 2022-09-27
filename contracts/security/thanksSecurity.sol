// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./RevertCheck.sol";

contract ThanksSecurity is AccessControl, RevertCheck {
    // bytes32 public constant AUTHORIZED = keccak256("AUTHORIZED");
    mapping(address => bool) authorized;
    // uint public constant shit = 100;

    // function getShit() pure public returns(uint256) {
    //     return shit;
    // }

    modifier checkAuthorized() {
        require(authorized[msg.sender]==true);
        _;
    }
    

    constructor(address[] memory _authorized) {
        for (uint i=0; i<_authorized.length; i++){
            authorized[_authorized[i]] = true;
        }
    }

    function authorize(address[] memory _authorized) checkAuthorized() public {
         for (uint i=0; i<_authorized.length; i++){
            authorized[_authorized[i]] = true;
        }
    }

    function isAuthorized(address account) external view returns (bool){
        return authorized[account];
    }
}