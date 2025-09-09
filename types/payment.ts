export interface PaymentRecord {
  id: string; // Unique payment identifier
  loanId: string; // Associated loan ID
  contractId: string; // Associated loan contract ID
  amount: number; // Total payment amount
  interestPayment: number; // Portion of payment applied to interest
  principalPayment: number; // Portion of payment applied to principal
  paymentMethod: string; // Method used for payment (e.g., ACH, wire)
  status: string; // Payment processing status
  createdAt: Date; // When payment record was created
  processedAt: Date; // When payment was processed
  userId: string; // User who made the payment
}

type PaymentFrequency = 'monthly' | 'quarterly' | 'annually' | 'bullet' | 'interest_only'; // How often payments are due

// Payment schedule types
interface PaymentSchedule {
  date: Date; // When payment is due
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
  startDate: Date
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
