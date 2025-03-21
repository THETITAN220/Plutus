import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export default provider;
