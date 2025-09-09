export interface Statement {
  id: string; // Unique statement identifier
  loan_contract_id: string; // Associated loan contract ID
  loan_id: string; // Associated loan ID
  borrower_uid: string; // Borrower's user ID
  statement_date: Date; // Date the statement was generated
  due_date: Date; // When payment is due
  principal_due: number; // Principal amount due
  interest_due: number; // Interest amount due
  fees_due: number; // Fees amount due
  total_due: number; // Total amount due (principal + interest + fees)
  amount_repaid: number; // Amount already repaid
  status: 'pending' | 'paid' | 'overdue'; // Current payment status
  createdAt: Date; // When statement was created
}

export interface StatementResult {
  statements: Statement[]; // Array of statements
  hasMore: boolean; // Whether there are more statements to fetch
  nextPageToken?: string | null; // Token for pagination to next page
}
