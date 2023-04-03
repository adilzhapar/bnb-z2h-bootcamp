const { expect } = require("chai");

describe("BadgerCoin", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("BadgerCoin");
    [owner, recipient, anotherAccount] = await ethers.getSigners();
    token = await Token.connect(owner).deploy();
  });

  describe("approve", function () {
    it("approves tokens for delegated transfer", async function () {
      const amount = 100;
      const result = await token.approve(recipient.address, amount);
      expect(await token.allowance(owner.address, recipient.address)).to.equal(amount);
      expect(result).to.emit(token, "Approval").withArgs(owner.address, recipient.address, amount);
    });
  });

  describe("transferFrom", function () {
    const amount = 5;

    beforeEach(async function () {
      await token.approve(recipient.address, amount);
    });

    it("reverts when transferring more than the approved amount", async function () {
      await expect(token.connect(recipient).transferFrom(owner.address, anotherAccount.address, amount + 1)).to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("reverts when transferring from a non-approved address", async function () {
      await expect(token.connect(anotherAccount).transferFrom(owner.address, recipient.address, amount)).to.be.revertedWith("ERC20: insufficient allowance");
    });
  });

  describe("pausable", function () {
    it("pauses and unpauses the contract", async function () {
      await token.pause();
      expect(await token.paused()).to.equal(true);

      await token.unpause();
      expect(await token.paused()).to.equal(false);
    });

    it("reverts when pausing from a non-owner account", async function () {
      await expect(token.connect(recipient).pause()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts when unpausing from a non-owner account", async function () {
      await token.pause();
      await expect(token.connect(recipient).unpause()).to.be.revertedWith("Ownable: caller is not the owner");
    });


  });


});