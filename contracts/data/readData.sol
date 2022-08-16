pragma solidity >=0.7.0 <0.9.0;

import "../data/thanksData.sol";
import "../security/thanksSecurity.sol";

contract readData {
        ThanksPayData data;
        
        constructor(address dataAddress) {
            data = ThanksPayData(dataAddress);
        }
        
        function readPartner(address pId) view public returns (uint256 balance, uint256 relativePayday, uint256 latestPay) {
            return (data.partners(pId));
        }

        function readWorker(address wId) view public returns (uint256 balance, uint256 wage, address pId, uint256 latestRequest) {
            return (data.workers(wId));
        }
        
        function getWorkerBalance(address account) public view returns (uint256) {
            (uint256 balance, uint256 wage, address pId, uint256 latestRequest) = readWorker(account);
            (, uint256 relativePayday, uint256 latestPay) = readPartner(pId);
            if (latestRequest < latestPay) {
                return wage;
            } else {
                return balance;
            }
        }

        function getPartnerBalance(address account) public view returns (uint256) {
            (uint256 balance, uint256 relativePayday, uint256 latestPay) = readPartner(account);
            return balance;
        }
}