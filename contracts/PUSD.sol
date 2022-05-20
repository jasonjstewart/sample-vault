// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PUSD is ERC20, Ownable {
    address vault;

    constructor(string memory tokenName, string memory tokenSymbol) ERC20(tokenName, tokenSymbol) {
        vault = msg.sender;
    }

    function setVault(address newVault) public onlyOwner {
        vault = newVault;
    }

    function mint(uint256 amount, address recipient) public {
        require(msg.sender == vault);

        _mint(recipient, amount);
    }
}