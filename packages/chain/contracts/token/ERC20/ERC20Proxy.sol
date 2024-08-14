// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC165, ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ITokenProxy} from "../ITokenProxy.sol";

contract ERC20Proxy is ERC20, ERC165, ITokenProxy {

    struct Origin {
        uint64 chain; // see: https://eips.ethereum.org/EIPS/eip-2294
        address token;
        uint8 decimals;
    }

    address public owner;
    Origin public origin;

    modifier isOwner { require(msg.sender == owner, "not an owner");  _; }

    constructor(string memory name, string memory symbol, uint8 decimals_, address token_, uint64 chain_) ERC20(name, symbol) {
        origin = Origin(chain_, token_, decimals_);
        owner = msg.sender;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(ITokenProxy).interfaceId || super.supportsInterface(interfaceId);
    }

    function mint(address account, uint amount) public isOwner { _mint(account, amount); }

    function burn(address account, uint amount) public isOwner { _burn(account, amount); }

    function chain() public view virtual returns (uint64) { return origin.chain;  }

    function token() public view virtual returns (address) { return origin.token; }

    function decimals() public view virtual override returns (uint8) { return origin.decimals; }
}
