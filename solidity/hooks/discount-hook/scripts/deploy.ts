import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log(`Deploying from ${signer.address}`);

  const DiscountHook = await ethers.getContractFactory("DiscountHook");
  const discountHook = await DiscountHook.deploy();

  await discountHook.deployed();

  console.log(`Deployed to ${discountHook.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
