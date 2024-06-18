// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";
contract Vault {

    address constant public ETH = address(0);

    event Deposited(address indexed depositor, address indexed tokenAddress, uint toChainId, uint amount, uint depositCounter);
    event Withdrawn(address depositor, uint amount);
    event Minted(uint amount);
    event Disbursed(uint amount);

    uint256[4] public pubkey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public deposited;
    uint public depositCounter = 0;

    constructor() {
    }

    function depositEth(uint toChainId) external payable {
        pool[ETH] += msg.value;
        uint counter = depositCounter++;
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, ETH, toChainId, msg.value, counter));
        deposited[hash] = true;
        console.logBytes32(hash);
        emit Deposited(msg.sender, ETH, toChainId, msg.value, counter);
    }
    //This function will be called both externally and internally, hence public. 
    //Clients could calculate the hash off-chain also and then simply query the public deposited map above.
    function isDeposited(address depositor, address token, uint toChainId, uint amount, uint counter) public view returns (bool){
        bytes32 hash = keccak256(abi.encodePacked(depositor, token, toChainId, amount, counter));
        return deposited[hash];
    }
    //Utility function for unit testing
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
}