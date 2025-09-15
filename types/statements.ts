import { UUID, ISODateString } from './shared';
import { Payment } from './payments';
export interface Statement {
  id: UUID; // Unique statement identifier
  loan_id: UUID; // Associated loan ID
  loan_contract_id: UUID; // Associated loan contract ID
  borrower_uid: UUID; // Borrower's user ID
  statement_date: Date; // Date the statement was generated
  statement_period_start: Date; // Start date of the statement period
  statement_period_end: Date; // End date of the statement period
  payments_due: PaymentScheduleItem[]; // Payments due for the statement
  payments_paid: Payment[]; // Payments paid for the statement
  interest_accrued_cents: number; // Interest amount accrued in cents
  remaining_balance_cents: number; // Remaining loan balance at statement opening date in cents
  status: 'current' | 'paid' | 'past_due'; // Current statement status
  created_at: ISODateString; // When statement was created
  updated_at: ISODateString; // When statement was last updated
}

export interface PaymentScheduleItem {
  due_date: ISODateString; // When payment is due
  principal_due_cents: number; // Principal portion in cents
  interest_due_cents: number; // Interest portion in cents
  fees_due_cents: number; // Fees portion in cents
  total_due_cents: number; // Total payment amount in cents
}
export interface StatementResult {
  statements: Statement[]; // Array of statements
  hasMore: boolean; // Whether there are more statements to fetch
  nextPageToken?: string | null; // Token for pagination to next page
}
