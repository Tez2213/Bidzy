import { ethers } from "hardhat";

async function main() {
  const DeliveryEscrow = await ethers.getContractFactory("DeliveryEscrow");
  console.log("Deploying DeliveryEscrow...");

  const deliveryEscrow = await DeliveryEscrow.deploy();
  await deliveryEscrow.waitForDeployment();

  console.log("DeliveryEscrow deployed to:", await deliveryEscrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
