// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "hardhat/console.sol";
import './BlsVerify.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './tokens/ERC20Token.sol';

contract Vault {

    address constant public ETH = address(0);
    string constant cipher_suite_domain = 'BN256-HASHTOPOINT';

    /**
    * Token Sent out to another chain. The payload has structure
    * <OriginatingToken>, TokenAmount, VaultUser Address, fromChain, toChain, sendCounter
    * <OriginatingToken> is a tuple represented by originatingChain, originatingTokenAddress, decimals
    * The payload status will be Sent, InFlight, Received
    */
    event TokenSent(uint indexed originatingChain, address indexed originatingToken, uint decimals, uint amount, address indexed vaultUser, uint fromChain, uint toChain, uint sendCounter);
    uint public chainId;
    uint[4] public publicKey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public tokenSent;
    mapping(bytes32 => bool) public arrivalProcessed;
    mapping(uint => mapping(address => address)) public proxyTokenMap;
    mapping(address => bool) public isProxyToken;
    uint public sendCounter = 0;
    BlsVerify verifier;

    constructor(uint chainId_, uint[4] memory publicKey_) {
        chainId = chainId_;
        publicKey = publicKey_;
        verifier = new BlsVerify();
    }
    function sendEth(uint toChainId) external payable {
        pool[ETH] += msg.value;
        uint counter = sendCounter++;
        bytes32 hash = payloadHash(chainId, ETH, 18, msg.value, msg.sender, chainId, toChainId, counter);
        tokenSent[hash] = true;
        emit TokenSent(chainId, ETH, 18, msg.value, msg.sender, chainId, toChainId, counter);
    }
    function sendToken(uint toChainId, address tokenAddress, uint tokenAmount) external {
        uint originatingChain;
        address originatingToken;
        uint decimals; 
        if (isProxyToken[tokenAddress]){
            ERC20Token proxy = ERC20Token(tokenAddress);
            originatingChain = proxy.originatingChain();
            originatingToken = proxy.originatingToken();
            decimals = proxy.decimals();
            proxy.burn(msg.sender, tokenAmount);
        }
        else {
            originatingChain = chainId;
            originatingToken = tokenAddress;
            ERC20 token = ERC20(tokenAddress);
            require(token.balanceOf(msg.sender) >= tokenAmount, 'Insufficient balance');
            decimals = token.decimals();
            token.transferFrom(msg.sender, address(this), tokenAmount);
            pool[tokenAddress] += tokenAmount;
        }
        uint counter = sendCounter++;
        bytes32 hash = payloadHash(originatingChain, originatingToken, decimals, tokenAmount, msg.sender, chainId, toChainId, counter);
        tokenSent[hash] = true;
        emit TokenSent(originatingChain, originatingToken, decimals, tokenAmount, msg.sender, chainId, toChainId, counter);
    }
    function payloadHash(uint originatingChain, address originatingToken, uint decimals, uint amount, address vaultUser, uint fromChain, uint toChain, uint counter) public pure returns(bytes32){
        return keccak256(abi.encodePacked(originatingChain, originatingToken, decimals, amount, vaultUser, fromChain, toChain, counter));
    }
    function _getPayloadHash(bytes memory tokenSendPayload) internal pure returns (bytes32){
        (uint originatingChain, address originatingToken, uint decimals, uint amount, address vaultUser, uint fromChain, uint toChain, uint counter) = abi.decode(tokenSendPayload, (uint,address,uint,uint,address,uint,uint,uint));
        return payloadHash(originatingChain, originatingToken, decimals, amount, vaultUser, fromChain, toChain, counter);
    }
    function _validatePayloadAndSignature(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata tokenSendPayload) internal view returns (bytes32){
        bytes32 tokenSendHash = _getPayloadHash(tokenSendPayload);
        require(arrivalProcessed[tokenSendHash] == false, 'Token Arrival already processed');
        uint256[2] memory messageToPoint = verifier.hashToPoint(bytes(cipher_suite_domain), bytes(verifier.bytes32ToHexString(tokenSendHash)));
        bool validSignature = verifier.verifySignature(signature, signerKey, messageToPoint);
        require(validSignature == true, 'Invalid Signature');
        return tokenSendHash;
    }
    //fixme remove this and use erc20 call in TC
    function balanceOf(address proxyToken, address vaultUser) external view returns (uint) {
        return ERC20Token(proxyToken).balanceOf(vaultUser);
    }
    function _createAndMintProxy(bytes memory tokenSendPayload) internal{
        ERC20Token proxyToken;
        (uint originatingChain, address originatingToken, uint decimals, uint amount, address vaultUser, , , ) = abi.decode(tokenSendPayload, (uint,address,uint,uint,address,uint,uint,uint));
        if (proxyTokenMap[originatingChain][originatingToken] == address(0)){ // if proxyToken does not exist
            proxyToken = new ERC20Token('PROXY', 'PROXY', uint8(decimals), originatingToken, originatingChain);
            proxyTokenMap[originatingChain][originatingToken] = address(proxyToken);
            isProxyToken[address(proxyToken)] = true;
        }
        proxyToken = ERC20Token(proxyTokenMap[originatingChain][originatingToken]);
        proxyToken.mint(vaultUser, amount);
    }
    function _mintOrDisburse(bytes calldata tokenSendPayload) internal{
        (uint originatingChain, address originatingToken, , uint amount, address vaultUser, , , ) = abi.decode(tokenSendPayload, (uint,address,uint,uint,address,uint,uint,uint));
        //if token is coming back home, then disburse the originating back to the user, else it's a foreign country, mint proxy for the user
        if (chainId == originatingChain){
            pool[originatingToken] -= amount;
            if (originatingToken == address(0)){ //ETH transfer
                payable(vaultUser).transfer(amount);
            }
            else {
                ERC20(originatingToken).approve(address(this), amount); 
                ERC20(originatingToken).transferFrom(address(this), vaultUser, amount);
            }
        }
        else {
            _createAndMintProxy(tokenSendPayload);
        }
    }
    /**Since this is not payable, this function will receive both ETH and Token arrivals. In case of send, ETH is payable therefore we have 2 versions sendETH and sendToken
    *The payload is the aggregate signed version of Token Delivery that was sent from a source chain to this chain.
    */
    function tokenArrival(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata tokenSendPayload) public {
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        bytes32 tokenSendHash = _validatePayloadAndSignature(signature, signerKey, tokenSendPayload);
        _mintOrDisburse(tokenSendPayload);
        arrivalProcessed[tokenSendHash] = true;  
    }
}