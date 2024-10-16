// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

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
     * The payload structure: <Origin: {chain, token, decimals}>, token-amount, owner-address, from-chain, to-chain, tag
     * from-chain may seem redundant at first glance. however, consider the case where L[1] transfers Token to L[n] and L[m],
     * and both L[n] and L[m] transfers it back to L[1], and both L[n] and L[m] could have the same counter, so another key in the form of from-chain is needed.
     *
     * ... and the hash of the whole payload to precede it all.
     */
    event Transfer(bytes32 transferHash, uint64 origin, address token, string name, string symbol, uint8 decimals, uint amount, address owner, uint64 from, uint64 to, uint tag);

    error InvalidPublicKey(uint8 index);
    error TokenDisburseFailure(address token, address from, address to, uint amount);
    error RetransferAttempt(uint64 origin, address token, string symbol, uint amount, address owner);

    Chain public home;
    uint[4] public publicKey;
    uint public sendCounter = 0;
    mapping(address => uint) public balances;
    mapping(bytes32 => bool) public sends;
    mapping(bytes32 => bool) public accepts;
    mapping(uint64 => mapping(address => address)) public proxies;
    mapping(address => bool) public wasAccepted;

    modifier isValidPublicKey(uint[4] calldata key) { for (uint8 i = 0; i < 4; i++) if (publicKey[i] != key[i]) revert InvalidPublicKey(i); _; }

    constructor(uint64 chainId_, string memory chainName, string memory nativeSymbol, uint8 nativeDecimals, uint[4] memory publicKey_) {
        home = Chain(chainId_, chainName, nativeSymbol, nativeDecimals); //fixme:chainId: use block.chainid instead
        publicKey = publicKey_;
    }

    function chainId() public view returns (uint64) { return home.id; } //fixme:chainId: use block.chainid instead

    function proxyBalanceOf(uint64 chainId_, address token, address account) public view returns (uint) {
        return proxies[chainId_][token] == address(0) ? 0 : ERC20Proxy(proxies[chainId_][token]).balanceOf(account);
    }

    function sendNative(uint64 to) external payable {
        balances[NATIVE] += msg.value;
        send(chainId(), NATIVE, home.name, home.symbol, home.decimals, msg.value, msg.sender, to);
    }

    function sendToken(uint64 to, address token, uint amount) external {
        if (wasAccepted[token]) {
            ERC20Proxy proxy = ERC20Proxy(token);
            proxy.burn(msg.sender, amount);
            send(proxy.chain(), proxy.token(), proxy.name(), proxy.symbol(), proxy.decimals(), amount, msg.sender, to);
        } else {
            ERC20 erc20 = ERC20(token);
            disburseToken(token, msg.sender, address(this), amount);
            balances[token] += amount;
            send(chainId(), token, erc20.name(), erc20.symbol(), erc20.decimals(), amount, msg.sender, to);
        }
    }

    function send(uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner, uint64 to) private {
        uint tag = ++sendCounter;
        bytes32 hash = keccak256(abi.encode(origin, token, name, symbol, decimals, amount, owner, chainId(), to, tag));
        sends[hash] = true;
        emit Transfer(hash, origin, token, name, symbol, decimals, amount, owner, chainId(), to, tag);
    }

    function accept(uint[2] calldata signature, uint[4] calldata signerPublicKey, bytes calldata payload) isValidPublicKey(signerPublicKey) external {
        (uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner, , , ) = abi.decode(payload, (uint64, address, string, string, uint8, uint, address, uint64, uint64, uint));
        bytes32 hash = keccak256(payload);
        if (accepts[hash]) revert RetransferAttempt(origin, token, symbol, amount, owner);
        BnsVerifier.verify(signature, signerPublicKey, hash);
        mintOrDisburse(origin, token, name, symbol, decimals, amount, owner);
        accepts[hash] = true;
    }

    function mintOrDisburse(uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner) private {
        chainId() == origin ?                                           // if token is coming back home (to originating chain) ...
            disburse(token, address(this), owner, amount) :             // ... disburse amount back to the owner
            mint(origin, token, name, symbol, decimals, amount, owner); // ... it's a foreign country, mint proxy for the owner
    }

    function mint(uint64 origin, address token, string memory name, string memory symbol, uint8 decimals, uint amount, address owner) private {
        if (proxies[origin][token] == address(0)) { // if proxy yet to exist
            proxies[origin][token] = address(new ERC20Proxy(origin, token, name, symbol, decimals));
            wasAccepted[proxies[origin][token]] = true;
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
        if (erc20.balanceOf(to) != balance + amount) revert TokenDisburseFailure(token, from, to, amount);
    }
}
