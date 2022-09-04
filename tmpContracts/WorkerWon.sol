import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//Safe Math Interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./../data/ThanksPayData.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./../data/readData.sol";
import "hardhat/console.sol";
import "./../security/ThanksSecurity.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


contract WorkerWon is ThanksPayData, IERC20 {
    
    using SafeMath for uint256;

    uint public override totalSupply;
    
    // mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public allowances;

    function allowance(address owner, address spender) public view returns (uint256) {
        console.log("Addrsses", owner, spender);
        if (isAuthorized(spender)) {
            return balanceOf(owner);
            // if the sender is in authorized, allow the sender to 
            // access all funds
        } else {
            return allowances[owner][spender];
            // else, return the standard allowance
        }
        // return allowances[owner][spender];
    }
    // mapping(address => uint) public balances;
    
    string public name = "ThanksPay Worker Won";
    string public symbol = "TWW";
    uint8 public decimals = 0;

    ThanksSecurity security;

    constructor(address dataAddress, address securityAddress) ThanksPayData(dataAddress) thanksSecurity(securityAddress) {
    }

    modifier isAuthorizedMod() {
        require(isAuthorized(msg.sender));
        _;
    }

    function mintFor(address for_, uint amount) isAuthorizedMod() external {
        revert("Unsupported");
        // balances[for_] += amount;
        // allowance[for_][msg.sender] += amount;
            // automatically allow admin to access this money.
        emit Transfer(address(0), for_, amount);
    }

    function burnFrom(address from, uint256 amount, uint256 timestamp) isAuthorizedMod() external {
        require(allowance(from, msg.sender) >= amount, "Not enough allowance");
        require(balanceOf(from) >= amount, "Not enough balance");
            // automatically allow admin to access this money. 
        
        // allowances[from][msg.sender] = allowances[from][msg.sender].sub(amount);
        
        uint256 balance = balanceOf(from);
        balance = balance.sub(amount);
        
        setWorkerBalance(1, from, balance);
        setLatestRequest(from, timestamp);
            // this is NOT a backup!
        emit Transfer(from, address(0), amount);
    }

    function balanceOf(address account) public view override returns(uint256) {
        return getWorkerBalance(1, account); // type 1
    }  
    
    function transferFrom (
        address sender,
        address recipient,
        uint amount
    ) external isAuthorizedMod() override returns (bool) {
        revert("Unsupported");
        allowances[sender][msg.sender] = allowances[sender][msg.sender].sub(amount);
            // take money from the guy
        allowances[recipient][msg.sender] = allowances[recipient][msg.sender].add(amount);
            // autamtically allow admin to access this money. 
        // balances[sender] = balances[sender].sub(amount);
        // balances[recipient] = balances[recipient].sub(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }
    /**
     * TODO: Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    function transfer(address recipient, uint amount) external isAuthorizedMod() override returns (bool) {
        revert("Unsupported");
        // balances[msg.sender] -= amount;
        // balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }    

    function approve(address spender, uint amount) external isAuthorizedMod() override returns (bool) {
        allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}