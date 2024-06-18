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

    uint256[4] public pubkey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public deposited;
    uint public depositCounter = 0;

    BlsVerify verifier;

    constructor() {
        verifier = new BlsVerify();
    }
    //FIXME who can call this ? isOwner or some multi-sig operation like a DAO op?
    function setPublicKey(uint[4] memory publicKey) external {
        pubkey = publicKey;
    }
    function depositEth(uint toChainId) external payable {
        pool[ETH] += msg.value;
        uint counter = depositCounter++;
        bytes32 hash = hashOf(msg.sender, ETH, toChainId, msg.value, counter);
        deposited[hash] = true;
        console.logString('depositEth');
        console.logBytes32(hash);
        emit Deposited(msg.sender, ETH, toChainId, msg.value, counter);
    }
    //This function will be called both externally and internally, hence public. 
    //Clients could calculate the hash off-chain also and then simply query the public deposited map above.
    function isDeposited(address depositor, address token, uint toChainId, uint amount, uint counter) public view returns (bool){
        bytes32 hash = hashOf(depositor, token, toChainId, amount, counter);
        return deposited[hash];
    }
    function hashOf(address depositor, address token, uint toChainId, uint amount, uint counter) public view returns (bytes32){
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
    //Series of validations 
    //Signing Public Key is same as the one in contract here
    //The message string is a correct hash of the business params
    //Check if message (G1 on curve) is actually the representation of message string on G1 curve
    function verifySignature(uint256[2] memory signature, uint256[4] memory signerKey, uint256[2] memory message, string memory messageString, address depositor, address token, uint toChainId, uint amount, uint counter) public view returns (bool) {
        require(pubkey.length == signerKey.length, 'Invalid Public Key length');
        require((pubkey[0] == signerKey[0] && pubkey[1] == signerKey[1] && pubkey[2] == signerKey[2] && pubkey[3] == signerKey[3]), 'Invalid Public Key');

        bytes32 hashOf = hashOf(depositor, token, toChainId, amount, counter);
        string memory bytes32ToString = bytes32ToHexString(hashOf);
        require (keccak256(abi.encodePacked(messageString)) == keccak256(abi.encodePacked(bytes32ToString)), 'Invalid Message');
        
        uint256[2] memory hashToPoint = verifier.hashToPoint(bytes(cipher_suite_domain), bytes(messageString));
        require(hashToPoint[0] == message[0] && hashToPoint[1] == message[1], 'Invalid hash to point');

        bool validSignature = verifier.verifySignature(signature, signerKey, message);
        require(validSignature == true, 'Invalid Signature');
        
        //process business data now like minting burning
        return validSignature;
    }
}