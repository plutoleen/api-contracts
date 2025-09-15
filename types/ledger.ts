import { UUID, ISODateString } from './shared';
export interface Account {
  //chart of accounts
  id: UUID; // Unique account identifier
  name: string; // Account name
  description: string; // Detailed account description
  type: 'Asset' | 'Revenue' | 'Liability' | 'Equity' | 'Expense'; // Account category type
  createdAt: ISODateString; // When account was created
  updatedAt: ISODateString; // When account was last updated
}

export interface AccountBalance {
  //running total of the account
  accountId: UUID; // Account identifier, references accounts.id
  balanceCents: number; // Current account balance in cents
  lastUpdated: ISODateString; // When balance was last calculated
}

export interface GeneralLedger {
  //ledger entries
  id: UUID; // Unique ledger entry identifier
  loanId?: UUID; // Associated loan (if applicable)
  userId: 'system-auto' | string; // User associated with the entry
  amountCents: number; // Transaction amount in cents
  debitAccountId: 'cash' | string; // Account to debit (decrease)
  creditAccountId: 'interest-receivables' | string; // Account to credit (increase)
  description: string; // Transaction description
  timestamp: ISODateString; // When the transaction occurred
  createdAt: ISODateString; // When entry was created
  updatedAt: ISODateString; // When entry was last updated
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
