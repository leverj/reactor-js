pragma solidity ^0.8.20;
import "hardhat/console.sol";

//This contract sits on Ethereum Mainnet, i.e. L1
contract GluonL1{
    event L1DepositByUser(address depositor, uint amount);
    event L1WithdrawnToUser(address depositor, uint amount);

    function depositByUser(uint amount) external {
        emit L1DepositByUser(msg.sender, amount);
    }

    function verifyAggregateSignatureAndTransact() external{

    }
}