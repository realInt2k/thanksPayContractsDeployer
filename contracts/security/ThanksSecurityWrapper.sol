import "./ThanksSecurity.sol";

contract ThanksSecurityWrapper {
    
    ThanksSecurity thanksSecurity;
    
    constructor(address securityAddr) {
        thanksSecurity = ThanksSecurity(securityAddr);
    }

    modifier isAuthorized(address check) {
        require(thanksSecurity.isAuthorized(check)==true, "FUCK");
        _;
    }
}