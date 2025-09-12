// Eunomia ledger entry structure
export interface LedgerEntry {
  id: 'uuid-12345';
  debit_account_id: 'cash';
  credit_account_id: 'interest-receivables';
  amount: '200.00';
  description: 'Interest payment - Contract CONTRACT-001';
  user_id: 'system-auto';
  contract_id: 'uuid-12345';
  timestamp: '2025-08-14T16:20:01.615691';
}

current_ltv_ratio: number; // Current Loan-to-value ratio from Eunomia
interest_calculated_last_date: Date; // Last date interest was calculated from interest engine
// 5. Repayment & Loan Monitoring
outstanding_balance: number; // Calculated from Eunomia
next_payment_due_date: Date; // Next payment due date
last_payment_date: Date; // Date of last payment

//vs. demo-site- /src/lib/api/paymentHistory.ts

export interface PaymentRecord {
  id: string; // Unique payment identifier
  borrowerId: string; // Associated borrower ID from eunomia aka accountid from charon
  loanId: string; // Associated loan ID from charon
  contractId: string; // Associated loan contract ID from eunomia
  amount: number; // Total payment amount
  interestPayment: number; // Portion of payment applied to interest
  principalPayment: number; // Portion of payment applied to principal
  paymentMethod: string; // Method used for payment (e.g., ACH, wire)
  status: 'current' | 'late' | 'default'; // Current payment status
  createdAt: Date; // When payment record was created
  processedAt: Date; // When payment was processed
  userId: string; // User who made the payment
}
