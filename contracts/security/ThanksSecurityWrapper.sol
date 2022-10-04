import "./ThanksSecurity.sol";
import "./RevertCheck.sol";

contract ThanksSecurityWrapper is RevertCheck {
    
    address thanksSecurityAddr;
    
    mapping(address => bool) authorized; 

    constructor(address _authorized) {
        authorized[_authorized] = true;
    }

    function authorize(address[] memory _authorized) public {
        // require(msg.sender == thanksSecurityAddr, "NO");

        for (uint i = 0; i < _authorized.length; i++) {
            authorized[_authorized[i]] = true;
        }
    }

    function recallAuthorization(address[] memory _notAuthorized) public {
        require(msg.sender == thanksSecurityAddr, "NO");
        for (uint i = 0; i < _notAuthorized.length; i++) {
            authorized[_notAuthorized[i]] = false;
        }
    }
    
    function checkAuthorized(address account) external view returns (bool){
        return authorized[account];
    }

    modifier isAuthorized(address check) {
        revertCheck(authorized[check]==true, "FUCK");
        _;
    }
}