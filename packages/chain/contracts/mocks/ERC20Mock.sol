// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ERC20Mock is ERC20 {

  constructor(uint supply, string memory name, string memory symbol) ERC20(name, symbol) {
    _mint(msg.sender, supply);
  }
}
