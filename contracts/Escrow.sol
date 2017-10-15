pragma solidity ^0.4.11;

contract Escrow {

   address public buyer;
    address public seller;
    address public arbiter;

   function Escrow(address _seller, address _arbiter) {
        buyer = msg.sender;
        seller = _seller;
        arbiter = _arbiter;
    }

   function paySeller(uint256 payment) payable {
        if(msg.sender == buyer || msg.sender == arbiter) {
            if (payment <= this.balance){
                seller.transfer(payment);
            }
        }
    }


   /*function refundBuyer() {
        if(msg.sender == seller || msg.sender == arbiter) {
         buyer.transfer(this.balance);
        }
    }*/


        function fund() payable returns (bool) {
          return true;
      }

   function getBalance() constant returns (uint) {
        return this.balance;
    }

}
