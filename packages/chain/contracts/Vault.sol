// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import {ERC20Proxy} from "./token/ERC20/ERC20Proxy.sol";
//import {ITokenProxy} from "./token/ITokenProxy.sol";
import {BlsVerifier} from "./BlsVerifier.sol";

contract Vault {

    struct Chain {
        uint id;
        string name;
        string symbol;
        uint decimals;
    }

    address constant public NATIVE = address(0);

    /**
    * Token Sent out to another chain.
    * The payload structure: <Origin: {chain, token, decimals}>, token-amount, owner-address, fromChainId, toChainId, send-counter
    * fromChainId may seem redundant at first glance. however, consider the case where L[1] sends Token to L[n] and L[m],
    * and both L[n] and L[m] send it back to L[1], and both L[n] and L[m] could have the same counter, so another key in the form of fromChainId is needed
    */
    event TokenSent(uint indexed originatingChainId, address indexed token, string name, string symbol, uint decimals, uint amount, address indexed owner, uint fromChainId, uint toChainId, uint sendCounter);

    Chain public homeChain;
    uint[4] public publicKey;
    uint public sendCounter = 0;
    mapping(address => uint) public balances;
    mapping(bytes32 => bool) public tokenSent;
    mapping(bytes32 => bool) public tokenArrived;
    mapping(uint => mapping(address => address)) public proxyMapping;
    mapping(address => bool) public isProxyMapping;

    //fixme: add chain info to constructor
    constructor(uint chainId, string memory chainName, string memory nativeSymbol, uint nativeDecimals, uint[4] memory publicKey_) {
        homeChain = Chain(chainId, chainName, nativeSymbol, nativeDecimals);
        publicKey = publicKey_;
    }

    function isProxy(address token) public view returns (bool) {
        return isProxyMapping[token];
//        return IERC165(token).supportsInterface(type(ITokenProxy).interfaceId); //fixme
    }

    function sendNative(uint toChainId) external payable {
        balances[NATIVE] += msg.value;
        send(homeChain.id, NATIVE, homeChain.name, homeChain.symbol, homeChain.decimals, msg.value, msg.sender, homeChain.id, toChainId);
    }

    function sendToken(uint toChainId, address token, uint amount) external {
        if (isProxy(token)) {
            ERC20Proxy proxy = ERC20Proxy(token);
            proxy.burn(msg.sender, amount);
            send(proxy.chain(), proxy.token(), proxy.name(), proxy.symbol(), proxy.decimals(), amount, msg.sender, homeChain.id, toChainId);
        }
        else {
            ERC20 erc20 = ERC20(token);
            safeTransfer(token, msg.sender, address(this), amount);
            balances[token] += amount;
            send(homeChain.id, token, erc20.name(), erc20.symbol(), erc20.decimals(), amount, msg.sender, homeChain.id, toChainId);
        }
    }

    function send(uint originatingChainId, address token, string memory name, string memory symbol, uint decimals, uint amount, address owner, uint fromChainId, uint toChainId) private {
        sendCounter++;
        bytes32 hash = keccak256(abi.encode(originatingChainId, token, decimals, amount, owner, fromChainId, toChainId, sendCounter));
        tokenSent[hash] = true;
        emit TokenSent(originatingChainId, token, name, symbol, decimals, amount, owner, fromChainId, toChainId, sendCounter);
    }

    function tokenArrival(uint[2] calldata signature, uint[4] calldata signerKey, bytes calldata payload, string calldata name, string calldata symbol) external {
        bytes32 hash = keccak256(payload);
        require(tokenArrived[hash] == false, 'Token Arrival already processed');
        for (uint i = 0; i < 4; i++) require(publicKey[i] == signerKey[i], 'Invalid Public Key'); // validate signerKey
        BlsVerifier.validate(signature, signerKey, hash);
        (uint fromChainId, address token, uint8 decimals, uint amount, address owner, , ,) = abi.decode(payload, (uint, address, uint8, uint, address, uint, uint, uint));
        mintOrDisburse(fromChainId, token, decimals, amount, owner, name, symbol);
        tokenArrived[hash] = true;
    }

    function mintOrDisburse(uint originatingChainId, address token, uint8 decimals, uint amount, address owner, string calldata name, string calldata symbol) private {
        if (homeChain.id == originatingChainId) {  // if token is coming back home (to originating chain) ...
            // ... disburse amount back to the owner
            balances[token] -= amount;
            safeTransfer(token, address(this), owner, amount);
        } else {
            // ... it's a foreign country, mint proxy for the owner
            if (proxyMapping[originatingChainId][token] == address(0)) { // if proxy does not exist
                proxyMapping[originatingChainId][token] = address(new ERC20Proxy(name, symbol, decimals, token, originatingChainId));
                isProxyMapping[proxyMapping[originatingChainId][token]] = true;
            }
            ERC20Proxy(proxyMapping[originatingChainId][token]).mint(owner, amount);
        }
    }

    function safeTransfer(address token, address from, address to, uint amount) private {
        if (token == NATIVE) payable(to).transfer(amount);
        else {
            ERC20 erc20 = ERC20(token);
            uint balance = erc20.balanceOf(to);
            from == address(this) ? erc20.transfer(to, amount) : erc20.transferFrom(from, to, amount);
            require(erc20.balanceOf(to) == (balance + amount), 'Invalid transfer');
        }
    }
}
