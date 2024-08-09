// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BnsVerifier} from "../BnsVerifier.sol";

contract BnsVerifierMock {
    function validate(uint[2] memory signature, uint[4] memory pubkey, bytes32 hash) external view {
        BnsVerifier.validate(signature, pubkey, hash);
    }
}
