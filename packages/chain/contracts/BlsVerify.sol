// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BlsVerify {
    constructor () {
    }

    function verify(uint256[2] memory signature, uint256[4] memory pubkey, uint256[2] memory message) internal view returns (bool) {
        uint256[12] memory input = [signature[0], signature[1], nG2x1, nG2x0, nG2y1, nG2y0, message[0], message[1], pubkey[1], pubkey[0], pubkey[3], pubkey[2]];
        uint256[1] memory out;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, input, 384, out, 32)
            switch success
            case 0 {
                invalid()
            }
        }
        require(success, "invalid signature");
        return out[0] != 0;
    }
}