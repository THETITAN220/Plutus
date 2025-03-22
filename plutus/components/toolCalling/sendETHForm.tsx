"use client";
import { useState } from "react";
import { getStorageItem } from "@/lib/localStorage";
import axios from "axios";

interface SendETHProps {
  onPaymentSuccess: (message: string) => void;
}

export default function SendETH({ onPaymentSuccess }: SendETHProps) { // Add prop
  const [addr, setAddr] = useState("");
  const [amt, setAmt] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await getStorageItem("walletState");
    console.log("store log: ", response);

    const amountToSend = parseFloat(amt);

    if (isNaN(amountToSend)) {
      console.error("Invalid amount entered.");
      return;
    }

    console.log("Amount to send:", amountToSend);
    const payData = {
      from: response.address,
      privateKey: response.privateKey,
      to: addr,
      amount: amt,
    };
    try {
      const payment = await axios.post("api/sendTx", payData);
      console.log("Payment: ", payment);
      const resStr = `Amount: ${payment.data.amount} has been paid to ${payment.data.to} TX HASH : ${payment.data.txHash}`;

      // Call the prop function to send the message to Chatbot
      onPaymentSuccess(resStr);
    } catch (error) {
      console.error("Payment failed", error);
      // Handle error, maybe send an error message to Chatbot
      onPaymentSuccess("Payment failed. Please try again."); // Sending Error message to chatbot
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="w-96 bg-black p-8 rounded-lg shadow-lg font-bold">
            <label className="text-white">Receiver Address</label>
            <input
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="0x....."
              type="text"
              className="w-full border text-white font-thin border-gray-500 rounded-lg p-2 mt-1 hover:shadow-lg"
            />

            <label className="text-white">Amount</label>
            <input
              onChange={(e) => setAmt(e.target.value)}
              value={amt}
              type="text"
              className="w-full border text-white font-thin border-gray-500 rounded-lg p-2 mt-1 hover:shadow-lg"
            />

            <button type="submit" className="w-full bg-orange-600 text-white p-2 mt-2 rounded-lg">
              Send ETH
            </button>
          </div>
        </form>
      </div>
    </>
  );
}