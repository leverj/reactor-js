// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ERC20Proxy} from "./token/ERC20/ERC20Proxy.sol";
import {BnsVerifier} from "./BnsVerifier.sol";

contract Vault {

    struct Chain {
        uint64 id; // see: https://eips.ethereum.org/EIPS/eip-2294
        string name;
        string symbol;
        uint8 decimals;
    }

    address constant public NATIVE = address(0);

    /**
     * Token transferred to another chain.
     * The payload structure: <Origin: {chain, token, decimals}>, token-amount, owner-address, from-chain, to-chain, send-counter
     * from-chain may seem redundant at first glance. however, consider the case where L[1] transfers Token to L[n] and L[m],
     * and both L[n] and L[m] transfers it back to L[1], and both L[n] and L[m] could have the same counter, so another key in the form of from-chain is needed
     */
    event Transfer(uint64 indexed origin, address indexed token, string name, string symbol, uint8 decimals, uint amount, address indexed owner, uint64 from, uint64 to, uint sendCounter);


    /// key[index] is invalid
    error InvalidPublicKey(uint8 index);

    Chain public home;
    uint[4] public publicKey;
    uint public sendCounter = 0;
    mapping(address => uint) public balances;
    mapping(bytes32 => bool) public outTransfers;
    mapping(bytes32 => bool) public inTransfers;
    mapping(uint64 => mapping(address => address)) public proxies;
    mapping(address => bool) public isCheckedIn;

    constructor(uint64 chainId_, string memory chainName_, string memory nativeSymbol_, uint8 nativeDecimals_, uint[4] memory publicKey_) {
        home = Chain(chainId_, chainName_, nativeSymbol_, nativeDecimals_);
        publicKey = publicKey_;
    }

    function chainId() external view returns (uint64) { return home.id; }

    function checkOutNative(uint64 to) external payable {
        balances[NATIVE] += msg.value;
        checkOut(home.id, NATIVE, home.name, home.symbol, home.decimals, msg.value, msg.sender, to);
    }

    function checkOutToken(uint64 to, address token, uint amount) external {
        if (isCheckedIn[token]) {
            ERC20Proxy proxy = ERC20Proxy(token);
            proxy.burn(msg.sender, amount);
            checkOut(proxy.chain(), proxy.token(), proxy.name(), proxy.symbol(), proxy.decimals(), amount, msg.sender, to);
        } else {
            ERC20 erc20 = ERC20(token);
            disburseToken(token, msg.sender, address(this), amount);
            balances[token] += amount;
            checkOut(home.id, token, erc20.name(), erc20.symbol(), erc20.decimals(), amount, msg.sender, to);
        }
    }

    function checkOut(uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner, uint64 to) private {
        sendCounter++;
        bytes32 hash = keccak256(abi.encode(origin, token, name, symbol, decimals, amount, owner, home.id, to, sendCounter));
        outTransfers[hash] = true;
        emit Transfer(origin, token, name, symbol, decimals, amount, owner, home.id, to, sendCounter);
    }

    function validatePublicKey(uint[4] calldata key) private view {
        for (uint8 i = 0; i < 4; i++) if (publicKey[i] != key[i]) revert InvalidPublicKey(i);
    }

//    function getHash(bytes calldata payload) private pure returns (bytes32) {
//        (uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner, uint64 from, uint64 to, uint counter) = abi.decode(payload, (uint64, address, string, string, uint8, uint, address, uint64, uint64, uint));
//        return keccak256(abi.encode(origin, token, name, symbol, decimals, amount, owner, from, to, counter));
//    }

    function checkIn(uint[2] calldata signature, uint[4] calldata signerPublicKey, bytes calldata payload) external {
        validatePublicKey(signerPublicKey);
        bytes32 hash = keccak256(payload);
        require(!inTransfers[hash], 'Token already checked-in');
        BnsVerifier.verify(signature, signerPublicKey, hash);
        (uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner, , ,) = abi.decode(payload, (uint64, address, string, string, uint8, uint, address, uint, uint, uint));
        mintOrDisburse(origin, token, name, symbol, decimals, amount, owner);
        inTransfers[hash] = true;
    }

    function mintOrDisburse(uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner) private {
        home.id == origin ?                                             // if token is coming back home (to originating chain) ...
            disburse(token, address(this), owner, amount) :             // ... disburse amount back to the owner
            mint(origin, token, name, symbol, decimals, amount, owner); // ... it's a foreign country, mint proxy for the owner
    }

    function mint(uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner) private {
        if (proxies[origin][token] == address(0)) { // if proxy yet to exist
            proxies[origin][token] = address(new ERC20Proxy(origin, token, name, symbol, decimals));
            isCheckedIn[proxies[origin][token]] = true;
        }
        ERC20Proxy(proxies[origin][token]).mint(owner, amount);
    }

    function disburse(address token, address from, address to, uint amount) private {
        balances[token] -= amount;
        token == NATIVE ? disburseNative(to, amount) : disburseToken(token, from, to, amount);
    }

    function disburseNative(address to, uint amount) private { payable(to).transfer(amount); }

    function disburseToken(address token, address from, address to, uint amount) private {
        ERC20 erc20 = ERC20(token);
        uint balance = erc20.balanceOf(to);
        from == address(this) ? erc20.transfer(to, amount) : erc20.transferFrom(from, to, amount);
        require(erc20.balanceOf(to) == (balance + amount), 'Invalid transfer');
    }
}
