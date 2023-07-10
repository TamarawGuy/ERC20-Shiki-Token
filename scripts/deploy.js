const hre = require("hardhat");

async function main() {
  const shikiToken = await hre.ethers.deployContract("ShikiToken", [1000, 50], {
    gasLimit: 6_000_000,
  });
  await shikiToken.waitForDeployment();

  console.log("ShikiToken deployed to:", shikiToken.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
