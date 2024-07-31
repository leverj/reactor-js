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
    * <OriginatingToken>, TokenAmount, VaultUser Address, fromChain, toChain, sendCounter
    * <OriginatingToken> is a tuple represented by originatingChain, originatingTokenAddress, decimals
    * fromChain may seem redundant at first glance. however, consider the case where L1 sends Token to L5 and L6.
    * and both L5 and L6 send it back to L1, and both L5 and L6 could have the same counter, so another key in the form of fromChain is needed
    */
    event TokenSent(uint indexed originatingChain, address indexed originatingToken, string originatingName, string originatingSymbol, uint decimals, uint amount, address indexed vaultUser, uint fromChain, uint toChain, uint sendCounter);

    uint public chainId;
    uint[4] public publicKey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public tokenSent;
    mapping(bytes32 => bool) public tokenArrived;
    mapping(uint => mapping(address => address)) public proxyTokenMap;
    mapping(address => bool) public isProxyToken;
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

    function sendToken(uint toChainId, address tokenAddress, uint tokenAmount) external {
        uint originatingChain;
        address originatingToken;
        uint decimals;
        if (isProxyToken[tokenAddress]) {
            ERC20Proxy proxy = ERC20Proxy(tokenAddress);
            originatingChain = proxy.originatingChain();
            originatingToken = proxy.originatingToken();
            decimals = proxy.decimals();
            proxy.burn(msg.sender, tokenAmount);
        }
        else {
            originatingChain = chainId;
            originatingToken = tokenAddress;
            ERC20 token = ERC20(tokenAddress);
            decimals = token.decimals();
            safeTransfer(tokenAddress, msg.sender, address(this), tokenAmount);
            pool[tokenAddress] += tokenAmount;
        }
        uint counter = sendCounter++;
        bytes32 hash = payloadHash(originatingChain, originatingToken, decimals, tokenAmount, msg.sender, chainId, toChainId, counter);
        tokenSent[hash] = true;
        emitSendEvent(tokenAddress, originatingChain, originatingToken, decimals, tokenAmount, msg.sender, chainId, toChainId, counter);
    }

    function tokenArrival(uint[2] calldata signature, uint[4] calldata signerKey, bytes calldata tokenSendPayload, string calldata name, string calldata symbol) public {
        bytes32 tokenSendHash = keccak256(tokenSendPayload);
        require(tokenArrived[tokenSendHash] == false, 'Token Arrival already processed');
        _validatePayloadAndSignature(signature, signerKey, tokenSendHash);
        _mintOrDisburse(tokenSendPayload, name, symbol);
        tokenArrived[tokenSendHash] = true;
    }

    function payloadHash(uint originatingChain, address originatingToken, uint decimals, uint amount, address vaultUser, uint fromChain, uint toChain, uint counter) public pure returns (bytes32){
        return keccak256(abi.encode(originatingChain, originatingToken, decimals, amount, vaultUser, fromChain, toChain, counter));
    }

    function _validatePayloadAndSignature(uint[2] memory signature, uint[4] memory signerKey, bytes32 tokenSendHash) internal view {
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        uint[2] memory messageToPoint = verifier.hashToPoint(bytes(verifier.bytes32ToHexString(tokenSendHash)));
        bool validSignature = verifier.verifySignature(signature, signerKey, messageToPoint);
        require(validSignature == true, 'Invalid Signature');
    }

    function _createAndMintProxy(bytes memory tokenSendPayload, string calldata name, string calldata symbol) internal {
        ERC20Proxy proxyToken;
        (uint originatingChain, address originatingToken, uint decimals, uint amount, address vaultUser, , ,) = abi.decode(tokenSendPayload, (uint, address, uint, uint, address, uint, uint, uint));
        if (proxyTokenMap[originatingChain][originatingToken] == address(0)) { // if proxyToken does not exist
            proxyToken = new ERC20Proxy(name, symbol, uint8(decimals), originatingToken, originatingChain);
            proxyTokenMap[originatingChain][originatingToken] = address(proxyToken);
            isProxyToken[address(proxyToken)] = true;
        }
        proxyToken = ERC20Proxy(proxyTokenMap[originatingChain][originatingToken]);
        proxyToken.mint(vaultUser, amount);
    }

    function _mintOrDisburse(bytes calldata tokenSendPayload, string calldata name, string calldata symbol) internal {
        (uint originatingChain, address originatingToken, , uint amount, address vaultUser, , ,) = abi.decode(tokenSendPayload, (uint, address, uint, uint, address, uint, uint, uint));
        if (chainId == originatingChain) {//if token is coming back home, then disburse the originating back to the user, else it's a foreign country, mint proxy for the user
            pool[originatingToken] -= amount;
            safeTransfer(originatingToken, address(this), vaultUser, amount);
        } else {
            _createAndMintProxy(tokenSendPayload, name, symbol);
        }
    }

    function safeTransfer(address token, address from, address to, uint amount) internal {
        if (token == address(0)) {
            payable(to).transfer(amount);
        } else {
            uint balance = ERC20(token).balanceOf(to);
            from == address(this) ? ERC20(token).transfer(to, amount) : ERC20(token).transferFrom(from, to, amount);
            require(ERC20(token).balanceOf(to) == (balance + amount), 'Invalid transfer');
        }
    }

    function emitSendEvent(address tokenAddress, uint originatingChain, address originatingToken, uint decimals, uint amount, address vaultUser, uint fromChain, uint toChain, uint counter) internal {
        string memory originatingName;
        string memory originatingSymbol;
        if (isProxyToken[tokenAddress]) {
            ERC20Proxy proxy = ERC20Proxy(tokenAddress);
            originatingName = proxy.originatingName();
            originatingSymbol = proxy.originatingSymbol();
        }
        else {
            ERC20 token = ERC20(tokenAddress);
            originatingName = token.name();
            originatingSymbol = token.symbol();

        }
        emit TokenSent(originatingChain, originatingToken, originatingName, originatingSymbol, decimals, amount, vaultUser, fromChain, toChain, counter);
    }
}
