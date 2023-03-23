const {expect} = require("chai");

describe("DogCoin", function () {
    let owner;
    let contract;
    let addr1;
    
    beforeEach(async () => {
        const DogCoin = await ethers.getContractFactory("DogCoin");
        [owner, addr1] = await ethers.getSigners();
        
        contract = await DogCoin.connect(owner).deploy();
    });

    // This test verifies that the total supply can be increased in steps of 1000
    it("should increase the total supply in steps of 1000", async () => {
        
        const initialSupply = await contract.getTotalSupply();
    
        // Increase the total supply by 1000
        await contract.increaseTotalSupply();
    
        // Verify that the total supply has increased by 1000
        const newSupply = await contract.getTotalSupply();
        expect(newSupply - initialSupply).to.equal(1000);
    });


    it("should not allow non-owners to increase the total supply", async () => {
        const initialSupply = await contract.getTotalSupply();
      
        // Try to increase the total supply by 1000 from another account
        try {
          await contract.connect(addr1).increaseTotalSupply();
        } catch (error) {
          expect(error.toString()).to.include("Only owner can call this function.");
          
        }
      
        // Verify that the total supply has not changed
        const newSupply = await contract.getTotalSupply();
        expect(newSupply).to.equal(initialSupply);
    });
    

    it("should emit Transfer event when tokens are transferred", async () => {
        const sender = owner;
        const recipient = addr1;
        const amount = 100;
      
        // Perform a transfer
        const tx = await contract.transfer(recipient.address, amount);
      
        expect(tx).to.emit(contract, "Transfer");

      });

});