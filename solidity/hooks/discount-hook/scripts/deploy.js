
const { ethers, network } = require("hardhat");

async function main() {
  const [user] = await ethers.getSigners();
  const { chainId } = await user.provider.getNetwork()
  console.log(`Deploying from ${user.address} on ${chainId}`);

  const PurchaseHook = await ethers.getContractFactory("Discount");
  const hook = await PurchaseHook.deploy();
  await hook.deployed();

  console.log("Hook deployed to:", hook.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });