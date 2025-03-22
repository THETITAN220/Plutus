import { on } from "node:events";
import CheckBalanceForm from "./toolCalling/checkBalanceForm";
import ImportWalletForm from "./toolCalling/importWalletForm";
import SendETHForm from "./toolCalling/sendETHForm";
import GraphBtn from "./toolCalling/GraphBtn";

interface ToolDeciderProps {
  tools: string;
  onPaymentSuccess: (message: string) => void;
}

export default function ToolDecider({ tools, onWalletImported, onPaymentSuccess }) {
  console.log("inprop", tools);

  switch (tools) {
    case "CheckBalance":
      return (
        <div>
          <CheckBalanceForm />
        </div>
      );
    case "ImportWallet":
      return (
        <div>
          <ImportWalletForm onWalletImported={onWalletImported} />
        </div>
      );
    case "CryptoChart":
      return (
        <div>
          <GraphBtn/>
        </div>
      );
    default:
      return (
        <div>
          <SendETHForm onPaymentSuccess={onPaymentSuccess} />
        </div>
      );
  }
}
