// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import {modexp_3064_fd54, modexp_c191_3f52} from "./modexp.sol";

contract BlsVerify {
    // Field order
    uint constant N = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Negated genarator of G2
    uint constant nG2x1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint constant nG2x0 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint constant nG2y1 = 17805874995975841540914202342111839520379459829704422454583296818431106115052;
    uint constant nG2y0 = 13392588948715843804641432497768002650278120570034223513918757245338268106653;

    // sqrt(-3)
    uint constant z0 = 0x0000000000000000b3c4d79d41a91759a9e4c7e359b6b89eaec68e62effffffd;
    // (sqrt(-3) - 1)  / 2
    uint constant z1 = 0x000000000000000059e26bcea0d48bacd4f263f1acdb5c4f5763473177fffffe;

    uint constant FIELD_MASK = 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint constant SIGN_MASK = 0x8000000000000000000000000000000000000000000000000000000000000000;
    uint constant ODD_NUM = 0x8000000000000000000000000000000000000000000000000000000000000000;

    uint constant T24 = 0x1000000000000000000000000000000000000000000000000;
    uint constant MASK24 = 0xffffffffffffffffffffffffffffffffffffffffffffffff;

    bytes constant cipher_suite_domain = bytes('BNS_SIG_BNS256_XMD:SHA-256_SSWU');

    constructor() {}

    function works(string memory first, string memory second) public pure returns (bool) {
        console.log("%s %s", first, second);
        return true;
    }

    function verifySignature(uint[2] memory signature, uint[4] memory pubkey, uint[2] memory message) public view returns (bool) {
        uint[12] memory input = [signature[0], signature[1], nG2x1, nG2x0, nG2y1, nG2y0, message[0], message[1], pubkey[1], pubkey[0], pubkey[3], pubkey[2]];
        uint[1] memory out;
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

    function hashToPoint(bytes memory message) public view returns (uint[2] memory) {
        uint[2] memory u = hashToField(cipher_suite_domain, message);
        uint[2] memory p0 = mapToPointFT(u[0]);
        uint[2] memory p1 = mapToPointFT(u[1]);
        uint[4] memory bnAddInput;
        bnAddInput[0] = p0[0];
        bnAddInput[1] = p0[1];
        bnAddInput[2] = p1[0];
        bnAddInput[3] = p1[1];
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, bnAddInput, 128, p0, 64)
            switch success
            case 0 {
                invalid()
            }
        }
        require(success, "");
        return p0;
    }

    function bytes32ToHexString(bytes32 _bytes32) public pure returns (string memory) {
        bytes memory hexString = new bytes(64 + 2); // 64 characters for the hash + 2 for "0x"
        bytes memory hexAlphabet = "0123456789abcdef";
        hexString[0] = '0';
        hexString[1] = 'x';
        for (uint i = 0; i < 32; i++) {
            uint8 byteValue = uint8(_bytes32[i]);
            hexString[2 * i + 2] = hexAlphabet[byteValue >> 4];
            hexString[2 * i + 3] = hexAlphabet[byteValue & 0x0f];
        }
        return string(hexString);
    }

    function hashToField(bytes memory domain, bytes memory messages) internal pure returns (uint[2] memory) {
        bytes memory _msg = expandMsgTo96(domain, messages);
        uint z0_;
        uint z1_;
        uint a0;
        uint a1;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let p := add(_msg, 24)
            z1_ := and(mload(p), MASK24)
            p := add(_msg, 48)
            z0_ := and(mload(p), MASK24)
            a0 := addmod(mulmod(z1_, T24, N), z0_, N)
            p := add(_msg, 72)
            z1_ := and(mload(p), MASK24)
            p := add(_msg, 96)
            z0_ := and(mload(p), MASK24)
            a1 := addmod(mulmod(z1_, T24, N), z0_, N)
        }
        return [a0, a1];
    }

    function mapToPointFT(uint _x) internal view returns (uint[2] memory p) {
        require(_x < N, "mapToPointFT: invalid field element");
        uint x = _x;
        bool decision = isNonResidueFP(x);
        uint a0 = mulmod(x, x, N);
        a0 = addmod(a0, 4, N);
        uint a1 = mulmod(x, z0, N);
        uint a2 = mulmod(a1, a0, N);
        a2 = inverseFaster(a2);
        a1 = mulmod(a1, a1, N);
        a1 = mulmod(a1, a2, N);

        // x1
        a1 = mulmod(x, a1, N);
        x = addmod(z1, N - a1, N);
        // check curve
        a1 = mulmod(x, x, N);
        a1 = mulmod(a1, x, N);
        a1 = addmod(a1, 3, N);
        bool found;
        (a1, found) = sqrtFaster(a1);
        if (found) {
            if (decision) {
                a1 = N - a1;
            }
            return [x, a1];
        }

        // x2
        x = N - addmod(x, 1, N);
        // check curve
        a1 = mulmod(x, x, N);
        a1 = mulmod(a1, x, N);
        a1 = addmod(a1, 3, N);
        (a1, found) = sqrtFaster(a1);
        if (found) {
            if (decision) {
                a1 = N - a1;
            }
            return [x, a1];
        }

        // x3
        x = mulmod(a0, a0, N);
        x = mulmod(x, x, N);
        x = mulmod(x, a2, N);
        x = mulmod(x, a2, N);
        x = addmod(x, 1, N);
        // must be on curve
        a1 = mulmod(x, x, N);
        a1 = mulmod(a1, x, N);
        a1 = addmod(a1, 3, N);
        (a1, found) = sqrtFaster(a1);
        require(found, "BLS: bad ft mapping implementation");
        if (decision) {
            a1 = N - a1;
        }
        return [x, a1];
    }

    function expandMsgTo96(bytes memory domain, bytes memory message) internal pure returns (bytes memory) {
        uint t1 = domain.length;
        require(t1 < 256, "BLS: invalid domain length");
        // zero<64>|msg<var>|lib_str<2>|I2OSP(0, 1)<1>|dst<var>|dst_len<1>
        uint t0 = message.length;
        bytes memory msg0 = new bytes(t1 + t0 + 64 + 4);
        bytes memory out = new bytes(96);
        // b0
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let p := add(msg0, 96)

            let z := 0
            for {

            } lt(z, t0) {
                z := add(z, 32)
            } {
                mstore(add(p, z), mload(add(message, add(z, 32))))
            }
            p := add(p, t0)

            mstore8(p, 0)
            p := add(p, 1)
            mstore8(p, 96)
            p := add(p, 1)
            mstore8(p, 0)
            p := add(p, 1)

            mstore(p, mload(add(domain, 32)))
            p := add(p, t1)
            mstore8(p, t1)
        }
        bytes32 b0 = sha256(msg0);
        bytes32 bi;
        t0 = t1 + 34;

        // resize intermediate message
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(msg0, t0)
        }

        // b1

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(add(msg0, 32), b0)
            mstore8(add(msg0, 64), 1)
            mstore(add(msg0, 65), mload(add(domain, 32)))
            mstore8(add(msg0, add(t1, 65)), t1)
        }

        bi = sha256(msg0);

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(add(out, 32), bi)
        }

        // b2

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let t := xor(b0, bi)
            mstore(add(msg0, 32), t)
            mstore8(add(msg0, 64), 2)
            mstore(add(msg0, 65), mload(add(domain, 32)))
            mstore8(add(msg0, add(t1, 65)), t1)
        }

        bi = sha256(msg0);

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(add(out, 64), bi)
        }

        // // b3

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let t := xor(b0, bi)
            mstore(add(msg0, 32), t)
            mstore8(add(msg0, 64), 3)
            mstore(add(msg0, 65), mload(add(domain, 32)))
            mstore8(add(msg0, add(t1, 65)), t1)
        }

        bi = sha256(msg0);

        // solium-disable-next-line security/no-inline-assembly
        assembly {
            mstore(add(out, 96), bi)
        }

        return out;
    }

    function isNonResidueFP(uint e) internal view returns (bool isNonResidue) {
        bool callSuccess;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let freemem := mload(0x40)
            mstore(freemem, 0x20)
            mstore(add(freemem, 0x20), 0x20)
            mstore(add(freemem, 0x40), 0x20)
            mstore(add(freemem, 0x60), e)
        // (N - 1) / 2 = 0x183227397098d014dc2822db40c0ac2ecbc0b548b438e5469e10460b6c3e7ea3
            mstore(add(freemem, 0x80), 0x183227397098d014dc2822db40c0ac2ecbc0b548b438e5469e10460b6c3e7ea3)
        // N = 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47
            mstore(add(freemem, 0xA0), 0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47)
            callSuccess := staticcall(sub(gas(), 2000), 5, freemem, 0xC0, freemem, 0x20)
            isNonResidue := eq(1, mload(freemem))
        }
        require(callSuccess, "BLS: isNonResidueFP modexp call failed");
        return !isNonResidue;
    }

    function inverseFaster(uint a) internal pure returns (uint) {
        return modexp_3064_fd54.run(a);
    }

    function sqrtFaster(uint xx) internal pure returns (uint x, bool hasRoot) {
        x = modexp_c191_3f52.run(xx);
        hasRoot = mulmod(x, x, N) == xx;
    }
}
