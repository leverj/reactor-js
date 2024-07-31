// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "./IGluonWallet.sol";

contract ERC20Proxy is ERC20 {

    address public originatingToken;
    address public owner;
    uint public originatingChain;
    uint8 internal _decimals;
    string public originatingName;
    string public originatingSymbol;

    modifier isOwner { require(msg.sender == owner, "not an owner");  _; }

    constructor(string memory name_, string memory symbol_, uint8 decimals_, address originatingToken_, uint originatingChain_) ERC20(name_, symbol_) {
        _decimals = decimals_;
        originatingToken = originatingToken_;
        originatingChain = originatingChain_;
        owner = msg.sender;
        originatingName = name_;
        originatingSymbol = symbol_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address account, uint amount) public isOwner {
        _mint(account, amount);
    }

    function burn(address account, uint amount) public isOwner {
        _burn(account, amount);
    }

    function name() public view override returns (string memory) {
        return string.concat(originatingName, '_REACTOR');
    }

    function symbol() public view override returns (string memory) {
        return string.concat(originatingSymbol, '_R');
    }
}
