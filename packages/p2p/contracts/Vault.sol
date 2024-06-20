// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";
import './BlsVerify.sol';

contract Vault {

    address constant public ETH = address(0);
    string constant cipher_suite_domain = 'BN256-HASHTOPOINT';

    event Deposited(address indexed depositor, address indexed tokenAddress, uint toChainId, uint amount, uint depositCounter);
    event Withdrawn(address depositor, uint amount);
    event Minted(uint amount);
    event Disbursed(uint amount);

    uint256[4] public publicKey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public deposits;
    uint public depositCounter = 0;

    BlsVerify verifier;

    constructor(uint[4] memory publicKey_) {
        publicKey = publicKey_;
        verifier = new BlsVerify();
    }
    function depositEth(uint toChainId) external payable {
        pool[ETH] += msg.value;
        uint counter = depositCounter++;
        bytes32 hash = hashOf(msg.sender, ETH, toChainId, msg.value, counter);
        deposits[hash] = true;
        console.logString('depositEth');
        console.logBytes32(hash);
        emit Deposited(msg.sender, ETH, toChainId, msg.value, counter);
    }
    //fixme: do we need this
    function isDeposited(address depositor, address token, uint toChainId, uint amount, uint counter) public view returns (bool){
        bytes32 hash = hashOf(depositor, token, toChainId, amount, counter);
        return deposits[hash];
    }

    function hashOf(address depositor, address token, uint toChainId, uint amount, uint counter) public pure returns (bytes32){
        return keccak256(abi.encodePacked(depositor, token, toChainId, amount, counter));
    }

    function depositToken(uint amount) external {
//        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint amount) external {
        emit Withdrawn(msg.sender, amount);
    }

    function mint(uint amount) external {
//        emit Deposited(address(0), amount);
    }

    function disburse(uint amount) external {
        emit Withdrawn(address(0), amount);
    }
    
    function bytes32ToHexString(bytes32 _bytes32) internal pure returns (string memory) {
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

    //fixme: do we need this
    function hexCharToByte(bytes1 char) internal pure returns (bytes1) {
        if (uint8(char) >= 48 && uint8(char) <= 57) {
            return bytes1(uint8(char) - 48); // '0' - '9'
        }
        if (uint8(char) >= 65 && uint8(char) <= 70) {
            return bytes1(uint8(char) - 55); // 'A' - 'F'
        }
        if (uint8(char) >= 97 && uint8(char) <= 102) {
            return bytes1(uint8(char) - 87); // 'a' - 'f'
        }
        revert("Invalid hex character");
    }
    function mint(uint256[2] memory signature, uint256[4] memory signerKey, address depositor, address token, uint toChainId, uint amount, uint counter) public view returns (bool) {
        require(publicKey.length == signerKey.length, 'Invalid Public Key length');
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        bytes32 depositHash = hashOf(depositor, token, toChainId, amount, counter);
        uint256[2] memory messageToPoint = verifier.hashToPoint(bytes(cipher_suite_domain), bytes(bytes32ToHexString(depositHash)));
        bool validSignature = verifier.verifySignature(signature, signerKey, messageToPoint);
        require(validSignature == true, 'Invalid Signature');
        /*
         map(originatingNetwork => map(originalTokenAddress => proxyTokenAddress)) proxyTokenMap;
         map(depositHash => bool) minted;
         if (!proxyTokenMap[originatingNetwork][originalTokenAddress]) {
          proxyToken = create proxy token (name, symbol, decimals, originalTokenAddress, originatingNetwork);
          proxyTokenMap[originatingNetwork][originalTokenAddress] = proxyToken;
         }
         proxyToken = proxyTokenMap[originatingNetwork][originalTokenAddress];
         proxyToken.mint(depositor, amount);
         minted[depositHash] = true;
         */
        return validSignature;
    }
}