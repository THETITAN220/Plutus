"use client";

import { useState } from "react";
import CryptoChart from "@/components/toolCalling/CryptoChart";


export default function CryptoPage() {
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  const cryptoOptions = ["BTC-USD", "ETH", "DOGE", "ADA", "XRP"];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Crypto Price Chart</h1>

      <select
        className="border p-2 mb-4"
        value={selectedCoin}
        onChange={(e) => setSelectedCoin(e.target.value)}
      >
        {cryptoOptions.map((coin) => (
          <option key={coin} value={coin}>
            {coin}
          </option>
        ))}
      </select>

      <CryptoChart coin={selectedCoin} />
    </div>
  );
}
