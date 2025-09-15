import { UUID, ISODateString } from './shared';
export interface Statement {
  id: UUID; // Unique statement identifier
  loan_id: UUID; // Associated loan ID
  loan_contract_id: UUID; // Associated loan contract ID
  borrower_uid: UUID; // Borrower's user ID
  statement_date: Date; // Date the statement was generated
  statement_period_start: Date; // Start date of the statement period
  statement_period_end: Date; // End date of the statement period
  due_date: Date; // When payment for current statement is due
  interest_accrued: number; // Interest amount accrued
  principal_due: number; // Principal amount due
  interest_due: number; // Interest amount due
  fees_due: number; // Fees amount due
  total_due: number; // Total amount due (principal + interest + fees)
  amount_repaid: number; // Amount already repaid
  remaining_balance: number; // Remaining balance of the loan
  status: 'pending' | 'paid' | 'overdue'; // Current payment status
  createdAt: ISODateString; // When statement was created
}

export interface StatementResult {
  statements: Statement[]; // Array of statements
  hasMore: boolean; // Whether there are more statements to fetch
  nextPageToken?: string | null; // Token for pagination to next page
}
