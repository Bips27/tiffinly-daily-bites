import React, { useState } from 'react';
import { ArrowLeft, Plus, CreditCard, Smartphone, Wallet as WalletIcon, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';

const rechargeAmounts = [100, 250, 500, 1000, 2000];

export const Wallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { balance, transactions, loading, rechargeWallet } = useWallet();
  
  const [showRecharge, setShowRecharge] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleRecharge = async () => {
    const amount = selectedAmount || parseInt(customAmount);
    
    if (!amount || amount < 50) {
      toast({
        title: "Invalid Amount",
        description: "Minimum recharge amount is ₹50",
        variant: "destructive",
      });
      return;
    }

    if (amount > 10000) {
      toast({
        title: "Amount Too High",
        description: "Maximum recharge amount is ₹10,000",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    const result = await rechargeWallet(amount);
    
    if (result.success) {
      toast({
        title: "Wallet Recharged",
        description: `₹${amount} added to your wallet successfully`,
      });
      setShowRecharge(false);
      setSelectedAmount(null);
      setCustomAmount('');
    } else {
      toast({
        title: "Recharge Failed",
        description: result.error || "Please try again",
        variant: "destructive",
      });
    }
    setProcessing(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? ArrowDownLeft : ArrowUpRight;
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-success' : 'text-destructive';
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border p-4 z-40">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Wallet</h1>
              <p className="text-sm text-muted-foreground">Manage your balance</p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-6 pb-6">
          {/* Balance Card */}
          <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <WalletIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-primary-foreground/80">Available Balance</p>
                  <p className="text-3xl font-bold">₹{balance.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
              onClick={() => setShowRecharge(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Money
            </Button>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="p-4 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={() => setShowRecharge(true)}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-6 h-6 text-success" />
                </div>
                <h4 className="font-semibold mb-1">Recharge</h4>
                <p className="text-sm text-muted-foreground">Add money</p>
              </div>
            </Card>
            
            <Card 
              className="p-4 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={() => {/* Scroll to transactions */}}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">History</h4>
                <p className="text-sm text-muted-foreground">View transactions</p>
              </div>
            </Card>
          </div>

          {/* Transaction History */}
          <section>
            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <EmptyState
                icon={History}
                title="No Transactions"
                description="Your wallet transactions will appear here"
                actionText="Add Money"
                onAction={() => setShowRecharge(true)}
              />
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.type);
                  return (
                    <Card key={transaction.id} className="p-4 shadow-card">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-success/10' : 'bg-destructive/10'
                        }`}>
                          <Icon className={`w-5 h-5 ${getTransactionColor(transaction.type)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{transaction.description}</h4>
                          <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Recharge Modal */}
      <ConfirmationDialog
        open={showRecharge}
        onOpenChange={setShowRecharge}
        title="Recharge Wallet"
        description="Select amount to add to your wallet"
        confirmText={processing ? "Processing..." : "Recharge Now"}
        cancelText="Cancel"
        variant="success"
        onConfirm={handleRecharge}
      />
    </>
  );
};