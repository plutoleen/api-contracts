import { UUID, ISODateString } from './shared';

export interface EunomiaContractResponse {
  id: string; // Contract ID
  loanContractId: string; // Loan contract identifier
  status: 'draft' | 'active' | 'matured' | 'defaulted'; // Contract status
  loanAmount: string; // Loan amount in USD (Decimal as string)
  interestRate: string; // Interest rate percentage (Decimal as string)
  interestRateSpread: string; // Interest rate spread in basis points (Decimal as string)
  maturityDate: ISODateString; // Contract maturity date
  createdAt: ISODateString; // Creation timestamp
}

//loan contract entity in eunomia
export interface EunomiaLoanContract {
  id: UUID; // Internal UUID, not business constraint
  loanContractId: UUID; // Business constraint: each loan ID must be unique
  borrowerId?: UUID; // Borrower's ID from users.uid

  // Key Financial Terms (extracted for reporting/analysis)
  loanAmount: string; // Loan amount (Decimal as string)
  pledgedAssetsNav?: string; // Pledged assets NAV (Decimal as string)
  loanToValueRatio?: string; // Loan-to-value ratio (Decimal as string)
  interestRateSpread?: string; // Interest rate spread (Decimal as string)
  baseRateValue?: string; // Base rate value (Decimal as string)
  totalInterestRate?: string; // Total interest rate (Decimal as string)
  upfrontFeePercentage?: string; // Upfront fee percentage (Decimal as string)
  upfrontFeeAmount?: string; // Upfront fee amount (Decimal as string)

  // Contract Status and Dates
  contractStatus: 'draft' | 'active' | 'matured' | 'defaulted'; // 'draft', 'active', 'matured', 'defaulted'
  effectiveDate?: string; // Effective date (Date as string) TODO: either disbursement date or loan creation date
  closingDate?: string; // Closing date (Date as string)
  maturityDate?: string; // Maturity date (Date as string)

  // Detailed Terms (JSON for flexibility)
  contractTerms?: Record<string, any>; // JSON object for flexible contract terms

  createdAt?: ISODateString; // When contract was created
  updatedAt?: ISODateString; // When contract was last updated
}
