
import { ethers } from "ethers";

import provider from "./provider";
/**
 * Generate a new wallet with mnemonic
 */
export function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || "",
  };
}

/**
 * Restore a wallet from a private key
 */
export function restoreWallet(privateKey: string) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Wallet: ", wallet);
    return wallet;
  } catch (error) {
    console.error("Invalid Private Key", error);
    return null;
  }
}

/**
 * Get ETH Balance of a wallet
 */
export async function getBalance(address: string) {


  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return "0";
  }
  return "100";
}



