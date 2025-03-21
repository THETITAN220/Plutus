// pages/index.tsx

"use client"
import {generateWallet, getBalance, restoreWallet} from "@/utils/wallet"
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { ethers } from "ethers";
import { getStorageItem, setStorageItem, removeStorageItem} from "@/lib/localStorage";

type Message = {
  type: 'user' | 'bot';
  text: string;
};

type WalletState = {
  address: string;
  privateKey?: string;
  mnemonic?: string;
  provider?: ethers.BrowserProvider;
  signer?: ethers.JsonRpcSigner;
  type: "default" | "metamask";
} | null;

const STORAGE_KEY = 'walletState';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Hello! I\'m Plutus, your crypto assistant. I can help you manage an Ethereum wallet. Type "create wallet" to get started.' }
  ]);
  const [walletState, setWalletState] = useState<WalletState>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedWalletState = getStorageItem<WalletState>(STORAGE_KEY);
    if (storedWalletState) {
      setWalletState(storedWalletState);
    }
  }, []);

  useEffect(() => {
    if (walletState) {
      setStorageItem(STORAGE_KEY, walletState);
    } else {
      removeStorageItem(STORAGE_KEY);
    }
  }, [walletState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCommand = async (command: string) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: command }]);
    
    let botResponse = '';
    const lowerCommand = command.toLowerCase();

    try {
      // Handle different commands
      if (lowerCommand.includes('create wallet') || lowerCommand.includes('new wallet')) {
        try {
          const walletData = await generateWallet();
          
          if (walletData && walletData.address) {
            setWalletState({
              address: walletData.address,
              privateKey: walletData.privateKey,
              type: "default"
            });
            
            botResponse = `New wallet created!\nAddress: ${walletData.address}\nPrivate Key: ${walletData.privateKey}\n\nWARNING: Save your private key securely. It will not be shown again!`;
          } else {
            botResponse = 'Failed to create wallet: Unknown error';
          }
        } catch (error) {
          botResponse = `Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
      } 
      else if (lowerCommand.includes('import wallet') && lowerCommand.includes('key')) {
        // Extract private key - very basic implementation
        const keyMatch = command.match(/key\s+([0-9a-fx]+)/i);
        if (!keyMatch || !keyMatch[1]) {
          botResponse = 'Please provide a private key in the format: import wallet key YOUR_PRIVATE_KEY';
        } else {
          const privateKey = keyMatch[1];
          
          try {
            const walletData = await restoreWallet(privateKey);
            
            if (walletData && walletData.address) {
              setWalletState({
                address: walletData.address,
                privateKey: privateKey,
                type: "default"
              });
              
              botResponse = `Wallet imported!\nAddress: ${walletData.address}`;
            } else {
              botResponse = 'Failed to import wallet: Invalid private key';
            }
          } catch (error) {
            botResponse = `Failed to import wallet: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        }
      }
      else if (lowerCommand.includes('balance') || lowerCommand.includes('how much')) {
        if (!walletState?.address) {
          botResponse = 'Please create or import a wallet first.';
        } else {
          try {
            const balanceData = await getBalance(walletState.address);
            
            if (balanceData !== undefined) {
              botResponse = `Current balance: ${balanceData} ETH`;
            } else {
              botResponse = 'Failed to get balance: Unknown error';
            }
          } catch (error) {
            botResponse = `Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        }
      }
      else if (lowerCommand.includes('send') || lowerCommand.includes('transfer')) {
        if (!walletState?.address || !walletState?.privateKey) {
          botResponse = 'Please create or import a wallet first.';
        } else {
          // Very basic parsing - in a real app, use a more robust approach
          const toMatch = command.match(/to\s+(0x[a-f0-9]{40})/i);
          const amountMatch = command.match(/(\d+\.?\d*)\s*eth/i);
          
          if (!toMatch || !amountMatch) {
            botResponse = 'Please specify recipient and amount in the format: send 0.1 ETH to 0x...';
          } else {
            const to = toMatch[1];
            const amount = amountMatch[1];
            
            try {
              const response = await fetch("/api/sendTx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  from: walletState.address,
                  privateKey: walletState.privateKey,
                  to: to,
                  amount: amount,
                }),
              });
              
              const result = await response.json();
              
              if (result.success) {
                botResponse = `Transaction sent!\nAmount: ${amount} ETH\nTo: ${to}\nTransaction Hash: ${result.txHash}`;
              } else {
                botResponse = `Failed to send transaction: ${result.error || 'Unknown error'}`;
              }
            } catch (error) {
              botResponse = `Failed to send transaction: ${error instanceof Error ? error.message : 'Unknown error'}`;
            }
          }
        }
      }
      else if (lowerCommand.includes('help')) {
        botResponse = 'Available commands:\n- create wallet: Create a new Ethereum wallet\n- import wallet key YOUR_PRIVATE_KEY: Import an existing wallet\n- balance: Check your wallet balance\n- send 0.1 ETH to 0xADDRESS: Send Ethereum\n- help: Show this help message';
      }
      else {
        botResponse = `I didn't understand that command. Type "help" to see available commands.`;
      }
    } catch (error) {
      console.error('Error handling command:', error);
      botResponse = 'Something went wrong. Please try again.';
    }

    // Add bot response
    setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    
    // Clear input
    setInput('');
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Head>
        <title>Plutus | Ethereum Wallet Assistant</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <main className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-4 font-['Poppins']">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 text-transparent bg-clip-text">Plutus</h1>
          </div>
          <div className="text-sm text-gray-500">Ethereum Wallet Assistant</div>
        </div>
        
        {walletState?.address && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-6 border-l-4 border-orange-500 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="mr-3 bg-orange-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ACTIVE WALLET</p>
                <p className="text-sm font-mono text-gray-800 break-all">{walletState.address}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-grow bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-orange-100">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-white flex items-center">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="font-medium">Chat with Plutus</span>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-orange-50/50 to-transparent">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`mb-4 ${msg.type === 'user' ? 'text-right' : ''}`}
              >
                <div className="inline-flex items-start max-w-[80%]">
                  {msg.type === 'bot' && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-2 mt-1 shadow-sm flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  
                  <div 
                    className={`px-4 py-3 rounded-xl shadow-sm ${
                      msg.type === 'user' 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-sm">{msg.text}</pre>
                  </div>
                  
                  {msg.type === 'user' && (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 mt-1 shadow-sm flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="border-t p-3 bg-white">
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                if (input.trim()) handleCommand(input);
              }}
              className="flex"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a command or ask for help..."
                className="flex-grow border border-gray-200 text-black rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3 rounded-r-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-6 bg-white p-3 rounded-xl shadow-sm border border-orange-100">
          <div className="flex items-center text-sm text-gray-500">
            <div className="mr-2 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p>Try saying "create wallet", "check balance", or "help" to see all commands</p>
          </div>
        </div>
      </main>
    </div>
  );
}