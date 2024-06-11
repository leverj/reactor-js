pragma solidity ^0.8.20;
import "hardhat/console.sol";

//This contract sits on L2 chain
contract L2Vault {
    event L2WithdrawByUser(address user, uint amount);
    event L2DepositedToUser(address depositor, uint amount);

    constructor() {
    }
    function withdrawByUser(uint amount) external {
        emit L2WithdrawByUser(msg.sender, amount);
    }

    function verifyAggregateSignatureAndTransact() external{
        
    }
}