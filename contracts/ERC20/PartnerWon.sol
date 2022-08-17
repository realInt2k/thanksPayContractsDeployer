import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//Safe Math Interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./../data/ThanksPayData.sol";
import "./../data/readData.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./../security/thanksSecurity.sol";


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract PartnerWon is readData, IERC20 {
    using SafeMath for uint256;


    uint public override totalSupply;
    
    // mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
    // mapping(address => uint) public balances;
    
    string public name = "ThanksPay Partner Won";
    string public symbol = "TPW";
    uint8 public decimals = 0;

    thanksSecurity security;

    constructor(address dataAddress, address securityAddress) readData(dataAddress) {
        security = thanksSecurity(securityAddress);
    }
    
    modifier isAuthorized() {
            require(security.isAuthorized(msg.sender));
            _;
    }

    function mintFor(address for_, uint amount) isAuthorized() external {
        require(security.isAuthorized(msg.sender));
        uint256 balance = getPartnerBalance(for_);
        balance = balance.add(amount);
        data.setPartnerBalance(for_, balance);
            // this is NOT a backup!
        allowance[for_][msg.sender] = allowance[for_][msg.sender].add(amount);
            // automatically allow admin to access this money.
        emit Transfer(address(0), for_, amount);
    }

    function burnFrom(address from, uint256 amount) isAuthorized() external {
        require(allowance[from][msg.sender] > amount, "Not enough allowance");
        require(balanceOf(from) > amount, "Not enough balance");
            // automatically allow admin to access this money. 
        allowance[from][msg.sender] = allowance[from][msg.sender].sub(amount);
        uint256 balance = getPartnerBalance(from);
        balance = balance.sub(amount);
        data.setPartnerBalance(from, balance);
            // this is a backup! 

        emit Transfer(from, address(0), amount);
    }

    function balanceOf(address account) public view override returns(uint256) {
        return getPartnerBalance(account);//balances[account]; // getPartnerBalance(account);
    } 
    
    function transferFrom (
        address sender,
        address recipient,
        uint amount
    ) external isAuthorized() override returns (bool) {
        allowance[sender][msg.sender] = allowance[sender][msg.sender].sub(amount);
            // take money from the guy
        allowance[recipient][msg.sender] = allowance[recipient][msg.sender].add(amount);
            // autamtically allow admin to access this money. 
        // balances[sender] = balances[sender].sub(amount);
        // balances[recipient] = balances[recipient].sub(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function transfer(address recipient, uint amount) external isAuthorized() override returns (bool) {
        // balances[msg.sender] -= amount;
        // balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external isAuthorized() override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}