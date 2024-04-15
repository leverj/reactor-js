// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BlsVerify {
    string public name = "DlsVerify";
    constructor (string memory _name) {
        name = _name;
    }
    function verify() public view returns (string memory) {
        return name;
    }
}