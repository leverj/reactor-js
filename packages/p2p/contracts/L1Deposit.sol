pragma solidity ^0.8.20;
import "hardhat/console.sol";

//This contract sits on Ethereum Mainnet, i.e. L1
contract L1Deposit{
    event L1DepositByUser(address depositor, uint amount);
    event L1WithdrawnToUser(address depositor, uint amount);

    function deposit(uint amount) external {
        emit L1DepositByUser(msg.sender, amount);
    }
    function test(uint a, uint b) pure external returns (uint){
        return a + b;
    }
}