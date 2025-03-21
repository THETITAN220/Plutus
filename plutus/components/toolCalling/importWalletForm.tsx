export default function ImportWalletForm() {
    return(
        <>
             <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="w-96 bg-black p-8 rounded-lg shadow-lg font-bold">
                        <label className="text-white">Private Key</label>
                        <input type="text" placeholder="Enter your private key here" className="w-full border text-white font-thin border-gray-500 rounded-lg p-2 mt-1 hover:shadow-lg" />
                        <button type = "submit" className = "w-full bg-orange-600 text-white p-2 mt-2 rounded-lg">Import Wallet</button>
                </div>
             </div>
        </>
           )
}
