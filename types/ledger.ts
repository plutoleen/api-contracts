import { UUID, ISODateString } from './shared';

//General ledger entity in Eunomia
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

export interface EunomiaLedgerEntryResponse {
  id: string; // Ledger entry ID
  debitAccountId: string; // Debit account
  creditAccountId: string; // Credit account
  amount: string; // Transaction amount (Decimal as string)
  description: string; // Transaction description
  userId: string; // User who created the entry
  contractId: string; // Associated contract ID
  timestamp: ISODateString; // Transaction timestamp
}

export interface EunomiaDisburseRequest {
  contractId: string; // Contract ID from Charon DB
  intRateBps: number; // Interest rate in basis points
  inceptFeeBps: number; // Inception fee in basis points
  contractTerms: string; // JSON blob of contract terms
  borrowerId: string; // Charon ID of the borrower
}

export interface EunomiaDisburse {
  contractId: string; // Contract ID
  loanContractId: string; // Internal loan contract ID
  borrowerId: string; // Borrower ID
  loanAmount: string; // Loan amount (Decimal as string)
  baseRateBps: number; // Base SOFR rate in basis points
  spreadBps: number; // Interest rate spread in basis points
  totalRateBps: number; // Total interest rate in basis points
  inceptFeeBps: number; // Inception fee in basis points
  inceptFeeAmount: string; // Inception fee amount (Decimal as string)
  disbursementDate: ISODateString; // When loan was disbursed
  ledgerEntries: number; // Number of ledger entries created
}
