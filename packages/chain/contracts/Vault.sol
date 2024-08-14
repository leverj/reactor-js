// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ERC20Proxy} from "./token/ERC20/ERC20Proxy.sol";
//import {ITokenProxy} from "./token/ITokenProxy.sol";
import {BnsVerifier} from "./BnsVerifier.sol";

contract Vault {

    struct Chain {
        uint id; //fixme: uint64, as per https://eips.ethereum.org/EIPS/eip-2294
        string name;
        string symbol;
        uint decimals;
    }

    address constant public NATIVE = address(0);

    /**
    * Token transferred to another chain.
    * The payload structure: <Origin: {chain, token, decimals}>, token-amount, owner-address, from-chain, to-chain, send-counter
    * from-chain may seem redundant at first glance. however, consider the case where L[1] transfers Token to L[n] and L[m],
    * and both L[n] and L[m] transfers it back to L[1], and both L[n] and L[m] could have the same counter, so another key in the form of from-chain is needed
    */
    event Transfer(uint indexed origin, address indexed token, string name, string symbol, uint decimals, uint amount, address indexed owner, uint from, uint to, uint sendCounter);

    Chain public home;
    uint[4] public publicKey;
    uint public sendCounter = 0;
    mapping(address => uint) public balances;
    mapping(bytes32 => bool) public outTransfers;
    mapping(bytes32 => bool) public inTransfers;
    mapping(uint => mapping(address => address)) public proxyMapping;
    mapping(address => bool) public isProxyMapping;

    constructor(uint chainId, string memory chainName, string memory nativeSymbol, uint nativeDecimals, uint[4] memory publicKey_) {
        home = Chain(chainId, chainName, nativeSymbol, nativeDecimals);
        publicKey = publicKey_;
    }

    function isProxy(address token) public view returns (bool) {
        return isProxyMapping[token];
//        return IERC165(token).supportsInterface(type(ITokenProxy).interfaceId); // fixme
    }

    //fixme: send => out
    function sendNative(uint to) external payable {
        balances[NATIVE] += msg.value;
        send(home.id, NATIVE, home.name, home.symbol, home.decimals, msg.value, msg.sender, home.id, to);
    }

    function sendToken(uint to, address token, uint amount) external {
        if (isProxy(token)) {
            ERC20Proxy proxy = ERC20Proxy(token);
            proxy.burn(msg.sender, amount);
            send(proxy.chain(), proxy.token(), proxy.name(), proxy.symbol(), proxy.decimals(), amount, msg.sender, home.id, to);
        }
        else {
            ERC20 erc20 = ERC20(token);
            disburseToken(token, msg.sender, address(this), amount);
            balances[token] += amount;
            send(home.id, token, erc20.name(), erc20.symbol(), erc20.decimals(), amount, msg.sender, home.id, to);
        }
    }

    function send(uint origin, address token, string memory name, string memory symbol, uint decimals, uint amount, address owner, uint from, uint to) private {
        sendCounter++;
        bytes32 hash = keccak256(abi.encode(origin, token, decimals, amount, owner, from, to, sendCounter));
        outTransfers[hash] = true;
        emit Transfer(origin, token, name, symbol, decimals, amount, owner, from, to, sendCounter);
    }

    //fixme: tokenArrival => in
    function tokenArrival(uint[2] calldata signature, uint[4] calldata signerPublicKey, bytes calldata payload, string calldata name, string calldata symbol) external {
        bytes32 hash = keccak256(payload);
        require(inTransfers[hash] == false, 'Token Arrival already processed');
        for (uint i = 0; i < 4; i++) require(publicKey[i] == signerPublicKey[i], 'Invalid Public Key'); // validate signerKey
        BnsVerifier.verify(signature, signerPublicKey, hash);
        (uint from, address token, uint8 decimals, uint amount, address owner, , ,) = abi.decode(payload, (uint, address, uint8, uint, address, uint, uint, uint));
        mintOrDisburse(from, token, decimals, amount, owner, name, symbol);
        inTransfers[hash] = true;
    }

    function mintOrDisburse(uint origin, address token, uint8 decimals, uint amount, address owner, string calldata name, string calldata symbol) private {
        if (home.id == origin) {  // if token is coming back home (to originating chain) ...
            // ... disburse amount back to the owner
            balances[token] -= amount;
            disburse(token, address(this), owner, amount);
        } else {
            // ... it's a foreign country, mint proxy for the owner
            if (proxyMapping[origin][token] == address(0)) { // if proxy does not exist
                proxyMapping[origin][token] = address(new ERC20Proxy(name, symbol, decimals, token, origin));
                isProxyMapping[proxyMapping[origin][token]] = true;
            }
            ERC20Proxy(proxyMapping[origin][token]).mint(owner, amount);
        }
    }

    function disburse(address token, address from, address to, uint amount) private {
        token == NATIVE ? disburseNative(to, amount) : disburseToken(token, from, to, amount);
    }

    function disburseNative(address to, uint amount) private {
        payable(to).transfer(amount);
    }

    function disburseToken(address token, address from, address to, uint amount) private {
        ERC20 erc20 = ERC20(token);
        uint balance = erc20.balanceOf(to);
        from == address(this) ? erc20.transfer(to, amount) : erc20.transferFrom(from, to, amount);
        require(erc20.balanceOf(to) == (balance + amount), 'Invalid transfer');
    }
}
