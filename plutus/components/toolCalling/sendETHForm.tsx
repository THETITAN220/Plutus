export default function sendETHForm() {
    return(
        <>
             <div className="flex flex-col items-center justify-center bg-gray-100">
                <div className="w-96 bg-black p-8 rounded-lg shadow-lg font-bold">
                        <label className="text-white">Receiver Address</label>
                        <input placeholder="0x....." type="text" className="w-full border text-white font-thin border-gray-500 rounded-lg p-2 mt-1 hover:shadow-lg" />

                        <label className="text-white">Amount</label>
                        <input type="text" className="w-full border text-white font-thin border-gray-500 rounded-lg p-2 mt-1 hover:shadow-lg" />

                        <button type = "submit" className = "w-full bg-orange-600 text-white p-2 mt-2 rounded-lg">Send ETH</button>
                </div>
             </div>
        </>
           )
}
