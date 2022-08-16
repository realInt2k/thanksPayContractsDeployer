import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//Safe Math Interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../data/thanksData.sol";
import "../utils/readData.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../security/thanksSecurity.sol";


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract PartnerWon is readData, IERC20 {
    
    using SafeMath for uint256;


    uint public override totalSupply;
    
    // mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
    mapping(address => uint) public balances;
    
    string public name = "ThanksPay Partner Won";
    string public symbol = "TPW";
    uint8 public decimals = 0;

    thanksSecurity security; 

    constructor(address dataAddress, address securityAddress) readData(dataAddress) {
        security = thanksSecurity(securityAddress);
    }

    function mintFor(address for_, uint amount) external {
        require(security.isAuthorized(msg.sender));
        balances[for_] += amount;
        allowance[for_][msg.sender] += amount;
            // automatically allow admin to access this money.
        emit Transfer(address(0), for_, amount);
    }

    function burnFrom(address from, uint256 amount) external {
        require(allowance[from][msg.sender] > amount, "Not enough allowance");
        require(balanceOf(from) > amount, "Not enough balance");
            // automatically allow admin to access this money. 
        allowance[from][msg.sender] = allowance[from][msg.sender].sub(amount);
        balances[from] = balances[from].sub(amount);

        emit Transfer(from, address(0), amount);
    }

    function balanceOf(address account) public view override returns(uint256) {
        return getPartnerBalance(account);
    } 
    
    function transferFrom (
        address sender,
        address recipient,
        uint amount
    ) external override returns (bool) {
        allowance[sender][msg.sender] = allowance[sender][msg.sender].sub(amount);
            // take money from the guy
        allowance[recipient][msg.sender] = allowance[recipient][msg.sender].add(amount);
            // autamtically allow admin to access this money. 
        balances[sender] = balances[sender].sub(amount);
        balances[recipient] = balances[recipient].sub(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function transfer(address recipient, uint amount) external override returns (bool) {
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}