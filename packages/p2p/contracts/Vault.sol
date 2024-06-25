// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "hardhat/console.sol";
import './BlsVerify.sol';
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
    
    function bytes32ToHexString(bytes32 _bytes32) internal pure returns (string memory) {
        bytes memory hexString = new bytes(64 + 2); // 64 characters for the hash + 2 for "0x"
        bytes memory hexAlphabet = "0123456789abcdef";

        hexString[0] = '0';
        hexString[1] = 'x';

        for (uint i = 0; i < 32; i++) {
            uint8 byteValue = uint8(_bytes32[i]);
            hexString[2 * i + 2] = hexAlphabet[byteValue >> 4];
            hexString[2 * i + 3] = hexAlphabet[byteValue & 0x0f];
        }
        
        return string(hexString);
    }

    //fixme: do we need this
    function hexCharToByte(bytes1 char) internal pure returns (bytes1) {
        if (uint8(char) >= 48 && uint8(char) <= 57) {
            return bytes1(uint8(char) - 48); // '0' - '9'
        }
        if (uint8(char) >= 65 && uint8(char) <= 70) {
            return bytes1(uint8(char) - 55); // 'A' - 'F'
        }
        if (uint8(char) >= 97 && uint8(char) <= 102) {
            return bytes1(uint8(char) - 87); // 'a' - 'f'
        }
        revert("Invalid hex character");
    }
    //Solidity stack too deep is supposed to break at 16 variables, including input, output and local
    //However, following function breaks at 12 vars, assuming one arg to function, it is 13 totally. So some 'temporary' stuff is still there
    //These unit functions can be deleted, if Stack Too Deep does not need any further experimentation 
    function testEncode(bytes calldata encodedPayload) external view{
        (address depositor1, address token2, uint decimals3, uint toChainId4, uint amount5, uint counter6, 
        string memory data7, string memory data8,string memory data9, string memory data10,string memory data11, string memory data12) = abi.decode(encodedPayload, (address, address, uint, uint, uint, uint, string, string, string, string, string, string));
        console.logString('Unit testEncode address, address, uint');
        console.logAddress(depositor1);
        console.logAddress(token2);
        console.logUint(decimals3);
        console.logUint(toChainId4);
        console.logUint(amount5);
        console.logUint(counter6);
        console.logString(data7);
        console.logString(data8);
        console.logString(data9);
        console.logString(data10);
        console.logString(data11);
        console.logString(data12);
    }


    //Here the var numbers is actually touching 16. Uncomment following line to get StackTooDeep : uint out16 = counter6 * 10; 
    function testEncodeInputPlusLocal(bytes calldata encodedPayload) external view{
        (address depositor1, address token2, uint decimals3, uint toChainId4, uint amount5, uint counter6, 
        string memory data7, string memory data8,string memory data9, string memory data10,string memory data11, string memory data12) = abi.decode(encodedPayload, (address, address, uint, uint, uint, uint, string, string, string, string, string, string));
        uint out13 = decimals3 * 10;
        uint out14 = toChainId4 * 10;
        uint out15 = amount5 * 10;
        //uint out16 = counter6 * 10;
        console.logString('Unit testEncode address, address, uint');
        console.logAddress(depositor1);
        console.logAddress(token2);
        console.logUint(decimals3);
        console.logUint(toChainId4);
        console.logUint(amount5);
        console.logUint(counter6);
        console.logString(data7);
        console.logString(data8);
        console.logString(data9);
        console.logString(data10);
        console.logString(data11);
        console.logString(data12);
        console.logUint(out13);
        console.logUint(out14);
        console.logUint(out15);
    }
    //Declaring depositor variable has no issues, but doing console itself breaks. uncomment console.log(depositor) to get Stack Too Deep
    function testEncodeInputPlusLocal_PartialExtraction(bytes calldata encodedPayload1) external view{
        (address depositor, , uint decimals2, uint toChainId3, uint amount4, uint counter5, 
        ,,,,,) = abi.decode(encodedPayload1, (address, address, uint, uint, uint, uint, string, string, string, string, string, string));
        uint out6 = decimals2 * 10;
        uint out7 = toChainId3 * 10;
        uint out8 = amount4 * 10;
        uint out9 = counter5 + 10;
        uint out10 = counter5 + 20;
        
        uint out11 = decimals2 * 100;
        uint out12 = toChainId3 * 1000;
        uint out13 = amount4 * 20;
        uint out14 = counter5 + 20;
        uint out15 = counter5 + 30;
        uint out16 = counter5 + 40;
        uint out17 = counter5 + 40;
        
        console.logString('Unit testEncodeInputPlusLocal_PartialExtraction');
        
        //console.log(depositor);
        console.logUint(out6);
        console.logUint(out7);
        console.logUint(out8);
        console.logUint(out9);
        console.logUint(out10);
        console.logUint(out11);
        console.logUint(out12);
        console.logUint(out13);
        console.logUint(out14);
        console.logUint(out15);
        console.logUint(out16);
    }
    function _validateHashAndSignature(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata depositPayload) internal returns (bytes32){
        (address depositor, address token, uint decimals, uint toChainId, uint amount, uint counter) = abi.decode(depositPayload, (address, address, uint, uint, uint, uint));
        bytes32 depositHash = hashOf(depositor, token, decimals, toChainId, amount, counter);
        require(mintedForDepositHash[depositHash] == false, 'Already minted for deposit hash');
        uint256[2] memory messageToPoint = verifier.hashToPoint(bytes(cipher_suite_domain), bytes(bytes32ToHexString(depositHash)));
        bool validSignature = verifier.verifySignature(signature, signerKey, messageToPoint);
        require(validSignature == true, 'Invalid Signature');
        return depositHash;
    }
    function _createProxyTokenAndMint(bytes calldata depositPayload) internal {
        ERC20Token proxyToken;
        (address depositor, address token, uint decimals, uint chainId, uint amount, ,string memory name, string memory symbol) = abi.decode(depositPayload, (address, address, uint, uint, uint, uint, string, string));
        if (proxyTokenMap[chainId][token] == address(0)){
            proxyToken = new ERC20Token(name, symbol, uint8(decimals), token, chainId);
            proxyTokenMap[chainId][token] = address(proxyToken);
        }
        proxyToken = ERC20Token(proxyTokenMap[chainId][token]);
        proxyToken.mint(depositor, amount);
    }
    function mint(uint256[2] memory signature, uint256[4] memory signerKey, bytes calldata depositPayload) public {
        require(publicKey.length == signerKey.length, 'Invalid Public Key length');
        require((publicKey[0] == signerKey[0] && publicKey[1] == signerKey[1] && publicKey[2] == signerKey[2] && publicKey[3] == signerKey[3]), 'Invalid Public Key');
        bytes32 depositHash = _validateHashAndSignature(signature, signerKey, depositPayload);
        _createProxyTokenAndMint(depositPayload);
        mintedForDepositHash[depositHash] = true;
        /*
         map(originatingNetwork => map(originalTokenAddress => proxyTokenAddress)) proxyTokenMap;
         map(depositHash => bool) minted;
         if (!proxyTokenMap[originatingNetwork][originalTokenAddress]) {
          proxyToken = create proxy token (name, symbol, decimals, originalTokenAddress, originatingNetwork);
          proxyTokenMap[originatingNetwork][originalTokenAddress] = proxyToken;
         }
         proxyToken = proxyTokenMap[originatingNetwork][originalTokenAddress];
         proxyToken.mint(depositor, amount);
         minted[depositHash] = true;
         */
    }
}