"use client"
import { restoreWallet } from "@/utils/wallet"
import { useState } from "react"

const ImportWalletForm = ({ onWalletImported }) => {
  const [privateKey, setPrivateKey] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const import_response = await restoreWallet(privateKey);
      if (import_response && import_response.address) {
        const walletDetails = {
          address: import_response.address,
          privateKey: privateKey,
          type: "default",
        };

        onWalletImported(walletDetails);
      } else {
        console.error("Invalid Private Key");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-beige-200">
      <div className="bg-beige-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="block text-black text-2xl font-bold mb-2">Import Wallet</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="privateKey">
              Private Key:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              id="privateKey"
              type="text"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit" onClick={handleSubmit}
            >
              Import
            </button>
          </div>
          <div>
            <label className="block text-black text-sm font-bold mt-2 mb-2" htmlFor="privateKey">
              Public Key:
            </label>
            <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" readOnly>
            </input>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ImportWalletForm

