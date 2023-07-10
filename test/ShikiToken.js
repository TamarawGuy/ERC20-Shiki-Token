const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ShikiToken", function () {
  async function deploy() {
    const [owner, firstAccount, secondAccount] = await ethers.getSigners();

    const ShikiToken = await ethers.getContractFactory("ShikiToken");
    const shikiToken = await ShikiToken.deploy(100000000, 50);

    return { shikiToken, owner, firstAccount, secondAccount };
  }

  describe("deployment", function () {
    it("Should set the right owner", async function () {
      const { shikiToken, owner } = await loadFixture(deploy);
      expect(await shikiToken.owner()).to.equal(owner.address);
    });

    it("should assign tokens to owner", async function () {
      const { shikiToken, owner } = await loadFixture(deploy);
      expect(await shikiToken.balanceOf(owner.address)).to.equal(
        70000000n * 10n ** 18n
      );
    });

    it("should set max cap supply", async function () {
      const { shikiToken } = await loadFixture(deploy);
      expect(await shikiToken.cap()).to.equal(100000000n * 10n ** 18n);
    });

    it("should set blockReward", async function () {
      const { shikiToken } = await loadFixture(deploy);
      expect(await shikiToken.blockReward()).to.equal(50n * 10n ** 18n);
    });
  });

  describe("setBlockReward", function () {
    it("should fail if not owner", async function () {
      const { shikiToken, firstAccount } = await loadFixture(deploy);
      await expect(
        shikiToken.connect(firstAccount).setBlockReward(100)
      ).to.be.revertedWith("Only owner can call this function.");
    });

    it("should succeed if owner", async function () {
      const { shikiToken, owner } = await loadFixture(deploy);
      await shikiToken.setBlockReward(100);
      expect(await shikiToken.blockReward()).to.equal(100n * 10n ** 18n);
    });
  });

  describe("transfers", function () {
    it("should fail if account has insufficient balance", async function () {
      const { shikiToken, owner, firstAccount } = await loadFixture(deploy);
      await expect(
        shikiToken.connect(firstAccount).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("should succeed if account has sufficient balance", async function () {
      const { shikiToken, owner, firstAccount, secondAccount } =
        await loadFixture(deploy);
      await shikiToken.transfer(firstAccount.address, 1);
      await shikiToken.transfer(secondAccount.address, 1);
      expect(await shikiToken.balanceOf(firstAccount.address)).to.equal(1);
      expect(await shikiToken.balanceOf(secondAccount.address)).to.equal(1);
    });
  });
});
