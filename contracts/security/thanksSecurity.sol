import "@openzeppelin/contracts/access/AccessControl.sol";

contract thanksSecurity is AccessControl {
    bytes32 public constant AUTHORIZED = keccak256("AUTHORIZED");

    modifier checkAuthorized() {
        require(hasRole(AUTHORIZED, msg.sender));
        _;
    }

    constructor(address[] memory authorized) {
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