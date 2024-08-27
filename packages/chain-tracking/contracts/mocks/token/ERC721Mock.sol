// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function mint(address to, uint tokenId) public {
        _mint(to, tokenId);
    }

    function safeMint(address to, uint tokenId) public {
        _safeMint(to, tokenId);
    }

    function safeMint(
        address to,
        uint tokenId,
        bytes memory _data
    ) public {
        _safeMint(to, tokenId, _data);
    }

    function burn(uint tokenId) public {
        _burn(tokenId);
    }
}
