// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Mock is ERC1155 {
    constructor(string memory uri) ERC1155(uri) {}

    function setURI(string memory newuri) public {
        _setURI(newuri);
    }

    function mint(address to, uint id, uint value, bytes memory data) public {
        _mint(to, id, value, data);
    }

    function mintBatch(address to, uint[] memory ids, uint[] memory values, bytes memory data) public {
        _mintBatch(to, ids, values, data);
    }

    function burn(address owner, uint id, uint value) public {
        _burn(owner, id, value);
    }

    function burnBatch(address owner, uint[] memory ids, uint[] memory values) public {
        _burnBatch(owner, ids, values);
    }
}
