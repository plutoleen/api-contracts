import { UUID, ISODateString } from './shared';
import { Payment } from './payment';

//Statement entity in Eunomia
export interface Statement {
  id: UUID; // Unique statement identifier
  loan_id: UUID; // Associated loan ID
  loan_contract_id: UUID; // Associated loan contract ID
  borrower_uid: UUID; // Borrower's user ID
  status: StatementStatus; // Current statement status
  statement_date: ISODateString; // Date the statement was generated
  statement_period_start: ISODateString; // Billing period start
  statement_period_end: ISODateString; // Billing period end
  past_due_cents: number | null; // Past due carried forward in cents
  interest_accrued_cents: number; // Interest accrued during the period in cents
  remaining_balance_cents: number; // Loan balance at start of period in cents
  schedule: PaymentScheduleItem[]; // Payment schedule for the statement
  payments: Payment[]; // Payments applied to this statement
  created_at: ISODateString; // When statement was created
  updated_at: ISODateString; // When statement was last updated
}

// Statement lifecycle status
export type StatementStatus =
  | 'draft' // generated but not finalized
  | 'open' // active and due
  | 'paid' // fully paid
  | 'past_due' // overdue
  | 'closed' // closed/written off
  | 'voided'; // voided due to error or correction

export interface PaymentScheduleItem {
  due_date: ISODateString; // When payment is due
  principal_due_cents: number; // Principal portion in cents
  interest_due_cents: number; // Interest portion in cents
  fees_due_cents: number; // Fees portion in cents
  past_due_cents: number | null; // Past due amount in cents
  total_due_cents: number; // Total payment amount in cents
}

export interface StatementResult {
  statements: Statement[]; // Array of statements
  hasMore: boolean; // Whether there are more statements to fetch
  nextPageToken?: string | null; // Token for pagination to next page
}
