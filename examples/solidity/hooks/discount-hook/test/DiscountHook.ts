import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, unlock } from "hardhat";

/**
 * Helper function
 * @param {*} password
 * @param {*} message
 * @returns
 */
const getSignatureForPassword = async (
  password: string,
  message: string
): Promise<[string, string]> => {
  // Build the signer
  const encoded = ethers.utils.defaultAbiCoder.encode(
    ["bytes32"],
    [ethers.utils.id(password)]
  );
  const privateKey = ethers.utils.keccak256(encoded);
  const privateKeyAccount = new ethers.Wallet(privateKey);

  // Sign
  const messageHash = ethers.utils.solidityKeccak256(["string"], [message]);
  const messageHashBinary = ethers.utils.arrayify(messageHash);
  const signature = await privateKeyAccount.signMessage(messageHashBinary);
  const verified = ethers.utils.verifyMessage(messageHashBinary, signature);

  return [signature, privateKeyAccount.address];
};

describe("DiscountHook", function () {
  it("should compute signers correctly", async function () {
    const recipient = "0xF5C28ce24cf47849988f147d5C75787c0103534".toLowerCase();

    const password = "password"; // (Math.random()).toString(36).substring(2);
    const DiscountHook = await ethers.getContractFactory("DiscountHook");
    const hook = await DiscountHook.deploy();
    await hook.deployed();

    const [data, signerAddress] = await getSignatureForPassword(
      password,
      recipient
    );

    // with wrong password
    const [badData, _] = await getSignatureForPassword(
      "wrongpassword",
      recipient
    );
    expect(await hook.getSigner(recipient.toLowerCase(), badData)).to.not.equal(
      signerAddress
    );

    // with correct password
    expect(await hook.getSigner(recipient.toLowerCase(), data)).to.equal(
      signerAddress
    );
  });

  it("should allow purchases with discounts if the code is correct", async () => {
    const [user] = await ethers.getSigners();

    await unlock.deployProtocol();
    const expirationDuration = 60 * 60 * 24 * 7;
    const maxNumberOfKeys = 100;
    const keyPrice = ethers.utils.parseUnits("1.0", "ether");
    const { lock } = await unlock.createLock({
      expirationDuration,
      maxNumberOfKeys,
      keyPrice,
      name: "ticket",
      currencyContractAddress: "",
    });
    const DiscountHook = await ethers.getContractFactory("DiscountHook");
    const hook = await DiscountHook.deploy();
    await hook.deployed();

    await (
      await lock.setEventHooks(
        hook.address,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero
      )
    ).wait();

    // Build the signer from password
    const password = "50%OFF";
    const [data, signer] = await getSignatureForPassword(
      password,
      user.address.toLowerCase()
    );
    // Set the password on the hook for the lock
    const discount = 50;
    await (
      await hook.setDiscountForLock(lock.address, signer, discount * 100)
    ).wait();

    const priceWithoutPassword = await lock.purchasePriceFor(
      user.address,
      user.address,
      0
    );
    expect(priceWithoutPassword).equal(await lock.keyPrice());

    const priceWithPassword = await lock.purchasePriceFor(
      user.address,
      user.address,
      data
    );
    expect(priceWithPassword).equal(
      (await lock.keyPrice()).mul(discount).div(100)
    );

    const balanceBefore = await ethers.provider.getBalance(user.address);
    console.log(ethers.utils.formatEther(balanceBefore));

    // And now let's do a full purchase which should *just work*
    // And now make a purchase that should fail because we did not submit a data
    await expect(
      lock.purchase(
        [keyPrice],
        [user.address],
        [user.address],
        [user.address],
        [data],
        { value: keyPrice.mul(discount).div(100) }
      )
    ).not.to.reverted;

    const balanceAfter = await ethers.provider.getBalance(user.address);
    console.log(ethers.utils.formatEther(balanceAfter));
    expect(balanceAfter).to.be.greaterThan(balanceBefore.sub(keyPrice)); // becuase the user got a discount!
  });
});
