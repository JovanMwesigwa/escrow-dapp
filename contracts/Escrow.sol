// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// @title A contract for Trustworthy product delivery service powered by a Escrow Smart Contract
// @author Jovan Mwesigwa Balambirwa

error Escrow__NotAdminRequestDenied();
error Escrow__OnyBuyerDepositAllowed();
error Escrow__OnlyBuyerDepositAllowed();
error Escrow__InsufficientAmountDeposited();
error Escrow__OnlyBuyerConfirmDeposit();
error Escrow__ContractAlreadyInProgress();
error Escrow__BothPartiesMustConfirmFirst();

contract Escrow {
    address private i_admin;
    address payable private s_buyer;
    address payable private s_seller;

    uint256 private s_balance;

    bool private buyerConfirmation;
    bool private sellerConfirmation;

    // Events
    event Deposit(address indexed buyerAddress, uint256 indexed amount);
    event DeliveryConfirmed(address indexed buyerAddress);
    event ReceiptDone(address indexed sellerAddress);
    event PaymentReleased(
        address indexed buyerAddress,
        address indexed sellerAddress,
        uint256 amount
    );

    constructor() {
        i_admin = payable(msg.sender);
        s_balance = 0;
    }

    function confirmSellerDelivery() public payable {
        // Verify that only the buyer confirms the delivery
        if (msg.sender != s_buyer) {
            revert Escrow__OnlyBuyerConfirmDeposit();
        }

        buyerConfirmation = true;

        // Emit a delivery condirmation event
        emit DeliveryConfirmed(msg.sender);

        // Call the release payment here...
        if (buyerConfirmation && sellerConfirmation) {
            s_seller.transfer(address(this).balance);
            buyerConfirmation = false;
            sellerConfirmation = false;
            s_balance = 0;
        }
    }

    function confirmBuyerReceipt() public payable {
        // Verify that only the seller confirms the issuing the recipt
        if (msg.sender != s_seller) {
            revert Escrow__OnlyBuyerConfirmDeposit();
        }

        sellerConfirmation = true;

        // Emit a recepit done event
        emit ReceiptDone(msg.sender);

        // Call the release payment here...
        if (buyerConfirmation && sellerConfirmation) {
            s_seller.transfer(address(this).balance);
            sellerConfirmation = false;
            s_balance = 0;
        }
    }

    function deposit() public payable {
        // Verify that the buyer is only depositing
        if (msg.sender != s_buyer) {
            revert Escrow__OnlyBuyerDepositAllowed();
        }

        // Verify that the amount of money deposited is not 0
        if (msg.value <= 0) {
            revert Escrow__InsufficientAmountDeposited();
        }

        // Update the contract's balance
        s_balance += msg.value;

        // Emit a deposit event
        emit Deposit(msg.sender, msg.value);
    }

    function addParties(address payable buyer, address payable seller) public {
        if (msg.sender != i_admin) {
            revert Escrow__NotAdminRequestDenied();
        }

        s_buyer = buyer;
        s_seller = seller;
    }

    function getBalance() public view returns (uint256) {
        return s_balance;
    }

    function getAdmin() public view returns (address) {
        return i_admin;
    }

    function getBuyer() public view returns (address) {
        return s_buyer;
    }

    function getSeller() public view returns (address) {
        return s_seller;
    }

    function getBuyerConfirmation() public view returns (bool) {
        return buyerConfirmation;
    }

    function getSellerConfirmation() public view returns (bool) {
        return sellerConfirmation;
    }
}
