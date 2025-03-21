export default function ImportWalletForm() {
    return(
        <>
             <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="w-96 bg-black p-8 rounded-lg shadow-lg font-bold">
                        <label className="text-white">Private Key</label>
                        <input type="text" className="w-full border border-gray-500 rounded-lg p-2 mt-1 hover:shadow-lg" />
                        <button type = "submit" className = "w-full bg-orange text-white rounded-lg p-2 mt-4 hover:shadow-lg border-gray-300">Import Wallet</button>
                </div>
             </div>
        </>
           )
}
