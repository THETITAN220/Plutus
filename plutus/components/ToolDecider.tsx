import { on } from "node:events";
import CheckBalanceForm from "./toolCalling/checkBalanceForm";
import ImportWalletForm from "./toolCalling/importWalletForm";
import SendETHForm from "./toolCalling/sendETHForm";

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
    default:
      return (
        <div>
          <SendETHForm onPaymentSuccess={onPaymentSuccess}/>
        </div>
      );
  }
}
