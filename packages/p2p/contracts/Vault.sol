// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "hardhat/console.sol";
import './BlsVerify.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './tokens/ERC20Token.sol';

contract Vault {

    address constant public ETH = address(0);
    string constant cipher_suite_domain = 'BN256-HASHTOPOINT';

    event Deposited(address indexed vaultUser, uint originatingChain, address indexed originatingToken, uint decimals, uint toChainId, uint amount, uint depositCounter);
    event Withdrawn(address indexed vaultUser, uint originatingChain, address indexed originatingToken, uint decimals, uint toChainId, uint amount, uint withdrawCounter);
    event Minted(uint amount);
    event Disbursed(uint amount);

    uint public chainId;
    uint[4] public publicKey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public deposits;
    mapping(bytes32 => bool) public withdrawals;
    mapping(bytes32 => bool) public minted;
    mapping(bytes32 => bool) public disbursed;
    mapping(uint => mapping(address => address)) public proxyTokenMap;
    uint public depositCounter = 0;
    uint public withdrawCounter = 0;

    BlsVerify verifier;

    constructor(uint chainId_, uint[4] memory publicKey_) {
        chainId = chainId_;
        publicKey = publicKey_;
        verifier = new BlsVerify();
    }
    function depositEth(uint toChainId) external payable {
        pool[ETH] += msg.value;
        uint counter = depositCounter++;
        bytes32 hash = hashOf(msg.sender, chainId, ETH, 18, toChainId, msg.value, counter);
        deposits[hash] = true;
        emit Deposited(msg.sender, chainId, ETH, 18, toChainId, msg.value, counter);
    }
    function withdrawEth(uint toChainId, uint amount) external payable {
        ERC20Token proxyForEth = ERC20Token(proxyTokenMap[toChainId][address(0)]); 
        require(proxyForEth.balanceOf(msg.sender) >= amount, 'Insufficient ETH proxy token balance');
        uint counter = withdrawCounter++;
        proxyForEth.burn(msg.sender, amount);
        //decimals may seem not-needed here, but in some use cases we may be minting also on target chain, so let it be there for now
        bytes32 hash = hashOf(msg.sender, proxyForEth.originatingChain(), ETH, 18, toChainId, amount, counter);
        withdrawals[hash] = true;
        //In Withdrawn we can emit the Original Token being withdrawn, as opposed to Proxy. Source does not know about Proxxy
        emit Withdrawn(msg.sender, proxyForEth.originatingChain(), ETH, 18, toChainId, amount, counter);
    }
    function depositToken(uint toChainId, address tokenAddress, uint tokenAmount) external {
        ERC20 token = ERC20(tokenAddress);
        require(token.balanceOf(msg.sender) >= tokenAmount, 'Insufficient balance');
        token.transferFrom(msg.sender, address(this), tokenAmount);
        pool[tokenAddress] += tokenAmount;
        uint counter = depositCounter++;
        bytes32 hash = hashOf(msg.sender, chainId, tokenAddress, token.decimals(), toChainId, tokenAmount, counter);
        deposits[hash] = true;
        emit Deposited(msg.sender, chainId, tokenAddress, token.decimals(), toChainId, tokenAmount, counter);
    }
    function withdrawToken(uint toChainId, address tokenAddress, uint amount) external payable {
        ERC20Token proxyForToken = ERC20Token(proxyTokenMap[toChainId][tokenAddress]); 
        require(proxyForToken.balanceOf(msg.sender) >= amount, 'Insufficient proxy token balance');
        uint counter = withdrawCounter++;
        proxyForToken.burn(msg.sender, amount);
        bytes32 hash = hashOf(msg.sender, proxyForToken.originatingChain(), proxyForToken.originatingToken(), proxyForToken.decimals(), toChainId, amount, counter);
        withdrawals[hash] = true;
        //In Withdrawn we can emit the Original Token being withdrawn, as opposed to Proxy. Source does not know about Proxy
        emit Withdrawn(msg.sender, proxyForToken.originatingChain(), proxyForToken.originatingToken(), proxyForToken.decimals(), toChainId, amount, counter);
    }
    function hashOf(address vaultUser, uint originatingChain, address originatingToken, uint decimals, uint toChainId, uint amount, uint counter) public pure returns (bytes32){
        return keccak256(abi.encodePacked(vaultUser, originatingChain, originatingToken, decimals, toChainId, amount, counter));
    }
    function balanceOf(address proxyToken, address vaultUser) external view returns (uint) {
        return ERC20Token(proxyToken).balanceOf(vaultUser);
    }
    //vaultUser, originatingChain, originatingToken, decimals, toChainId, amount, depositCounter, name, symbol
    function _getHash(bytes memory payload) internal returns (bytes32){
        (address vaultUser, uint originatingChain, address originatingToken, uint decimals, uint toChainId, uint amount, uint counter) = abi.decode(payload, (address,uint,address,uint,uint,uint,uint));
        return hashOf(vaultUser, originatingChain, originatingToken, decimals, toChainId, amount, counter);
    }
    function _validateHashAndSignature(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata payload, bool depositOrWithdraw) internal returns (bytes32){
        bytes32 payloadHash = _getHash(payload);
        if (depositOrWithdraw == true) require(minted[payloadHash] == false, 'Already minted for deposit hash');
        else require(disbursed[payloadHash] == false, 'Already disbursed for withdrawal hash');
        uint256[2] memory messageToPoint = verifier.hashToPoint(bytes(cipher_suite_domain), bytes(verifier.bytes32ToHexString(payloadHash)));
        bool validSignature = verifier.verifySignature(signature, signerKey, messageToPoint);
        require(validSignature == true, 'Invalid Signature');
        return payloadHash;
    }
    function _createProxyTokenAndMint(bytes calldata depositPayload) internal {
        ERC20Token proxyToken;
        (address vaultUser, uint originatingChain, address originatingToken, uint decimals, ,uint amount, , string memory name, string memory symbol) = abi.decode(depositPayload, (address,uint,address,uint,uint,uint,uint,string,string));
        if (proxyTokenMap[originatingChain][originatingToken] == address(0)){ // if proxyToken does not exist
            proxyToken = new ERC20Token(name, symbol, uint8(decimals), originatingToken, originatingChain);
            proxyTokenMap[originatingChain][originatingToken] = address(proxyToken);
        }
        proxyToken = ERC20Token(proxyTokenMap[originatingChain][originatingToken]);
        proxyToken.mint(vaultUser, amount);
    }
    function _processWithdraw(bytes calldata withdrawPayload) internal {
        (address vaultUser, uint originatingChain, address originatingToken, uint decimals, uint toChainId, uint amount, uint counter) = abi.decode(withdrawPayload, (address,uint,address,uint,uint,uint,uint));
        if (originatingChain == chainId){
            _transferBack(withdrawPayload);
        }
        else {
            ERC20Token proxyToken;
            if (proxyTokenMap[originatingChain][originatingToken] == address(0)){ // if proxyToken does not exist
                //fixme -- how critical is name and symbol ? can it be a constant like PROXY ? otherwise, how to derive from originating token ?
                proxyToken = new ERC20Token('PROXY', 'PROXY', uint8(decimals), originatingToken, originatingChain);
                proxyTokenMap[originatingChain][originatingToken] = address(proxyToken);
            }
            proxyToken = ERC20Token(proxyTokenMap[originatingChain][originatingToken]);
            proxyToken.mint(vaultUser, amount);
        }
    }
    function _transferBack(bytes calldata withdrawPayload) internal {
        (address vaultUser, uint originatingChain, address originatingToken, uint decimals, uint toChainId, uint amount, uint counter) = abi.decode(withdrawPayload, (address,uint,address,uint,uint,uint,uint));
        pool[originatingToken] -= amount;
        if (originatingToken == address(0)){ //ETH transfer
            payable(vaultUser).transfer(amount);
        }
        else {
            //fixme WHERE is the correct place for contract to approve the token ? During first time token creation ?
            //what is better - one time blanket approve, or whatever is needed approve that amount
            ERC20(originatingToken).approve(address(this), amount); 
            ERC20(originatingToken).transferFrom(address(this), vaultUser, amount);
        }
        
    }
    function mint(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata depositPayload) public {
        require(publicKey.length == signerKey.length, 'Invalid Public Key length');
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        bytes32 payloadHash = _validateHashAndSignature(signature, signerKey, depositPayload, true);
        _createProxyTokenAndMint(depositPayload);
        minted[payloadHash] = true;
    }
    function disburse(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata withdrawPayload) public {
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        bytes32 withdrawalHash = _validateHashAndSignature(signature, signerKey, withdrawPayload, false);
        _processWithdraw(withdrawPayload);
        disbursed[withdrawalHash] = true;
    }
}