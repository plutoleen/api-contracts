export interface Account {
  //chart of accounts
  id: string; // Unique account identifier
  name: string; // Account name
  description: string; // Detailed account description
  type: 'Asset' | 'Revenue' | 'Liability' | 'Equity' | 'Expense'; // Account category type
  createdAt: Date; // When account was created
  updatedAt: Date; // When account was last updated
}

export interface AccountBalance {
  //running total of the account
  accountId: string; // Account identifier, references accounts.id
  balance: number; // Current account balance
  lastUpdated: Date; // When balance was last calculated
}

export interface GeneralLedger {
  //ledger entries
  id: string; // Unique ledger entry identifier
  debitAccountId: 'cash' | string; // Account to debit (decrease)
  creditAccountId: 'interest-receivables' | string; // Account to credit (increase)
  amount: number; // Transaction amount
  description: string; // Transaction description
  userId: 'system-auto' | string; // User associated with the entry
  contractId?: string; // Associated loan contract (if applicable)
  timestamp: Date; // When the transaction occurred
  createdAt: Date; // When entry was created
  updatedAt: Date; // When entry was last updated
}

//example accounts
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
