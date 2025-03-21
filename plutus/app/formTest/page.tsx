import ImportWalletForm from "@/components/toolCalling/importWalletForm";
import SendETHForm from "@/components/toolCalling/sendETHForm";
import CheckBalanceForm from "@/components/toolCalling/checkBalanceForm";

export default function Page() {
    return(
        <>
                <div>
                    <>
                    <ImportWalletForm />
                    <SendETHForm />
                    <CheckBalanceForm />
                    </>
                </div>
             
        </>
           )
}