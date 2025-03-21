"use client"
import { restoreWallet } from "@/utils/wallet"
import { useState } from "react"

const ImportWalletForm = () => {
  const [privateKey, setPrivateKey] = useState("")

  const handleSubmit = async () => {

    try{
    const import_response = await restoreWallet(privateKey);
    if (import_response && import_response.address) {
      const walletDetails = {
        address: import_response.address,
        privateKey: import_response.privateKey,
        type: "default",
      };
        return walletDetails.address;
    }
}
    catch(error)
    {
        console.error(error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="block text-gray-700 text-sm font-bold mb-2">Import Wallet</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="privateKey">
              Private Key:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="privateKey"
              type="text"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit" onClick={handleSubmit}
            >
              Import
            </button>
          </div>
          <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="privateKey">
              Public Key:
            </label>
            <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"readOnly>
            </input>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ImportWalletForm

