// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import './BlsVerify.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./token/ERC20/ERC20Proxy.sol";

contract Vault {

    address constant public NATIVE = address(0);

    /**
    * Token Sent out to another chain. The payload has structure
    * <Origin>, TokenAmount, VaultUser Address, fromChain, toChain, sendCounter
    * <Origin> is a tuple represented by chainId, token, decimals
    * fromChain may seem redundant at first glance. however, consider the case where L1 sends Token to L5 and L6.
    * and both L5 and L6 send it back to L1, and both L5 and L6 could have the same counter, so another key in the form of fromChain is needed
    */
    event TokenSent(uint indexed originatingChain, address indexed originatingToken, string originatingName, string originatingSymbol, uint decimals, uint amount, address indexed vaultUser, uint fromChain, uint toChain, uint sendCounter);

    uint public chainId;
    uint[4] public publicKey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public tokenSent;
    mapping(bytes32 => bool) public tokenArrived;
    mapping(uint => mapping(address => address)) public proxyMapping;
    mapping(address => bool) public isProxyMapping;
    uint public sendCounter = 0;
    BlsVerify public verifier;

    constructor(uint chainId_, uint[4] memory publicKey_) {
        chainId = chainId_;
        publicKey = publicKey_;
        verifier = new BlsVerify();
    }

    function sendNative(uint toChainId) external payable {
        pool[NATIVE] += msg.value;
        uint counter = sendCounter++;
        bytes32 hash = payloadHash(chainId, NATIVE, 18, msg.value, msg.sender, chainId, toChainId, counter);
        tokenSent[hash] = true;
        //fixme native name/symbol for each chain will be different, e.g. BSC, Fantom/FTM. Along with constructor like we set chainId ?
        emit TokenSent(chainId, NATIVE, 'ETHER', 'ETH', 18, msg.value, msg.sender, chainId, toChainId, counter);
    }

    function sendToken(uint toChainId, address token, uint amount) external {
        uint originatingChain;
        address originatingToken;
        uint decimals;
        if (isProxyMapping[token]) {
            ERC20Proxy proxy = ERC20Proxy(token);
            originatingChain = proxy.chainId();
            originatingToken = proxy.token();
            decimals = proxy.decimals();
            proxy.burn(msg.sender, amount);
        }
        else {
            originatingChain = chainId;
            originatingToken = token;
            decimals = ERC20(token).decimals();
            safeTransfer(token, msg.sender, address(this), amount);
            pool[token] += amount;
        }
        uint counter = sendCounter++;
        bytes32 hash = payloadHash(originatingChain, originatingToken, decimals, amount, msg.sender, chainId, toChainId, counter);
        tokenSent[hash] = true;
        emitSendEvent(token, originatingChain, originatingToken, decimals, amount, msg.sender, chainId, toChainId, counter);
    }

    function tokenArrival(uint[2] calldata signature, uint[4] calldata signerKey, bytes calldata tokenSendPayload, string calldata name, string calldata symbol) public {
        bytes32 tokenSendHash = keccak256(tokenSendPayload);
        require(tokenArrived[tokenSendHash] == false, 'Token Arrival already processed');
        validatePayloadAndSignature(signature, signerKey, tokenSendHash);
        mintOrDisburse(tokenSendPayload, name, symbol);
        tokenArrived[tokenSendHash] = true;
    }

    function payloadHash(uint originatingChain, address originatingToken, uint decimals, uint amount, address vaultUser, uint fromChain, uint toChain, uint counter) public pure returns (bytes32){
        return keccak256(abi.encode(originatingChain, originatingToken, decimals, amount, vaultUser, fromChain, toChain, counter));
    }

    function validatePayloadAndSignature(uint[2] memory signature, uint[4] memory signerKey, bytes32 tokenSendHash) private view {
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        uint[2] memory messageToPoint = verifier.hashToPoint(bytes(verifier.bytes32ToHexString(tokenSendHash)));
        bool validSignature = verifier.verifySignature(signature, signerKey, messageToPoint);
        require(validSignature == true, 'Invalid Signature');
    }

    function createAndMintProxy(bytes memory tokenSendPayload, string calldata name, string calldata symbol) private {
        ERC20Proxy proxy;
        (uint chain, address token, uint decimals, uint amount, address owner, , ,) = abi.decode(tokenSendPayload, (uint, address, uint, uint, address, uint, uint, uint));
        if (proxyMapping[chain][token] == address(0)) { // if proxy does not exist
            proxy = new ERC20Proxy(name, symbol, uint8(decimals), token, chain);
            proxyMapping[chain][token] = address(proxy);
            isProxyMapping[address(proxy)] = true;
        }
        proxy = ERC20Proxy(proxyMapping[chain][token]);
        proxy.mint(owner, amount);
    }

    function mintOrDisburse(bytes calldata tokenSendPayload, string calldata name, string calldata symbol) private {
        (uint originatingChain, address originatingToken, , uint amount, address owner, , ,) = abi.decode(tokenSendPayload, (uint, address, uint, uint, address, uint, uint, uint));
        if (chainId == originatingChain) {  // if token is coming back home (to originating chain) ...
            // ... disburse amount back to the owner
            pool[originatingToken] -= amount; // fixme: require enough amount?
            safeTransfer(originatingToken, address(this), owner, amount);
        } else {
            // ... it's a foreign country, mint proxy for the owner
            createAndMintProxy(tokenSendPayload, name, symbol);
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

    function emitSendEvent(address token, uint originatingChain, address originatingToken, uint decimals, uint amount, address owner, uint fromChain, uint toChain, uint counter) private {
        string memory name = isProxyMapping[token] ? ERC20Proxy(token).originatingName() : ERC20(token).name();
        string memory symbol = isProxyMapping[token] ? ERC20Proxy(token).originatingSymbol() : ERC20(token).symbol();
        emit TokenSent(originatingChain, originatingToken, name, symbol, decimals, amount, owner, fromChain, toChain, counter);
    }
}
