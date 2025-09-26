import { ISODateString } from './shared';

export interface BenchmarkRateSnapshot {
  rate: number; // numeric (e.g., 0.03 for 3.0%) - Current SOFR (Secured Overnight Financing Rate)
  index: 'sofr' | 'libor'; // Index/benchmark SOFR/LIBOR rate at offer time
  effectiveDate: ISODateString; // Date this SOFR rate was last updated (provided by the SOFR API)
}

export interface InterestRateSnapshot {
  baseRate: BenchmarkRateSnapshot; // Index/benchmark SOFR/LIBOR rate at offer time
  spreadBps: number; // lender’s margin/markup over the base rate in basis points for precision (e.g., 150 = 1.50%)
  nominalRateBps: number; // Combined rate of interest (base rate + spread) used for repayment calculations
  aprBps: number; // APR in basis points to avoid float precision for regulatory disclosures/compliance which bakes in fees, compounding, etc.
  lastUpdated: ISODateString;
}

export interface EunomiaInterestCalculationRequest {
  contractId: string; // Contract ID to calculate interest for
  calculationDate: string; // Date to calculate interest for (YYYY-MM-DD)
  forceRefresh?: boolean; // Whether to force refresh SOFR rates
}

export interface EunomiaInterestPostingRequest {
  contractId: string; // Contract ID to post interest for
  calculationDate: string; // Date to post interest for (YYYY-MM-DD)
}

//sofr rate entity in Eunomia
export interface EunomiaSOFRRate {
  id: number; // Auto-incrementing ID
  rateDate: string; // Date the rate applies to (Date as string)
  rate1d?: string; // 1-day SOFR rate (Decimal as string)
  rate30d?: string; // 30-day average SOFR rate (Decimal as string)
  rate90d?: string; // 90-day average SOFR rate (Decimal as string)
  publishDate: ISODateString; // When FRBNY published this rate
  source?: string; // Source of the rate data (default: "FRBNY")
  createdAt?: ISODateString; // When record was created
  updatedAt?: ISODateString; // When record was last updated
}

export interface EunomiaForecastRequest {
  forecastDays: number; // Number of days to forecast (1-365)
  forecastDate?: string; // Start date for forecast (YYYY-MM-DD)
}

export interface EunomiaForecastDayResponse {
  day: number; // Day number in forecast
  balance: string; // Starting balance for this day (Decimal as string)
  dailyInterest: string; // Interest calculated for this day (Decimal as string)
  newBalance: string; // Ending balance for this day (Decimal as string)
}

export interface EunomiaForecastResponse {
  success: boolean; // Operation success status
  contractId: string; // Contract ID
  forecastDays: number; // Number of days forecasted
  forecastDate: string; // Start date of forecast
  currentBalance: string; // Current outstanding balance (Decimal as string)
  currentSofrRate: string; // Current SOFR rate used (Decimal as string)
  spread: string; // Contract spread (Decimal as string)
  totalRate: string; // Total interest rate (Decimal as string)
  dailyRates: EunomiaForecastDayResponse[]; // Daily forecast details
  totalForecastInterest: string; // Total interest over forecast period (Decimal as string)
  finalBalance: string; // Final balance after forecast period (Decimal as string)
}

export interface EunomiaInterestCalculationResponse {
  success: boolean; // Operation success status
  contractId: string; // Contract ID
  calculationDate: string; // Date interest was calculated for
  dailyInterest: string; // Daily interest amount (Decimal as string)
  baseRate: string; // Base SOFR rate (Decimal as string)
  spread: string; // Interest rate spread (Decimal as string)
  totalRate: string; // Total interest rate (Decimal as string)
  loanAmount: string; // Loan amount (Decimal as string)
  alreadyPosted: boolean; // Whether interest was already posted
  postedToLedger: boolean; // Whether interest was posted to ledger
  postingTimestamp?: string; // When interest was posted
}

export interface EunomiaAccruedInterestResponse {
  success: boolean; // Operation success status
  contractId: string; // Contract ID
  asOfDate: string; // Date as of which interest was calculated
  totalAccruedInterest: string; // Total accrued interest (Decimal as string)
  entryCount: number; // Number of interest entries
  loanAmount: string; // Loan amount (Decimal as string)
  totalInterestRate: string; // Total interest rate (Decimal as string)
}

export interface EunomiaInterestPostingResponse {
  success: boolean; // Operation success status
  contractId: string; // Contract ID
  postingDate: string; // Date interest was posted for
  dailyInterest: string; // Daily interest amount (Decimal as string)
  totalAccruedInterest: string; // Total accrued interest (Decimal as string)
  ledgerEntries: number; // Number of ledger entries created
  message: string; // Success message
}

export interface EunomiaInterestScheduleResponse {
  success: boolean; // Operation success status
  contractId: string; // Contract ID
  scheduleStartDate: string; // Start date of schedule
  scheduleEndDate: string; // End date of schedule
  totalDays: number; // Total days in schedule
  dailyInterest: string; // Daily interest amount (Decimal as string)
  totalInterest: string; // Total interest over period (Decimal as string)
  currentBalance: string; // Current outstanding balance (Decimal as string)
  finalBalance: string; // Final balance after interest (Decimal as string)
}
