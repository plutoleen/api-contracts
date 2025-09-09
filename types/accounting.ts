export interface Account {
  id: string; // Unique account identifier
  name: string; // Account name
  description: string; // Detailed account description
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'; // Account category type
  createdAt: Date; // When account was created
  updatedAt: Date; // When account was last updated
}

export interface GeneralLedgerEntry {
  id: string; // Unique ledger entry identifier
  timestamp: Date; // When the transaction occurred
  debitAccountId: string; // Account to debit (decrease)
  creditAccountId: string; // Account to credit (increase)
  amount: number; // Transaction amount
  description: string; // Transaction description
  userId: string; // User who created the entry
  contractId?: string; // Associated loan contract (if applicable)
  createdAt: Date; // When entry was created
  updatedAt: Date; // When entry was last updated
  createdBy: data.createdBy || data.userId,
};

export interface AccountBalance {
  accountId: string; // Account identifier
  balance: number; // Current account balance
  lastUpdated: Date; // When balance was last calculated
}

const accounts = [
  {
    id: 'interest-receivables',
    name: 'Interest Receivables',
    description: 'Interest that Customers owe to Pluto',
    type: 'Asset',
  },
  {
    id: 'interest-earned',
    name: 'Interest Earned',
    description: 'Interest that Pluto has earned from Customers',
    type: 'Revenue',
  },
  {
    id: 'loans-outstanding',
    name: 'Loans Outstanding',
    description: 'Loans that Pluto has made to Customers',
    type: 'Asset',
  },
];
