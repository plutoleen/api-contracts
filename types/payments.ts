// Payment and Transaction Types for Eunomia API
import { UUID, ISODateString, PaymentFrequency } from './shared';

export interface Payment {
  id: UUID; // Unique payment identifier
  loan_id: UUID; // Associated loan ID (from Charon)
  contract_id: UUID; // Associated loan contract ID (from Eunomia)
  borrower_id: UUID; // Borrower's user ID
  amount: number; // Total payment amount in cents
  principal_payment: number; // Portion applied to principal in cents
  interest_payment: number; // Portion applied to interest in cents
  fees_payment?: number; // Portion applied to fees in cents
  payment_method: 'ach' | 'wire' | 'check' | 'bank_transfer'; // Method used
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'; // Status
  reference_number?: string; // External payment reference
  notes?: string; // Additional notes
  processed_at?: ISODateString; // When payment was processed
  created_at: ISODateString; // When payment record was created
  updated_at: ISODateString; // Last update timestamp
}

export interface PaymentRecord {
  id: UUID; // Unique payment identifier
  borrowerId: UUID; // Associated borrower ID from eunomia aka accountid from charon
  loanId: UUID; // Associated loan ID from charon
  contractId: UUID; // Associated loan contract ID from eunomia
  amount: number; // Total payment amount
  interestPayment: number; // Portion of payment applied to interest
  principalPayment: number; // Portion of payment applied to principal
  feesPayment: number; // Portion applied to fees in cents
  paymentMethod: string; // Method used for payment (e.g., ACH, wire)
  status: 'current' | 'late' | 'default'; // Current payment status
  userId: string; // User who made the payment
  processedAt: ISODateString; // When payment was processed
  createdAt: ISODateString; // When payment record was created
  updatedAt: ISODateString; // When payment record was last updated
}

export interface PaymentRequest {
  loan_id: string; // Associated loan ID
  amount: number; // Payment amount in cents
  payment_method: 'ach' | 'wire' | 'check' | 'bank_transfer';
  reference_number?: string; // Optional external reference
  notes?: string; // Optional notes
}

export interface PaymentHistory {
  payments: Payment[];
  total_count: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface PaymentScheduleItem {
  due_date: ISODateString; // When payment is due
  principal_due: number; // Principal portion in cents
  interest_due: number; // Interest portion in cents
  total_due: number; // Total payment amount in cents
  payment_number: number; // Sequential payment number
  remaining_balance: number; // Remaining loan balance after payment
}

interface PaymentSchedule {
  date: ISODateString; // When payment is made
  loan_id: string; // Associated loan ID
  schedule: PaymentScheduleItem[];
  principal: number; // Principal portion of payment
  interest: number; // Interest portion of payment
  total: number; // Total payment amount
  remainingBalance: number; // Remaining loan balance after payment
}

calculatePaymentSchedule: (
  principal: number,
  annualInterestRate: number,
  termMonths: number,
  frequency: PaymentFrequency,
  startDate: ISODateString
): PaymentSchedule[] => {
  const schedule: PaymentSchedule[] = [];
  const periodicRate = annualInterestRate / 100 / 12;
  let remainingBalance = principal;
  const baseDate = new Date(startDate);

  switch (frequency) {
    case 'monthly': {
      // monthly payments with equal principal and interest
      const monthlyPayment =
        (principal * periodicRate * Math.pow(1 + periodicRate, termMonths)) / (Math.pow(1 + periodicRate, termMonths) - 1);
      let remainingBalance = principal;

      for (let month = 1; month <= termMonths; month++) {
        const interestPayment = remainingBalance * periodicRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;

        const paymentDate = new Date(baseDate);
        paymentDate.setMonth(paymentDate.getMonth() + month);

        schedule.push({
          date: paymentDate,
          principal: principalPayment,
          interest: interestPayment,
          total: monthlyPayment,
          remainingBalance: Math.max(0, remainingBalance),
        });
      }
      break;
    }

    case 'interest_only': {
      // Interest-only payments with balloon at maturity
      const monthlyInterest = principal * periodicRate;

      // Add interest-only payments
      for (let month = 1; month < termMonths; month++) {
        const paymentDate = new Date(baseDate);
        paymentDate.setMonth(paymentDate.getMonth() + month);

        schedule.push({
          date: paymentDate,
          principal: 0,
          interest: monthlyInterest,
          total: monthlyInterest,
          remainingBalance: principal,
        });
      }

      // Add final balloon payment
      const finalDate = new Date(baseDate);
      finalDate.setMonth(finalDate.getMonth() + termMonths);

      schedule.push({
        date: finalDate,
        principal: principal,
        interest: monthlyInterest,
        total: principal + monthlyInterest,
        remainingBalance: 0,
      });
    }

    case 'bullet': {
      // Only interest payments until maturity
      const monthlyInterest = principal * periodicRate;

      // Add interest-only payments
      for (let month = 1; month < termMonths; month++) {
        const paymentDate = new Date(baseDate);
        paymentDate.setMonth(paymentDate.getMonth() + month);

        schedule.push({
          date: paymentDate,
          principal: 0,
          interest: monthlyInterest,
          total: monthlyInterest,
          remainingBalance: principal,
        });
      }

      // Add final balloon payment
      schedule.push({
        date: new Date(baseDate),
        principal: principal,
        interest: monthlyInterest,
        total: principal + monthlyInterest,
        remainingBalance: 0,
      });
    }
  }

  return schedule;
};
