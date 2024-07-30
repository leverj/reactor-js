// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RegularERC20 is ERC20 {

    address public owner;

    modifier isOwner {require(msg.sender == owner, "not an owner");
        _;}

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        owner = msg.sender;
    }
    function mint(address account, uint256 amount) public isOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public isOwner {
        _burn(account, amount);
    }
}
