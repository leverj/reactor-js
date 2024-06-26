// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";
import './BlsVerify.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './tokens/ERC20Token.sol';

contract Vault {

    address constant public ETH = address(0);
    string constant cipher_suite_domain = 'BN256-HASHTOPOINT';

    event Deposited(address indexed depositor, address indexed tokenAddress, uint decimals, uint toChainId, uint amount, uint depositCounter);
    event Withdrawn(address depositor, uint amount);
    event Minted(uint amount);
    event Disbursed(uint amount);

    uint256[4] public publicKey;
    mapping(address => uint)   public pool;
    mapping(bytes32 => bool) public deposits;
    mapping(bytes32 => bool) public mintedForDepositHash;
    //DepositingChainId => {DepositingTokenAddress => ProxyTokenAddress}
    mapping(uint => mapping(address => address)) public proxyTokenMap;
    uint public depositCounter = 0;

    BlsVerify verifier;

    constructor(uint[4] memory publicKey_) {
        publicKey = publicKey_;
        verifier = new BlsVerify();
    }
    function depositEth(uint toChainId) external payable {
        pool[ETH] += msg.value;
        uint counter = depositCounter++;
        bytes32 hash = hashOf(msg.sender, ETH, 18, toChainId, msg.value, counter);
        deposits[hash] = true;
        emit Deposited(msg.sender, ETH, 18, toChainId, msg.value, counter);
    }
    function depositToken(uint toChainId, address tokenAddress, uint tokenAmount) external {
        ERC20 token = ERC20(tokenAddress);
        require(token.balanceOf(msg.sender) >= tokenAmount, 'Insufficient balance');
        token.transferFrom(msg.sender, address(this), tokenAmount);
        pool[tokenAddress] += tokenAmount;
        uint counter = depositCounter++;
        bytes32 hash = hashOf(msg.sender, tokenAddress, token.decimals(), toChainId, tokenAmount, counter);
        deposits[hash] = true;
        emit Deposited(msg.sender, tokenAddress, token.decimals(), toChainId, tokenAmount, counter);
    }
    function hashOf(address depositor, address token, uint decimals, uint toChainId, uint amount, uint counter) public pure returns (bytes32){
        return keccak256(abi.encodePacked(depositor, token, decimals, toChainId, amount, counter));
    }
    function balanceOf(address proxyToken, address depositor) external view returns (uint) {
        return ERC20Token(proxyToken).balanceOf(depositor);
    }
    function depositToken(uint amount) external {
//        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint amount) external {
        emit Withdrawn(msg.sender, amount);
    }

    function mint(uint amount) external {
//        emit Deposited(address(0), amount);
    }

    function disburse(uint amount) external {
        emit Withdrawn(address(0), amount);
    }
    
    
    function _validateHashAndSignature(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata depositPayload) internal returns (bytes32){
        (address depositor, address token, uint decimals, ,uint toChainId, uint amount, uint counter) = abi.decode(depositPayload, (address, address, uint, uint, uint, uint, uint));
        bytes32 depositHash = hashOf(depositor, token, decimals, toChainId, amount, counter);
        require(mintedForDepositHash[depositHash] == false, 'Already minted for deposit hash');
        uint256[2] memory messageToPoint = verifier.hashToPoint(bytes(cipher_suite_domain), bytes(verifier.bytes32ToHexString(depositHash)));
        bool validSignature = verifier.verifySignature(signature, signerKey, messageToPoint);
        require(validSignature == true, 'Invalid Signature');
        return depositHash;
    }
    function _createProxyTokenAndMint(bytes calldata depositPayload) internal {
        ERC20Token proxyToken;
        (address depositor, address token, uint decimals, uint fromChainId,, uint amount, ,string memory name, string memory symbol) = abi.decode(depositPayload, (address, address, uint, uint, uint, uint, uint, string, string));
        if (proxyTokenMap[fromChainId][token] == address(0)){ // if proxyToken does not exist
            proxyToken = new ERC20Token(name, symbol, uint8(decimals), token, fromChainId);
            proxyTokenMap[fromChainId][token] = address(proxyToken);
        }
        proxyToken = ERC20Token(proxyTokenMap[fromChainId][token]);
        proxyToken.mint(depositor, amount);
    }
    function mint(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata depositPayload) public {
        require(publicKey.length == signerKey.length, 'Invalid Public Key length');
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        bytes32 depositHash = _validateHashAndSignature(signature, signerKey, depositPayload);
        _createProxyTokenAndMint(depositPayload);
        mintedForDepositHash[depositHash] = true;
    }
}