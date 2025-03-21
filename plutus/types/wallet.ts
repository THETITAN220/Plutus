export interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: string;
    gasPrice: string;
    gasLimit: string;
    data?: string;
    nonce: number;
    timestamp: number;
    status: 'pending' | 'confirmed' | 'failed';
    hash?: string;
  }
  
  export interface Account {
    address: string;
    privateKey: string;
    balance: string;
    transactions: Transaction[];
  }
  
  export interface WalletState {
    accounts: Account[];
    selectedAccount: number;
    network: 'mainnet' | 'testnet' | 'local';
    isUnlocked: boolean;
    seedPhrase?: string;
  }