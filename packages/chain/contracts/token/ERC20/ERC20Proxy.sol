// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Proxy is ERC20 {

    struct OriginatingToken {
        uint chainId;
        address token;
        uint8 decimals;
    }

    address public owner;
    OriginatingToken public origin;

    modifier isOwner { require(msg.sender == owner, "not an owner");  _; }

    constructor(string memory name_, string memory symbol_, uint8 decimals_, address token_, uint chainId_) ERC20(name_, symbol_) {
        origin = OriginatingToken(chainId_, token_, decimals_);
        owner = msg.sender;
    }

    function mint(address account, uint amount) public isOwner {
        _mint(account, amount);
    }

    function burn(address account, uint amount) public isOwner {
        _burn(account, amount);
    }

    function chainId() public view virtual returns (uint) {
        return origin.chainId;
    }

    function token() public view virtual returns (address) {
        return origin.token;
    }

    function decimals() public view virtual override returns (uint8) {
        return origin.decimals;
    }

    function originatingName() public view returns (string memory) {
        return super.name();
    }

    function name() public view override returns (string memory) {
        return string.concat(super.name(), '_REACTOR');
    }

    function originatingSymbol() public view returns (string memory) {
        return super.symbol();
    }

    function symbol() public view override returns (string memory) {
        return string.concat(originatingSymbol(), '_R');
    }
}
