// Payment and Transaction Types for Eunomia API
import { UUID, ISODateString, PaymentFrequency, Currency } from './shared';

export interface Payment {
  id: UUID; // Unique payment identifier
  borrower_id: UUID; // Associated borrower ID from eunomia aka accountid from charon
  loan_id: UUID; // Associated loan ID from charon
  contract_id: UUID; // Associated loan contract ID from eunomia
  statement_id: UUID; // Statement ID
  payment_record: PaymentRecord; // Detailed payment record
  payment_amount_cents: number; // Total payment amount in cents, computed from paymentRecord.paymentRequest.total_payment
  remaining_balance_cents: number; // Remaining loan balance after payment
  processed_at: ISODateString; // When payment was processed or cleared
  created_at: ISODateString; // When payment record was created
  updated_at: ISODateString; // When payment record was last updated
}

export interface PaymentRecord {
  id: UUID; // Unique payment identifier
  loan_id: UUID; // Associated loan ID (from Charon)
  contract_id: UUID; // Associated loan contract ID (from Eunomia)
  borrower_id: UUID; // Borrower's user ID
  payment_request: PaymentRequest;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'; // Status
  statusReason?: string | null;
  failureCode?: string | null; // standardize codes per gateway
  externalReference?: string | null; // upstream bank/gateway id
  settlementId?: string | null; // clearing/settlement reference
  clearingNetwork?: 'ach' | 'swift' | 'fps' | 'sepa' | 'other' | null;
  idempotencyKey?: string | null; // on create
  processed_at?: ISODateString; // When payment was processed
  created_at: ISODateString; // When payment record was created
  updated_at: ISODateString; // Last update timestamp
}

export interface PaymentRequest {
  principal_payment_cents: number; // Portion applied to principal in cents
  interest_payment_cents: number; // Portion applied to interest in cents
  fees_payment_cents?: number; // Portion applied to fees in cents
  currency: Currency;
  payment_method: 'ach' | 'wire' | 'check' | 'bank_transfer'; // Method used
  reference_number?: string; // Optional external reference/payment instrument id
  notes?: string; // Optional notes
}

export interface PaymentHistory {
  payments: Payment[];
  total_count: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

/*








 example use from Firebase demo site below






*/
export interface PaymentScheduleRow {
  date: ISODateString;
  principalCents: number;
  interestCents: number;
  totalCents: number;
  remainingBalanceCents: number;
}

/**
 * Add months preserving end-of-month behavior:
 * If original date is end-of-month, the result should be end-of-month.
 */
function addMonthsPreserveEOM(dateIso: ISODateString, months: number): ISODateString {
  const d = new Date(dateIso);
  const day = d.getUTCDate();
  const month = d.getUTCMonth();
  const year = d.getUTCFullYear();

  const targetMonthIndex = month + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;

  // create tentative date on the same day
  const tentative = new Date(Date.UTC(targetYear, targetMonth, day));
  // if month shifted (i.e., overflow), back up to last day of target month
  if (tentative.getUTCMonth() !== targetMonth) {
    // last day of target month
    const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    return new Date(Date.UTC(targetYear, targetMonth, lastDay)).toISOString();
  }
  return tentative.toISOString();
}

/**
 * Calculate periodic rate denominator (periods per year) and months per period.
 */
function frequencyToPeriodsPerYear(frequency: PaymentFrequency): { periodsPerYear: number; monthsPerPeriod: number } {
  switch (frequency) {
    case 'monthly':
      return { periodsPerYear: 12, monthsPerPeriod: 1 };
    case 'quarterly':
      return { periodsPerYear: 4, monthsPerPeriod: 3 };
    case 'annually':
      return { periodsPerYear: 1, monthsPerPeriod: 12 };
    case 'interest_only':
    case 'bullet':
      // treat interest calculations monthly by default (but schedule will use months increment)
      return { periodsPerYear: 12, monthsPerPeriod: 1 };
    default:
      return { periodsPerYear: 12, monthsPerPeriod: 1 };
  }
}

/**
 * principalCents: integer cents
 * annualInterestRateBps: basis points (e.g., 250 = 2.50%)
 * termMonths: total months until maturity
 * frequency: PaymentFrequency
 * startDateIso: ISO date string of the loan start / first period base
 */
export function calculatePaymentSchedule(
  principalCents: number,
  annualInterestRateBps: number,
  termMonths: number,
  frequency: PaymentFrequency,
  startDateIso: ISODateString
): PaymentScheduleRow[] {
  const schedule: PaymentScheduleRow[] = [];
  const { periodsPerYear, monthsPerPeriod } = frequencyToPeriodsPerYear(frequency);

  // Convert annual rate bps to decimal periodic rate:
  // annualRateDecimal = annualInterestRateBps / 10000.0
  // periodicRate = annualRateDecimal / periodsPerYear
  const annualRateDecimal = annualInterestRateBps / 10000;
  const periodicRate = annualRateDecimal / periodsPerYear;

  // number of payment periods:
  const numPeriods = Math.ceil(termMonths / monthsPerPeriod);

  // For amortizing loans (standard), compute periodic payment in cents using formula:
  // payment = principal * r / (1 - (1+r)^-n)
  // We compute payment in cents and round to nearest cent.
  let periodicPaymentCents = 0;
  if (frequency === 'monthly' || frequency === 'quarterly' || frequency === 'annually') {
    if (periodicRate === 0) {
      periodicPaymentCents = Math.round(principalCents / numPeriods);
    } else {
      const r = periodicRate;
      const n = numPeriods;
      // compute using floating math but round to cents at the end
      const payment = (principalCents * r) / (1 - Math.pow(1 + r, -n));
      periodicPaymentCents = Math.round(payment);
    }
  }

  // We'll track remaining balance in cents
  let remaining = principalCents;

  // Build schedule per period
  for (let period = 1; period <= numPeriods; period++) {
    // compute payment date
    const monthsToAdd = period * monthsPerPeriod;
    const dueDate = addMonthsPreserveEOM(startDateIso, monthsToAdd);

    let interestForPeriodCents = Math.round(remaining * periodicRate);
    let principalForPeriodCents = 0;
    let totalCents = 0;

    if (frequency === 'interest_only' || frequency === 'bullet') {
      // interest-only periods: interest each period, principal only at maturity
      if (period < numPeriods) {
        principalForPeriodCents = 0;
        totalCents = interestForPeriodCents;
      } else {
        // final balloon
        principalForPeriodCents = remaining;
        totalCents = interestForPeriodCents + principalForPeriodCents;
      }
    } else {
      // amortizing periodic payment
      // default: use computed periodicPaymentCents; but for last period, adjust to zero the balance (rounding)
      if (period < numPeriods) {
        principalForPeriodCents = periodicPaymentCents - interestForPeriodCents;
        totalCents = periodicPaymentCents;
      } else {
        // last period: pay off remaining (handle rounding residue)
        principalForPeriodCents = remaining;
        totalCents = interestForPeriodCents + principalForPeriodCents;
      }
    }

    // guard: ensure principal not negative
    if (principalForPeriodCents < 0) {
      principalForPeriodCents = 0;
      totalCents = interestForPeriodCents;
    }

    remaining = Math.max(0, remaining - principalForPeriodCents);

    schedule.push({
      date: dueDate,
      principalCents: principalForPeriodCents,
      interestCents: interestForPeriodCents,
      totalCents,
      remainingBalanceCents: remaining,
    });
  }

  return schedule;
}
