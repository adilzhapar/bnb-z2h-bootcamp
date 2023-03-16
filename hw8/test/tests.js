const { expect } = require("chai");

describe("BadgerCoin", function () {
    let token;
    let owner;
    let addr1;
    let addr2;
    const initialSupply = ethers.utils.parseEther("1000000");

    beforeEach(async () => {
        const Token = await ethers.getContractFactory("BadgerCoin");
        [owner, addr1, addr2] = await ethers.getSigners();
        token = await Token.connect(owner).deploy(initialSupply);
      });

    it("Should have an initial total supply of 1000000", async function() {
    const totalSupply = await token.getTotalSupply();
    expect(totalSupply).to.equal(initialSupply);
    });

    it("Should have 18 decimals", async function() {
        const decimals = await token.decimals();
        expect(decimals).to.equal(18);
    });

    it("Should return correct balanceOf", async function() {
        const user = addr1.address;
        const expectedBalance = ethers.utils.parseEther("50");

        await token.connect(owner).transfer(user, expectedBalance);
        
        const actualBalance = await token.getBalance(user);
        expect(actualBalance).to.equal(expectedBalance);
    });

    it("Should transfer correctly", async function() {
        // Set up test case with sender and receiver addresses, and known amount to transfer
        const sender = addr1.address;
        const reciever = addr2.address;
        const amount = ethers.utils.parseEther("50");
        await token.connect(owner).transfer(sender, amount);
        
        // Assert that the transfer succeeds and both balances update correctly
        const expectedSenderBalance = 0;
        const expectedReceiverBalance = amount;
        await token.connect(addr1).transfer(reciever, amount);
        const actualSenderBalance = await token.getBalance(sender);
        const actualReceiverBalance = await token.getBalance(reciever);
        expect(actualSenderBalance).to.equal(expectedSenderBalance);
        expect(actualReceiverBalance).to.equal(expectedReceiverBalance);
      });

      it("Should produce error with insufficient balance transfer", async function() {
        // Set up test case with insufficient balance
        const sender = addr1.address;
        const receiver = addr2.address;
        const amount = ethers.utils.parseEther("1500");
        
        // Assert that transfer fails with an error message
        await expect(token.connect(addr1).transfer(receiver, amount)).to.be.revertedWith("Insufficient balance");
      });
  
});
