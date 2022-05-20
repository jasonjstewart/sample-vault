const { expect } = require("chai");
const { ethers } = require("hardhat");

let sampleToken;

//CONSTANTS
let numTokens = ethers.utils.parseEther("10000",18);
let tokenName = "SampleToken";
let tokenSymbol = "SMP";

describe("Sample Token", function () {


  beforeEach(async function () {
    const SampleToken = await hre.ethers.getContractFactory("SampleToken");
    this.sampleToken = await SampleToken.deploy(numTokens, tokenName, tokenSymbol);
  
    await this.sampleToken.deployed();
  });

  it("Check minted amount", async function () {
    expect(await this.sampleToken.totalSupply()).to.equal(numTokens);
  });

  it("Check name", async function () {
    expect(await this.sampleToken.name()).to.equal(tokenName);
  });

  it("Check symbol", async function () {
    expect(await this.sampleToken.symbol()).to.equal(tokenSymbol);
  });

  it("Check owner wallet", async function () {
    const [owner] = await ethers.getSigners();
    var balance = await this.sampleToken.balanceOf(owner.address);
    expect(balance).to.equal(numTokens);
  });

  it("Check transfer works", async function () {
    const [owner, addr1] = await ethers.getSigners();
    var transferAmount = ethers.utils.parseEther("5000",18);
    await this.sampleToken.connect(owner).transfer(addr1.address, transferAmount);
    expect(await this.sampleToken.balanceOf(addr1.address)).to.equal(transferAmount);
  });

  it("Check approve works", async function () {
    const [owner, addr1] = await ethers.getSigners();
    var transferAmount = ethers.utils.parseEther("5000",18);
    await this.sampleToken.connect(owner).approve(addr1.address, transferAmount);
    expect(await this.sampleToken.allowance(owner.address, addr1.address)).to.equal(transferAmount);
  });

  it("Check transferFrom works", async function () {
    const [owner, addr1] = await ethers.getSigners();
    var transferAmount = ethers.utils.parseEther("5000",18);
    await this.sampleToken.connect(owner).approve(addr1.address, transferAmount);
    expect(await this.sampleToken.allowance(owner.address, addr1.address)).to.equal(transferAmount);
    await this.sampleToken.connect(addr1).transferFrom(owner.address, addr1.address, transferAmount);
    expect(await this.sampleToken.balanceOf(addr1.address)).to.equal(transferAmount);
  });


});
