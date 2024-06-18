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

    function verifySignature(uint256[2] memory signature, uint256[4] memory signerKey, uint256[2] memory message, string memory messageString, address depositor, address token, uint toChainId, uint amount, uint counter) public view returns (bool) {
        require(pubkey.length == signerKey.length, 'Invalid Public Key length');
        require((pubkey[0] == signerKey[0] && pubkey[1] == signerKey[1] && pubkey[2] == signerKey[2] && pubkey[3] == signerKey[3]), 'Invalid Public Key');
        bytes32 hashOf = hashOf(depositor, token, toChainId, amount, counter);
        uint256[2] memory hashToPoint = verifier.hashToPoint(bytes(cipher_suite_domain), bytes(messageString));
        require(hashToPoint[0] == message[0] && hashToPoint[1] == message[1], 'Invalid hash to point');
        console.logBytes32(hashOf);
        console.logString(messageString);
        bool validSignature = verifier.verifySignature(signature, signerKey, message);
        require(validSignature == true, 'Invalid Signature');
        //process business data now like minting burning
        return validSignature;
    }
}