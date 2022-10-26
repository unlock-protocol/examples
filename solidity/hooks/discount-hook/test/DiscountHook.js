const { expect } = require("chai");
const { ethers, unlock } = require("hardhat");

const list = require('../list.js').splice(0, 1200)

describe("Discount", function () {
  before(async () => {
    // Deploy the core Unlock protocol
    await unlock.deployProtocol();
  });

  it("should work as a hook", async function () {
    const [user, notAllowed] = await ethers.getSigners();
    // Deploy a lock
    await unlock.deployAndSetTemplate(11, 1)
    const { lock } = await unlock.createLock({
      expirationDuration: 60 * 60 * 24 * 7,
      maxNumberOfKeys: 100,
      keyPrice: 1,
      name: "My NFT membership contract",
      version: 11,
    });


    // Deploy the hook
    const Discount = await ethers.getContractFactory("Discount");
    const hook = await Discount.deploy();
    await hook.deployed();

    // Attach the hook to our lock
    await (
      await lock.setEventHooks(
        hook.address, // The first address is the onKeyPurchase hook
        ethers.constants.AddressZero, // Other non-used hooks
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero
      )
    ).wait();

    // And now make a purchase without enough payment!
    await expect(
      lock.purchase([ethers.utils.parseEther('0.2')], [user.address], [user.address], [user.address], [[]])
    ).to.reverted;

    // Let's add a discount on the hook!
    await (
      await hook.addDiscount(
        lock.address,
        user.address,
        ethers.utils.parseEther('0.2'))
    ).wait();


    // And now it should be good!
    expect(
      await lock.purchasePriceFor(user.address, user.address, [])
    ).to.equal(ethers.utils.parseEther('0.2'))


    // And now it should be good!
    await expect(
      lock.purchase([ethers.utils.parseEther('0.2')], [user.address], [user.address], [user.address], [[]], {
        value: ethers.utils.parseEther('0.2')
      })
    ).not.to.reverted;

  });
});