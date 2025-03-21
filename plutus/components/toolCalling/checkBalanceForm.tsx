export default function checkBalanceForm() {
    return(
        <>
             <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="w-96 bg-black p-8 rounded-lg shadow-lg font-bold">
                        <label className="text-white">Balance</label>
                        <input type="text" className="w-full border text-white font-thin rounded-lg p-2 mt-1 hover:shadow-lg" readOnly />
                        
                </div>
             </div>
        </>
           )
}
