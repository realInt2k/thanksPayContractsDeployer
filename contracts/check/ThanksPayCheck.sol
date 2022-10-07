// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
import "./../security/ThanksSecurity.sol";
import "./../security/ThanksSecurityWrapper.sol";
import "./../data/ThanksData.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ThanksPayCheck is ThanksSecurityWrapper{
    using SafeMath for uint256;
    ThanksData private data;

    constructor(address dataAddr, address securityAddr) ThanksSecurityWrapper(msg.sender) {
        data = ThanksData(dataAddr);
    }

    // modifier isAuthorized() {
    //     //security.revertCheck(security.isAuthorized(msg.sender));
    //     revertCheck(isAuthorized(msg.sender));
    //     _;
    // }

    function subtractFromPartnerCheck(uint256 pId, uint256 amount) public view returns(bool) {
        (uint256 balance, uint256 bonus, ) = data.getPartner(pId);
        if (balance.add(bonus) >= amount) {
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

    function workerGetsThanksPayCheck(uint256 wId, uint256 amount) external view returns(bool)  {
        uint256 workerBalance = data.getWorkerBalance(wId);
        (,,uint256 pId,,) = data.getWorker(wId);
        uint256 thanksPayableBalance = data.getPartnerThanksPayableBalance(pId);
        // check if the Partner or worker doesn't have eough money is sufficent
        if(workerBalance >= amount && thanksPayableBalance >= amount) return true;
        return false;
    }

    function registerWorkerCheck(uint256 wId, uint256 pId, uint256 wage) public view returns(bool) {
        (,,,,bool exist) = data.workers(wId);
        (,,,bool pExist) = data.partners(pId);
        if (exist || !pExist) {
            return false;
        } else {
            return true;
        }
    }

    function setWorkerPartnerCheck(uint256 wId, uint256 pId) public view returns(bool) {
        (,,,,bool exist) = data.workers(wId);
        if (exist) {
            return true;
        } else {
            return false;
        }
    }

    function setPartnerBonusCheck(uint256 pId, uint256 bonus) public view returns(bool){
        (,,,bool exist) = data.partners(pId);
        if(exist) {
            return false;
        } else {
            return true;
        }
    }

    function registerPartnerCheck(uint256 pId, uint256 latestPay) public view returns(bool) {
        (,,,bool exist) = data.partners(pId);
        if(exist) {
            return false;
        } else {
            return true;
        }
    }

    function setLatestWagePayCheck(uint256 pId, uint256 timestamp) public view returns(bool) {
        (,,,bool exist) = data.partners(pId);
        if(exist) {
            return false;
        } else {
            return true;
        }
    }

    function setLatestRequestCheck(uint256 wId, uint256 latestRequest) public view returns(bool) {
        (,,,,bool exist) = data.workers(wId);
        if (exist) {
            return true;
        } else {
            return false;
        }
    }

    function setWorkerBalanceCheck(uint256 wId, uint256 newBalance) public view returns(bool) {
        (,,,,bool exist) = data.workers(wId);
        if (exist) {
            return true;
        } else {
            return false;
        }
    }

    function setPartnerBalanceCheck(uint256 pId, uint256 newBalance) public view returns(bool) {
        (,,,bool exist) = data.partners(pId);
        if(exist) {
            return false;
        } else {
            return true;
        }
    }

    function partnerAddBonusCheck(uint256 pId, uint256 amount, uint256 timestamp) public view returns(bool) {
        (,,,bool exist) = data.partners(pId);
        if(exist) {
            return false;
        } else {
            return true;
        }
    }

    function partnerAddBalanceCheck(uint256 pId, uint256 amount, uint256 timestamp) public view returns(bool) {
        (,,,bool exist) = data.partners(pId);
        if(exist) {
            return true;
        } else {
            return false;
        }
    }
}