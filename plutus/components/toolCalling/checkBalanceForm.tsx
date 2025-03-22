"use client"

import type React from "react"
import { useState } from "react"
import { getBalance } from "@/utils/wallet"

interface CheckBalanceFormProps {
  onSubmit: (accountNumber: string) => void
}

const CheckBalanceForm: React.FC<CheckBalanceFormProps> = ({ onSubmit }) => {
  
  const [accountNumber, setAccountNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const balRes = getBalance(accountNumber)
    console.log("Balance: ", balRes)
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Check Account Balance</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountNumber">
              Account Number:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="accountNumber"
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Check Balance
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckBalanceForm

