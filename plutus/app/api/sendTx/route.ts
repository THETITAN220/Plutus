// app/api/sendTx/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import provider from "@/utils/provider";

export async function POST(req: NextRequest) {
  try {
    const { from, privateKey, to, amount } = await req.json();

    if (!privateKey || !to || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const wallet = new ethers.Wallet(privateKey, provider);

    // Verify the sender address matches the wallet address
    if (from && from.toLowerCase() !== wallet.address.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "Sender address does not match private key" },
        { status: 400 }
      );
    }

    // Validate the recipient address
    if (!ethers.isAddress(to)) {
      return NextResponse.json(
        { success: false, error: "Invalid recipient address" },
        { status: 400 }
      );
    }

    // Parse amount to ethers
    const value = ethers.parseEther(amount);

    // Get current gas price and estimate gas limit
    const feeData = await provider.getFeeData();

    // Create transaction
    const tx = await wallet.sendTransaction({
      to,
      value,
      gasLimit: 21000, // Standard gas limit for ETH transfers
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    });

    // Wait for transaction to be mined (optional, can be skipped for faster UX)
    // const receipt = await tx.wait();

    // Return success with transaction hash
    return NextResponse.json({
      success: true,
      txHash: tx.hash,
      from: wallet.address,
      to,
      amount,
    });
  } catch (error) {
    console.error("Transaction error:", error);

    // Format the error message
    let errorMessage = "Transaction failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
