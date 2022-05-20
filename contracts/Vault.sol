// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IPUSD {
    function mint(uint256 amount, address recpient) external;
}

contract Vault{
    address sampleTokenAddress;
    address pusdAddress;


    constructor(address _sampleTokenAddress, address _pusdAddress){
        sampleTokenAddress = _sampleTokenAddress;
        pusdAddress = _pusdAddress;
    }

    mapping(address => uint256) depositedAmount; 
    mapping(address => uint256) accruedAmount;
    mapping(address => uint256) lastDepositedBlock;

    function deposit(uint256 amount) public {
        if (depositedAmount[msg.sender] > 0){
            accrue(msg.sender);
        }
        ERC20(sampleTokenAddress).transferFrom(msg.sender, address(this), amount);
        depositedAmount[msg.sender] += amount;
        lastDepositedBlock[msg.sender] = block.timestamp;
    }

    function getAccruedAmount() public view returns (uint256){
        return depositedAmount[msg.sender] / 100 * lastDepositedBlock[msg.sender]/(365 days); 
    }

    function accrue(address user) public {
        uint256 amount = depositedAmount[user] / 100 * (block.timestamp - lastDepositedBlock[user])/(365 days); 
        accruedAmount[user] += amount;
        lastDepositedBlock[user] = block.timestamp;
    }

    function withdraw() public {
        accrue(msg.sender);
        IPUSD(pusdAddress).mint(accruedAmount[msg.sender], msg.sender);
    }
}