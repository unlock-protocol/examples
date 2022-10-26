pragma solidity 0.8.17;
import "@unlock-protocol/contracts/dist/PublicLock/IPublicLockV11.sol";

contract Discount {

  mapping(address => mapping(address => uint256)) private discounts;

  error NOT_AUTHORIZED();

  /** Constructor */
  constructor() {
  }

  function addDiscount(address lock, address recipient, uint256 price) public returns (bool) {
    if (!IPublicLockV11(lock).isLockManager(msg.sender)) {
        revert NOT_AUTHORIZED();
    }
    discounts[lock][recipient] = price;
    return true;
  }
  
  /**
   * Function that is called at the begining of the
   * `purchase` function on the Public Lock contract.
   * It is expected to return the price that has to be
   * paid by the purchaser (as a uint256). If this
   * reverts, the purchase function fails.
   */
  function keyPurchasePrice(
      address, /* from */
      address recipient, /*recipient */
      address, /* referrer */
      bytes calldata /* data */
  ) external view returns (uint256 minKeyPrice) {
    uint price  = discounts[msg.sender][recipient];
    if (price > 0) {
      return price;
    }
    return IPublicLockV11(msg.sender).keyPrice();
  }

  /**
    * Function that is called at the end of the `purchase`
    * function and that can be used to record and store
    * elements on the hook. Similarly, if this reverts, the
    * purchase function fails.
    */
  function onKeyPurchase(
      address, /*from*/
      address, /*recipient*/
      address, /*referrer*/
      bytes calldata, /*data*/
      uint256, /*minKeyPrice*/
      uint256 /*pricePaid*/
  ) external {
    // Do nothing
  }
}