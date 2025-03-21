"use client"

import { useState } from "react"

const ImportWalletForm = () => {
  const [privateKey, setPrivateKey] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    // Implement wallet import logic here
    console.log("Importing wallet with private key:", privateKey)
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="block text-gray-700 text-sm font-bold mb-2">Import Wallet</h2>
        <form onSubmit={handleSubmit}>
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
              type="submit"
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ImportWalletForm

