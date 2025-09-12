import { Sofr } from './loan-application';
export interface Loan {
  id: string; // Unique identifier for the loan
  accountId: string; // ID of the associated account which will be the borrower id in eunomia
  loanApplicationId: string; // ID of the associated loan application
  name: string; // Name of the loan which includes the borrower's name and the date opened
  status: 'unsigned' | 'signed' | 'disbursed' | 'closed'; // TODO: discuss if 'open' should be added in case further action needs to be taken when all parties sign loan contract agreements
  balanceOpen: number; // Opening balance of the loan in cents
  balanceCurrent: number; // Current balance of the loan in cents aka outstanding balance from Eunomia
  currentLVR: number; // Current Loan-to-value ratio from Eunomia
  interestCalculatedLastDate: Date; // Last date interest was calculated from interest engine
  nextPaymentDueDate: Date; // Next payment due date from Eunomia
  lastPaymentDate: Date; // Date of last payment from Eunomia
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'SEK' | 'NZD';
  loanContract: LoanContract; // Loan contract jsonb snapshot
  dateOpen: Date; // Date when the loan was opened (when a loan offer is accepted)
  dateClose: Date; // Date when the loan was closed (when a loan is fully repaid or defaulted)
  createdAt: Date; // Timestamp when the loan was created
  updatedAt: Date; // Timestamp when the loan was last updated
}

export interface InterestRate {
  baseRate: Sofr; // Index/benchmark SOFR rate at offer time
  spread: number; // lender’s margin/markup over the base rate
  nominalRate: number; // Combined rate of interest (base rate + spread) used for repayment calculations
  apr: number; // Annual percentage rate used for regulatory disclosures/compliance which bakes in fees, compounding, etc.
  lastUpdated: Date;
}

export interface LoanContract {
  //jsonb snapshot of the final loan contract
  // 1. Loan Identification
  loan_id: string; // Unique loan identifier UUID
  loan_type: 'asset-backed'; //Type of loan, asset-backed by default, but future cases may include other types of loans
  loan_purpose: 'investment' | 'business' | 'personal'; //Purpose of the loan set by admin, most will be for investment purposes but can be for other purposes
  loan_structure: 'monthly_interest_principal_maturity' | 'amortized_interest_principal_maturity'; // Loan structure type from loanTerms.paymentFrequency
  contract_status: 'pending' | 'active' | 'repaid' | 'defaulted'; // Current loan contract status

  // 2. Borrower & Lender Information
  borrower_id: string; // Borrower's ID from eunomia
  lender_id: string; // Lender's identifier //TODO: would this be unnecessary as it's Pluto or would it be the organization/BSP
  lender_name: string; // Lender's name

  // 3. Loan Terms
  principal_amount: number; // Original loan amount from loanTerms.loanAmount
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'SEK' | 'NZD'; // Loan currency from loanTerms.currency
  inception_fee: number; // Inception fee, typically 1% of the loan amount set by admin
  interestRate: InterestRate; //from loanTerms.interestRate
  lvr: number; // Loan-to-value ratio from loanTerms.lvr
  loan_term_months: number; // Loan term in months from loanTerms.term
  origination_date: Date; // When loan was originated from loanTerms.startDate
  maturity_date: Date; // When loan matures from loanTerms.dateOpen + loanTerms.term
  payment_frequency: 'monthly' | 'quarterly' | 'annually' | 'bullet' | 'interest_only'; // How often payments are due from loanTerms.paymentFrequency
  prepayment_penalty: number; // Penalty for early repayment set by admin
  late_payment_fee: number; // Fee for late payments set by admin
  grace_period_days: number; // Grace period before late fees set by admin
  interest_payment_structure: 'monthly_payment' | 'amortized_at_maturity'; // How interest is paid

  // 4. Asset & Collateral Information
  collateral_assets: Array<{
    // Individual collateral assets
    fund_name: string; //from selectedFunds.fundName
    value: number; //from selectedFunds.value
    pledged_date: Date; //from selectedFunds.pledgedDate
    status: 'active' | 'released' | 'defaulted'; // Whether asset is pledged as collateral
  }>;
  collateral_id: string;
  collateral_type: string;
  collateral_description: string;
  collateral_valuation_method: string;
  collateral_valuation_date: Date;
  collateral_value: number; // Current collateral value from loanTerms.totalSelectedValue
  collateral_location: string;
  collateral_ownership_status: string;
  lien_position: string;
  lien_filing_reference: string;
  ucc_filing_date: Date;
  // collateral_insurance_status: string; //leave blank for now
  // insurance_provider: string;
  // insurance_expiry_date: Date;

  // covenants_status: string | null; //leave blank for now as Apollo does not have this
  // collateral_status: string | null;
  // default_trigger_event: string | null; //leave blank for now as Apollo does not have this
  // default_recourse_action: string | null; //leave blank for now as Apollo does not have this
  // repayment_source: string | null; //leave blank for now as Apollo does not have this

  // 6. Legal & Compliance
  jurisdiction: string; // Legal jurisdiction country code
  contract_signed_date: Date; // When contract was signed from contract.signedAt
  disbursement_date: Date; // When loan was disbursed from eunomia or loan.dateOpen
  disbursement_method: 'ach' | 'wire' | 'check' | 'bank_transfer'; //ACH, wire, etc.
  // loan_covenants: string[]; //leave blank for now as Apollo does not have this
  // default_provisions: string[]; //leave blank for now as Apollo does not have this
  // secured_party_name: string; // Name of the cus

  // 7. Additional Fields
  notes: string; // Additional notes
  uploaded_documents: string[]; // List of uploaded documents -> should be ref from files table
  modified_by: string; // Who last modified the contract
  created_at: Date; // When contract was created
  updated_at: Date; // When contract was last updated
}
