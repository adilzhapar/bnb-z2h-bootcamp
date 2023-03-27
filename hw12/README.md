## Optimisations from Group 6
### initial perecentage: 15.5 %
1. Change compiler version to the latest (15.3 %)
2. Removed (14.6 %):
    - `basicFlag` && changed boolean variables from uint256 to uint8
    - `defaultPayment()` 
    - `getPaymentHistory()`
3. Simplify the code(14.2 %):
    - remove second `checkForAdmin(senderOfTx)`, and store function call in variable
    - in the `checkIfWhiteListed()` we do not have to check `require(senderOfTx == sender)`
    - simplify `getTradingMode()`
4. optimize `onlyAdminOrOwner()` modifier (12.6 %)
5. changed `ii` to `i` (12.5 %)
6. optimizied if clause in constructor (no change)
7. deleted extra variable in `checkForAdmin()` (no change)
8. deleted unnecesary status function in `transfer()` (12.3 %)
9. deleted unnecesary code in `addToWhitelist()` (12 %)
10.  We do not need history (11.5 %)
11. do not need `require` in `getPayments()` (11.2 %)





# Optimisation Game Instructions

1. Open a terminal go to the Gas directory
2. Run ` npm i` to install the dependencies
3. Run ` npx hardhat test` to run the tests and get a gas usage report

![](https://i.imgur.com/qdNy92B.png)

If you prefer to use a different IDE, you may, but you will need to make sure the contract passes the same tests.

The aim of the game is to reduce the Average figures for contract deployment and transfer and updatePayment functions as much as possible.

You can change the contract as much as you like.
You **cannot**  change the tests, and all the tests must pass.

you can slightly adjust tests for whitelist functions if you need so.

In order to generate storage diagram run the following command:

`sol2uml storage ./contracts/ -c GasContract -o gasStorage.svg`
