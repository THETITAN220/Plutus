import CheckBalanceForm from "./toolCalling/checkBalanceForm";
import ImportWalletForm from "./toolCalling/importWalletForm";
import SendETHForm from "./toolCalling/sendETHForm";

export default function ToolDecider({ tools }) {
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
          <ImportWalletForm />
        </div>
      );
    default:
      return (
        <div>
          <SendETHForm />
        </div>
      );
  }
}