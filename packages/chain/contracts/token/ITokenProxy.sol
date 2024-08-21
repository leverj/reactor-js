// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITokenProxy {
    function chain() external returns (uint64);
    function token() external returns (address);
}
