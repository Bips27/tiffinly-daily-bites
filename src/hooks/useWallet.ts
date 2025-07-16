import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

export const useWallet = () => {
  const [balance, setBalance] = useState(1250);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      type: 'debit',
      amount: 50,
      description: 'Meal customization charge',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: 'TXN002',
      type: 'credit',
      amount: 500,
      description: 'Wallet recharge',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'completed'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const rechargeWallet = async (amount: number) => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTransaction: Transaction = {
        id: `TXN${Date.now()}`,
        type: 'credit',
        amount,
        description: `Wallet recharge`,
        date: new Date(),
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev + amount);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Payment failed' };
    } finally {
      setLoading(false);
    }
  };

  const debitAmount = async (amount: number, description: string) => {
    if (balance < amount) {
      return { success: false, error: 'Insufficient balance' };
    }

    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'debit',
      amount,
      description,
      date: new Date(),
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev - amount);
    return { success: true };
  };

  return {
    balance,
    transactions,
    loading,
    rechargeWallet,
    debitAmount
  };
};