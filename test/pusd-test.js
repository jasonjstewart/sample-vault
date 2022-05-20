const { expect } = require("chai");
const { ethers } = require("hardhat");

let sampleToken;
let pusd;
let vault;

//CONSTANTS
let numTokens = ethers.utils.parseEther("1000",18);
let tokenName = "SampleToken";
let tokenSymbol = "SMP";
const year = 365 * 24 * 60 * 60;

describe("Sample Token", function () {


  beforeEach(async function () {
    const [owner] = await ethers.getSigners();
    const SampleToken = await hre.ethers.getContractFactory("SampleToken");
    this.sampleToken = await SampleToken.deploy(numTokens, tokenName, tokenSymbol);
  
    await this.sampleToken.deployed();

    const PUSD = await hre.ethers.getContractFactory("PUSD");
    this.pusd = await PUSD.deploy(tokenName, tokenSymbol);
  
    await this.pusd.deployed();

    const Vault = await hre.ethers.getContractFactory("Vault");
    this.vault = await Vault.deploy(this.sampleToken.address, this.pusd.address);
  
    await this.vault.deployed();

    await this.pusd.connect(owner).setVault(this.vault.address);
  });

  it("Check deposit Sample tokens", async function () {
    const [owner] = await ethers.getSigners();
    await this.sampleToken.connect(owner).approve(this.vault.address, ethers.utils.parseEther("1000",18));
    await this.vault.connect(owner).deposit(ethers.utils.parseEther("1000",18));
    expect(await this.sampleToken.balanceOf(this.vault.address)).to.equal(ethers.utils.parseEther("1000",18));
    await network.provider.send("evm_increaseTime", [year])
    await ethers.provider.send('evm_mine');
    await this.vault.connect(owner).withdraw();
    expect(await this.pusd.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10",18))
  });




});
