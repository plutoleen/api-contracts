import { UUID, ISODateString, Currency, Country } from './shared';
import { InterestRateSnapshot } from './interest';

//Loan entity in Charon
export interface Loan {
  id: UUID; // Unique identifier for the loan
  accountId: UUID; // ID of the associated account which will be the borrower id in eunomia
  loanApplicationId: UUID; // ID of the associated loan application
  loanContractId: UUID; // ID of the associated loan contract in Eunomia
  status:
    | 'unsigned' // Created but not yet fully signed
    | 'signed' // All parties signed, enforceable contract, not yet disbursed - when all parties sign, trigger disbursement event
    | 'open' // Funds sent, loan is live and being serviced
    | 'matured' // Loan has naturally completed, obligations met
    | 'defaulted' // Borrower failed obligations (met 'default' trigger event from covenants)
    | 'closed'; // Terminated (early payoff, buyback, refinance, etc.)
  // status:
  //   | 'unsigned' // Loan contract created, waiting on required signatures
  //   | 'signed' // All parties signed, enforceable contract, not yet disbursed
  //   | 'disbursed' // Funds sent, loan becomes active
  //   | 'active' // Loan is live and being serviced
  //   | 'delinquent' // Borrower missed payments, not yet default
  //   | 'defaulted' // Loan legally in default (met 'default' trigger event from covenants)
  //   | 'paid_off' // Borrower fully repaid, loan closed successfully
  //   | 'closed' // Closed for other reasons (admin action, settlement, charge-off)
  //   | 'restructured'; // Terms renegotiated (optional: often treated as new loan)
  name: string; // Name of the loan which includes the borrower's name
  currency: Currency;
  balanceOpenCents: number; // Opening balance of the loan in cents
  balanceCurrentCents: number; // Current balance of the loan in cents aka outstanding balance from Eunomia
  currentLvrPct: number; // Current Loan-to-value ratio from Eunomia
  // nextPaymentDueAt: ISODateString | null; // Next payment due date from Eunomia
  // lastPaymentAt: ISODateString; // Date of last payment from Eunomia
  // interestCalculatedLastAt: ISODateString | null; // Last date interest was calculated from interest engine
  dateOpen: ISODateString | null; // Date when the loan was opened (when a loan offer is accepted)
  dateClose: ISODateString | null; // Date when the loan was closed (when a loan is fully repaid or defaulted)
  createdAt: ISODateString; // Timestamp when the loan was created
  updatedAt: ISODateString; // Timestamp when the loan was last updated
}

//Loan contract entity in demo site
export interface LoanContract {
  //jsonb snapshot of the final loan contract
  // 1. Loan Identification
  id: UUID; // Unique identifier for the loan contract
  loan_id: UUID; // loan identifier UUID from loan.id
  loan_type: 'asset-backed'; //Type of loan, asset-backed by default, but future cases may include other types of loans
  loan_purpose: 'investment' | 'business' | 'personal'; //Purpose of the loan set by admin, most will be for investment purposes but can be for other purposes
  loan_structure: 'monthly_interest_principal_maturity' | 'amortized_interest_principal_maturity'; // Loan structure type from loanTerms.paymentFrequency
  contract_status: 'draft' | 'open' | 'matured' | 'defaulted' | 'closed'; // Current loan contract status

  // 2. Borrower & Lender Information
  borrower_id: UUID; // Borrower's ID from eunomia
  lender_id: UUID; // Lender's identifier //TODO: would this be redundant as the lender would be Pluto or would it be the organization/BSP
  lender_name: string; // Lender's name

  // 3. Loan Terms
  principal_amount: number; // Original loan amount from loanTerms.loanAmountCents
  currency: Currency; // Loan currency from loanTerms.currency
  inception_fee: number; // Inception fee, typically 1% of the loan amount set by admin from loanOffer.inceptionFeePct
  interestRate: InterestRateSnapshot; //from loanOffer.interestRate
  lvrPct: number; // Loan-to-value ratio from loanTerms.lvrPct
  loan_term_months: number; // Loan term in months from loanOffer.termLengthMonths
  origination_date: ISODateString; // When loan was originated from loanTerms.dateOpen
  maturity_date: Date; // When loan matures from loanTerms.dateOpen + loanOffer.termMonths
  payment_frequency: 'monthly' | 'quarterly' | 'annually' | 'bullet' | 'interest_only'; // How often payments are due from loanOffer.paymentFrequency
  prepayment_penalty: number; // Penalty for early repayment set by admin from loanOffer.prepaymentPenalty
  late_payment_fee: number; // Fee for late payments set by admin from loanOffer.latePaymentFee
  grace_period_days: number; // Grace period before late fees set by admin from loanOffer.gracePeriodDays
  interest_payment_structure: 'monthly_payment' | 'amortized_at_maturity'; // How interest is paid derived from paymentStructure

  // 4. Asset & Collateral Information - confirmed to be needed in DB by Neel
  collateral_assets: Array<{
    // Individual collateral assets
    id: UUID; // Unique identifier for the collateral asset from charon.assets table
    fund_name: string; //from selectedFunds.fundName
    value_cents: number; //from selectedFunds.valueCents
    pledged_at: ISODateString; //from selectedFunds.pledgedAt
    status: 'active' | 'released' | 'defaulted'; // Whether asset is still pledged as collateral or released
  }>;
  collateral_id: string;
  collateral_type: string;
  collateral_description: string;
  collateral_valuation_method?: string | null; //e.g. cash flow evaluation method, market value evaluation method, etc.
  collateral_valuation_date: ISODateString;
  collateral_value_cents: number; // Current collateral value from loanTerms.totalAssetValueCents
  collateral_currency: Currency; // collateral value at loan inception from loanTerms.currency
  collateral_location: string;
  collateral_ownership_status: string;
  lien_position: string;
  lien_filing_reference: string;
  ucc_filing_date: ISODateString;
  // collateral_insurance_status: string; //leave blank for now
  // insurance_provider: string;
  // insurance_expiry_date: Date;

  // covenants_status: string | null; //leave blank for now as Apollo does not have this
  // collateral_status: string | null;
  // default_trigger_event: string | null; //leave blank for now as Apollo does not have this
  // default_recourse_action: string | null; //leave blank for now as Apollo does not have this
  // repayment_source: string | null; //leave blank for now as Apollo does not have this

  // 6. Legal & Compliance
  jurisdiction: Country; // Legal jurisdiction country code from loanOffer.jurisdiction
  contract_signed_date: ISODateString; // When contract was signed from contract.signedAt
  disbursement_date: Date; // When loan was disbursed from eunomia or loan.dateOpen or eunomia.ledger.disbursementDate
  disbursement_method: 'ach' | 'wire' | 'check' | 'bank_transfer'; //ACH, wire, etc.
  // loan_covenants: string[]; //leave blank for now as Apollo does not have this
  // default_provisions: string[]; //leave blank for now as Apollo does not have this
  // secured_party_name: string; // Name of the cus

  // 7. Additional Fields
  notes: string; // Additional notes
  uploaded_documents: UUID[]; // List of uploaded documents -> should be ref from files table
  modified_by: UUID | 'system-auto'; // Who last modified the contract
  created_at: ISODateString; // When contract was created
  updated_at: ISODateString; // When contract was last updated
}
