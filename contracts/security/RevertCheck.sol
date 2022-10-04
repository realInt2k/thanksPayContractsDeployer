// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract RevertCheck {
    error revertExitCode(uint16 exitCode);
    error revertReason(string reason);
    error revertEmpty();
    function revertCheck(bool condition, uint16 exitCode) public pure {
        if(!condition)
            revert revertExitCode(exitCode);
    }

    function revertCheck(bool condition, string memory reason) public pure {
        if(!condition) 
            revert revertReason(reason);
    }

    function revertCheck(bool condition) public pure {
        if(!condition)
            revert revertEmpty();
    }
}