import { ISODateString, UUID } from './shared';

//Chart of accounts entity in Eunomia
export interface ChartOfAccounts {
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
  accountName: string; // Account name
  balanceCents: number; // Current account balance in cents
  lastUpdated: ISODateString; // When balance was last calculated
}

export interface EunomiaAccountBalanceResponse {
  accountId: string; // Account identifier
  accountName: string; // Account name
  balance: string; // Current balance (Decimal as string)
  lastUpdated: ISODateString; // Last update timestamp
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
