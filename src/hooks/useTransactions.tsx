import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: string;
  createAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createAt'>;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (Transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export const TransactionsProvider = ({
  children,
}: TransactionsProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get('transactions')
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createAt: new Date(),
    });
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  return context;
};
