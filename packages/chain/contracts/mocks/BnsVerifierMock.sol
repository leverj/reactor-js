// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BnsVerifier} from "../BnsVerifier.sol";

contract BnsVerifierMock {
    function verify(uint[2] memory signature, uint[4] memory pubkey, bytes32 hash) external view {
        BnsVerifier.verify(signature, pubkey, hash);
    }
}
