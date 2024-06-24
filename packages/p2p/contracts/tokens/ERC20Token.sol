pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "./IGluonWallet.sol";

contract ERC20Token is ERC20 {

    address public L1Address;
    address public owner;
    uint public network;
    uint8 internal _decimals;

    modifier isOwner {require(msg.sender == owner, "not an owner");
        _;}
    constructor(string memory name_, string memory symbol_, uint8 decimals_, address L1Address_, uint network_) ERC20(name_, symbol_) {
        _decimals = decimals_;
        L1Address = L1Address_;
        network = network_;
        owner = msg.sender;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address account, uint256 amount) public isOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public isOwner {
        _burn(account, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        if (uint160(recipient) > 0xffff) return super.transferFrom(sender, recipient, amount);
        require(allowance(sender, _msgSender()) >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, _msgSender(), allowance(sender, _msgSender()) - amount);
        //IGluonWallet(owner).withdrawFromToken(sender, recipient, address(this), amount);
        return true;
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        if (uint160(recipient) > 0xffff) return super.transfer(recipient, amount);
        //IGluonWallet(owner).withdrawFromToken(_msgSender(), recipient, address(this), amount);
        return true;
    }

    function info() public view virtual returns (string memory, uint8, address, uint){
        return (symbol(), decimals(), L1Address, network);
    }

}