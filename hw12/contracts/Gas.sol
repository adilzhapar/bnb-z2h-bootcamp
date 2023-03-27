// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "./Ownable.sol";

contract Constants {
    uint8 public tradeFlag = 1;
    uint8 public dividendFlag = 1;
}

contract GasContract is Ownable, Constants {
    uint256 public totalSupply = 0; // cannot be updated
    uint256 public paymentCounter = 0;
    mapping(address => uint256) public balances;
    uint256 public tradePercent = 12;
    address public contractOwner;
    uint256 public tradeMode = 0;
    mapping(address => Payment[]) public payments;
    mapping(address => uint256) public whitelist;
    address[5] public administrators;
    bool public isReady = false;
    enum PaymentType {
        Unknown,
        BasicPayment,
        Refund,
        Dividend,
        GroupPayment
    }
    uint256 wasLastOdd = 1;
    mapping(address => uint256) public isOddWhitelistUser;
    mapping(address => ImportantStruct) public whiteListStruct;
    



    struct Payment {
        PaymentType paymentType;
        uint256 paymentID;
        bool adminUpdated;
        string recipientName; // max 8 characters
        address recipient;
        address admin; // administrators address
        uint256 amount;
    }

    struct ImportantStruct {
        uint256 valueA; // max 3 digits
        uint256 bigValue;
        uint256 valueB; // max 3 digits
    }


    event AddedToWhitelist(address userAddress, uint256 tier);
    event supplyChanged(address indexed, uint256 indexed);
    event Transfer(address recipient, uint256 amount);
    event PaymentUpdated(
        address admin,
        uint256 ID,
        uint256 amount,
        string recipient
    );
    event WhiteListTransfer(address indexed);

    modifier onlyAdminOrOwner() {
        address senderOfTx = msg.sender;
        bool isAdmin = checkForAdmin(senderOfTx);

        if(!isAdmin && senderOfTx != contractOwner){
            revert(
                "Error in Gas contract - onlyAdminOrOwner modifier : revert happened because the originator of the transaction was not the admin, and furthermore he wasn't the owner of the contract, so he cannot run this function"

            );
        }else{
            _;
        }
    }

    modifier checkIfWhiteListed(address sender) {
        address senderOfTx = msg.sender;
        uint256 usersTier = whitelist[senderOfTx];
        require(
            usersTier > 0,
            "Gas Contract CheckIfWhiteListed modifier : revert happened because the user is not whitelisted"
        );
        require(
            usersTier < 4,
            "Gas Contract CheckIfWhiteListed modifier : revert happened because the user's tier is incorrect, it cannot be over 4 as the only tier we have are: 1, 2, 3; therfore 4 is an invalid tier for the whitlist of this contract. make sure whitlist tiers were set correctly"
        );
        _;
    }


    constructor(address[] memory _admins, uint256 _totalSupply) {
        contractOwner = msg.sender;
        totalSupply = _totalSupply;

        for (uint256 i = 0; i < administrators.length; i++) {
            if (_admins[i] != address(0)) {
                administrators[i] = _admins[i];
                if (_admins[i] == contractOwner) {
                    balances[contractOwner] = totalSupply;
                    emit supplyChanged(_admins[i], totalSupply);
                } else {
                    balances[_admins[i]] = 0;
                    emit supplyChanged(_admins[i], 0);
                }
                
            }
        }
    }

    function addToWhitelist(address _userAddrs, uint256 _tier)
        public
        onlyAdminOrOwner
    {
        require(
            _tier < 255,
            "Gas Contract - addToWhitelist function -  tier level should not be greater than 255"
        );
        whitelist[_userAddrs] = _tier;
        if (_tier > 3) {
            whitelist[_userAddrs] = 3;
        } else if (_tier == 1) {
            whitelist[_userAddrs] = 1;
        } else if (_tier > 0 && _tier < 3) {
            whitelist[_userAddrs] = 2;
        }
        uint256 wasLastAddedOdd = wasLastOdd;
        if (wasLastAddedOdd == 1) {
            wasLastOdd = 0;
            isOddWhitelistUser[_userAddrs] = wasLastAddedOdd;
        } else {
            wasLastOdd = 1;
            isOddWhitelistUser[_userAddrs] = wasLastAddedOdd;
        } 
        emit AddedToWhitelist(_userAddrs, _tier);
    }


    function checkForAdmin(address _user) public view returns (bool admin_) {
        for (uint256 i = 0; i < administrators.length; i++) {
            if (administrators[i] == _user) {
                return true;
            }
        }
    }

    function balanceOf(address _user) public view returns (uint256 balance_) {
        return balances[_user];
    }

    function getTradingMode() public view returns (bool mode_) {
        return tradeFlag == 1 || dividendFlag == 1;
    }


    function getPayments(address _user)
        public
        view
        returns (Payment[] memory payments_)
    {
        
        return payments[_user];
    }

    function transfer(
        address _recipient,
        uint256 _amount,
        string memory _name
    ) public returns (bool status_) {
        address senderOfTx = msg.sender;
        require(
            balances[senderOfTx] >= _amount,
            "Gas Contract - Transfer function - Sender has insufficient Balance"
        );
        require(
            bytes(_name).length < 9,
            "Gas Contract - Transfer function -  The recipient name is too long, there is a max length of 8 characters"
        );
        balances[senderOfTx] -= _amount;
        balances[_recipient] += _amount;
        emit Transfer(_recipient, _amount);
        Payment memory payment;
        payment.admin = address(0);
        payment.adminUpdated = false;
        payment.paymentType = PaymentType.BasicPayment;
        payment.recipient = _recipient;
        payment.amount = _amount;
        payment.recipientName = _name;
        payment.paymentID = ++paymentCounter;
        payments[senderOfTx].push(payment);

        return true;
    }

    function updatePayment(
        address _user,
        uint256 _ID,
        uint256 _amount,
        PaymentType _type
    ) public onlyAdminOrOwner {
        require(
            _ID > 0,
            "Gas Contract - Update Payment function - ID must be greater than 0"
        );
        require(
            _amount > 0,
            "Gas Contract - Update Payment function - Amount must be greater than 0"
        );

        address senderOfTx = msg.sender;

        for (uint256 i = 0; i < payments[_user].length; i++) {
            if (payments[_user][i].paymentID == _ID) {
                payments[_user][i].adminUpdated = true;
                payments[_user][i].admin = _user;
                payments[_user][i].paymentType = _type;
                payments[_user][i].amount = _amount;

                emit PaymentUpdated(
                    senderOfTx,
                    _ID,
                    _amount,
                    payments[_user][i].recipientName
                );
                break;
            }
        }
    }


    function whiteTransfer(
        address _recipient,
        uint256 _amount,
        ImportantStruct memory _struct
    ) public checkIfWhiteListed(msg.sender) {
        address senderOfTx = msg.sender;
        require(
            balances[senderOfTx] >= _amount,
            "Gas Contract - whiteTransfers function - Sender has insufficient Balance"
        );
        require(
            _amount > 3,
            "Gas Contract - whiteTransfers function - amount to send have to be bigger than 3"
        );
        balances[senderOfTx] -= _amount;
        balances[_recipient] += _amount;
        balances[senderOfTx] += whitelist[senderOfTx];
        balances[_recipient] -= whitelist[senderOfTx];

        whiteListStruct[senderOfTx] = ImportantStruct(0, 0, 0);
        ImportantStruct storage newImportantStruct = whiteListStruct[
            senderOfTx
        ];
        newImportantStruct.valueA = _struct.valueA;
        newImportantStruct.bigValue = _struct.bigValue;
        newImportantStruct.valueB = _struct.valueB;
        emit WhiteListTransfer(_recipient);
    }
}
