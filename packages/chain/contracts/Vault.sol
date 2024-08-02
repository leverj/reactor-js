// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Proxy} from "./token/ERC20/ERC20Proxy.sol";
import {BlsVerifier} from "./BlsVerifier.sol";

contract Vault {

    address constant public NATIVE = address(0);

    /**
    * Token Sent out to another chain. The payload has structure
    * <Origin: {chain, token, decimals}>, token-amount, owner-address, fromChain, toChain, send-counter
    * fromChain may seem redundant at first glance. however, consider the case where L[1] sends Token to L[n] and L[m].
    * and both L[n] and L[m] send it back to L[1], and both L[n] and L[m] could have the same counter, so another key in the form of fromChain is needed
    */
    event TokenSent(uint indexed originatingChain, address indexed originatingToken, string originatingName, string originatingSymbol, uint decimals, uint amount, address indexed owner, uint fromChain, uint toChain, uint sendCounter);

    uint public homeChain;
    uint[4] public publicKey;
    mapping(address => uint) public pool;
    mapping(bytes32 => bool) public tokenSent;
    mapping(bytes32 => bool) public tokenArrived;
    mapping(uint => mapping(address => address)) public proxyMapping;
    mapping(address => bool) public isProxyMapping;
    uint public sendCounter = 0;
    BlsVerifier private verifier;

    constructor(uint chain_, uint[4] memory publicKey_) {
        homeChain = chain_;
        publicKey = publicKey_;
        verifier = new BlsVerifier();
    }

    function sendNative(uint toChain) external payable {
        pool[NATIVE] += msg.value;
        sendCounter++;
        bytes32 hash = payloadHash(homeChain, NATIVE, 18, msg.value, msg.sender, homeChain, toChain, sendCounter);
        tokenSent[hash] = true;
        //fixme: native name/symbol for each chain will be different, e.g. BSC, Fantom/FTM. Along with constructor like we set chain ?
        emit TokenSent(homeChain, NATIVE, 'ETHER', 'ETH', 18, msg.value, msg.sender, homeChain, toChain, sendCounter);
    }

    function sendToken(uint toChain, address token, uint amount) external {
        uint originatingChain;
        address originatingToken;
        uint decimals;
        if (isProxyMapping[token]) {
            ERC20Proxy proxy = ERC20Proxy(token);
            originatingChain = proxy.chain();
            originatingToken = proxy.token();
            decimals = proxy.decimals();
            proxy.burn(msg.sender, amount);
        }
        else {
            originatingChain = homeChain;
            originatingToken = token;
            decimals = ERC20(token).decimals();
            safeTransfer(token, msg.sender, address(this), amount);
            pool[token] += amount;
        }
        sendCounter++;
        bytes32 hash = payloadHash(originatingChain, originatingToken, decimals, amount, msg.sender, homeChain, toChain, sendCounter);
        tokenSent[hash] = true;
        emitSendEvent(token, originatingChain, originatingToken, decimals, amount, msg.sender, toChain, sendCounter);
    }

    function tokenArrival(uint[2] calldata signature, uint[4] calldata signerKey, bytes calldata payload, string calldata name, string calldata symbol) public {
        bytes32 tokenSendHash = keccak256(payload);
        require(tokenArrived[tokenSendHash] == false, 'Token Arrival already processed');
        validatePayloadAndSignature(signature, signerKey, tokenSendHash);
        mintOrDisburse(payload, name, symbol);
        tokenArrived[tokenSendHash] = true;
    }

    function payloadHash(uint originatingChain, address token, uint decimals, uint amount, address owner, uint fromChain, uint toChain, uint counter) public pure returns (bytes32){
        return keccak256(abi.encode(originatingChain, token, decimals, amount, owner, fromChain, toChain, counter));
    }

    function validatePayloadAndSignature(uint[2] memory signature, uint[4] memory signerKey, bytes32 hash) private view {
        validateSignerKey(signerKey);
        verifier.validate(signature, signerKey, hash);
    }

    function validateSignerKey(uint[4] memory signerKey) private view {
        for (uint i = 0; i < 4; i++) require(publicKey[i] == signerKey[i], 'Invalid Public Key');
    }

    function mintOrDisburse(bytes calldata payload, string calldata name, string calldata symbol) private {
        //fixme: what's the point of the extra 3 fields in payload?
        (uint chain, address token, uint decimals, uint amount, address owner, , ,) = abi.decode(payload, (uint, address, uint, uint, address, uint, uint, uint));
        if (homeChain == chain) {  // if token is coming back home (to originating chain) ...
            // ... disburse amount back to the owner
            pool[token] -= amount; // fixme: require enough amount?
            safeTransfer(token, address(this), owner, amount);
        } else {
            // ... it's a foreign country, mint proxy for the owner
            if (proxyMapping[chain][token] == address(0)) { // if proxy does not exist
                proxyMapping[chain][token] = address(new ERC20Proxy(name, symbol, uint8(decimals), token, chain));
                isProxyMapping[proxyMapping[chain][token]] = true;
            }
            ERC20Proxy(proxyMapping[chain][token]).mint(owner, amount);
        }
    }

    function safeTransfer(address token, address from, address to, uint amount) private {
        if (token == address(0)) payable(to).transfer(amount);
        else {
            ERC20 erc20 = ERC20(token);
            uint balance = erc20.balanceOf(to);
            from == address(this) ? erc20.transfer(to, amount) : erc20.transferFrom(from, to, amount);
            require(erc20.balanceOf(to) == (balance + amount), 'Invalid transfer');
        }
    }

    function emitSendEvent(address token, uint originatingChain, address originatingToken, uint decimals, uint amount, address owner, uint toChain, uint counter) private {
        string memory name = isProxyMapping[token] ? ERC20Proxy(token).originatingName() : ERC20(token).name();
        string memory symbol = isProxyMapping[token] ? ERC20Proxy(token).originatingSymbol() : ERC20(token).symbol();
        //fixme: maybe ad an indication whether it is a proxy or not?
        emit TokenSent(originatingChain, originatingToken, name, symbol, decimals, amount, owner, homeChain, toChain, counter);
    }
}
