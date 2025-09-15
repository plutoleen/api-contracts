export type UUID = string; // format: uuidv4
export type ISODateString = string; // format: ISO 8601 UTC

export type ApplicationStatus =
  | 'draft'
  | 'pending'
  | 'manual_review'
  | 'offered'
  | 'accepted'
  | 'funded'
  | 'rejected'
  | 'cancelled';

export type LoanStatus = 'unsigned' | 'signed' | 'disbursed' | 'closed';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'SEK' | 'NZD';

export type PaymentFrequency = 'monthly' | 'quarterly' | 'annually' | 'bullet' | 'interest_only';
export type PaymentStructure = 'monthly_interest_principal_maturity' | 'amortized_interest_principal_maturity';

export interface SofrSnapshot {
  sofrRate: number; // numeric (e.g., 0.03 for 3.0%) - Current SOFR (Secured Overnight Financing Rate)
  lastUpdatedAt: ISODateString; // Date this SOFR rate was last updated (provided by the SOFR API)
}

export interface InterestRateSnapshot {
  baseRate: SofrSnapshot; // Index/benchmark SOFR/LIBOR rate at offer time
  spreadBps: number; // lender’s margin/markup over the base rate in basis points for precision (e.g., 150 = 1.50%)
  nominalRateBps: number; // Combined rate of interest (base rate + spread) used for repayment calculations
  aprBps: number; // APR in basis points to avoid float precision for regulatory disclosures/compliance which bakes in fees, compounding, etc.
  lastUpdated: ISODateString;
}
