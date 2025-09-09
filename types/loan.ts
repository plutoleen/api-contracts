export interface StoredDocument {
  name: string; // Display name of the document
  type: 'subscription' | 'pcap' | 'earnings' | 'other' | 'pending'; // Document category used to map to AI model parsing result
  downloadUrl: string; // URL to download the document
  storagePath: string; // Internal storage path for the document - result of calling uploadToStorage(file)
  documentAnalysis?: any; // Raw analysis data from document processing - result of calling /api/process-document within analyzeDocument(extractedText)
  analysisResult?: any; // Processed analysis results - result of calling analyzeDocument(extractedText)
  result?: any; // Raw extracted data from document - result of calling /api/process-document within analyzeDocument(extractedText)
  extractedText?: string; // Plain text extracted from the document - result of calling extractTextFromPDF(file)
  status?: 'uploading' | 'processing' | 'complete' | 'error' | 'deleted'; // Processing status
}

export type LoanStatus = 'unsigned' | 'signed' | 'disbursed' | 'closed'; // loan status
export type ApplicationStatus = 'draft' | 'pending' | 'manual_review' | 'offered' | 'accepted' | 'rejected' | 'cancelled'; // loan application status

export interface LoanApplication {
  id: string; // Unique application identifier
  userId: string; // Borrower's user ID
  name: string; // Application name/description
  status: ApplicationStatus; // Current application status
  // currentStep: number; // Current step in application process -> calculated from application status
  createdAt: Date; // When application was created
  updatedAt: Date; // Last modification timestamp
  data: LoanData; // All loan application data
  canRestore?: boolean; //TODO: not sure if needed; Whether application can be restored if deleted
}

export interface LoanData {
  // documents: StoredDocument[] | []; // All uploaded loan documents -> should be ref from files table, not LoanData
  // decisioningDocs?: //TODO: not sure if needed; Additional documents for loan decisioning, can be placed in files table
  //   | Array<{
  //       // Additional documents for loan decisioning
  //       name: string; // Document name
  //       downloadUrl: string; // Download URL
  //       storagePath: string; // Storage path
  //       uploadedAt: Date; // Upload timestamp
  //       type: 'decisioning_support'; // Document type for decisioning
  //     }>
  //   | [];
  selectedFunds: //assets found on parsing docs, used to select funds to pledge as collateral
  | Array<{
        fundName: string; // Fund name
        symbol: string; // Fund's trading symbol
        type: 'pcap' | 'subscription' | 'other'; // Fund type //TODO: validate if needed at all
        pledged: boolean; // Whether asset is pledged as collateral
        status: 'active' | 'released' | 'defaulted'; // Whether asset is pledged as collateral
        value: number; // Fund value
        quantity: number; // Number of units/shares held
        maxLTV: number; // Maximum loan-to-value ratio for this fund if match detected during parsing
      }>
    | [];
  personalInfo:
    | {
        // Borrower's personal information
        firstName?: string; // Borrower's first name
        lastName?: string; // Borrower's last name
        address?: string; // Street address
        city?: string; // City
        state?: string; // State/province
        zipCode?: string; // ZIP/postal code
        phoneNumber?: string; // Contact phone number
        employmentStatus?: string; // Current employment status
      }
    | {};
  loanTerms: LoanTerms | {};
  contract: Contract | null; // Contract signing status
  offer?: LoanOffer | null;
}

export interface Contract {
  signed: boolean; // Whether the contract has been signed by the borrower
  signedAt?: Date; // Timestamp when the contract was signed
}

export interface Sofr {
  rate: number; // Current SOFR (Secured Overnight Financing Rate)
  lastUpdated: Date; // When SOFR rate was last updated
}

export interface LoanTerms {
  spreadRate?: number; // Interest rate spread above SOFR
  baseRate: Sofr; // SOFR rate
  loanAmount?: number; // Requested loan amount
  term?: number; // Loan term in months
  ltv?: number; // Loan-to-value ratio
  paymentFrequency?: 'monthly' | 'quarterly' | 'annually' | 'bullet' | 'interest_only'; // How often payments are due
  startDate?: Date; // When loan payments begin aka current date
  disbursementDetails?:
    | {
        //TODO: should be separate from terms, stored in a vault as sensitive data
        // Bank account for loan proceeds
        accountNumber: string; // Bank account number
        routingNumber: string; // Bank routing number
        accountType: 'checking' | 'savings'; // Type of bank account
        recipientName: string; // Account holder name
      }
    | {};
}

export interface LoanOffer {
  maxLoanSize: number; // Maximum loan amount offered
  baseRate: Sofr; // SOFR rate
  spreadRate: number; // Interest rate spread above baseRate
  totalRate: number; // Total interest rate (base rate + spread)
  maxLVR: number; // Maximum loan-to-value ratio
  term: number; // Loan term in months
  paymentTerms: 'monthly_interest_principal_maturity' | 'amortized_interest_principal_maturity'; // Payment structure
}

export interface LoanContract {
  //jsonb snapshot of the final loan contract
  // 1. Loan Identification
  loan_id: string; // Unique loan identifier UUID
  loan_type: string; //TODO: Type of loan (e.g., asset-backed, personal) set by admin, not sure if necessary
  loan_purpose: string; //TODO: Purpose of the loan set by admin, not sure if necessary
  loan_structure: 'Monthly Interest + Principal at Maturity' | 'Interest + Principal at Maturity'; // Loan structure type from loanTerms.paymentFrequency

  // 2. Borrower & Lender Information
  borrower_firstname: string; // Borrower's first name
  borrower_lastname: string; // Borrower's last name
  borrower_type: 'individual' | 'business'; // Type of borrower (individual, business)
  lender_id: string; // Lender's identifier
  lender_name: string; // Lender's name

  // 3. Loan Terms
  principal_amount: number; // Original loan amount from loanTerms.loanAmount
  current_balance: number; // Current outstanding balance including accrued interest, calculated by Eunomia
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'SEK' | 'NZD'; // Loan currency from loanTerms.currency
  inception_fee: number; // Inception fee, typically 1% of the loan amount set by admin
  interest_rate_spread: number; // Interest rate spread above base rate from loanTerms.spreadRate
  base_rate: number; // Base interest rate (e.g., SOFR) from loanTerms.baseRate
  total_interest_rate: number; // Total interest rate (base rate + spread) calculated
  lvr: number; // Loan-to-value ratio from loanTerms.ltv
  loan_term_months: number; // Loan term in months from loanTerms.term
  origination_date: Date; // When loan was originated from loanTerms.startDate
  maturity_date: Date; // When loan matures from loanTerms.startDate + loanTerms.term
  payment_frequency: 'monthly' | 'quarterly' | 'annually' | 'bullet' | 'interest_only'; // How often payments are due from loanTerms.paymentFrequency
  prepayment_penalty: number; // Penalty for early repayment set by admin
  late_payment_fee: number; // Fee for late payments set by admin
  grace_period_days: number; // Grace period before late fees set by admin
  interest_calculated_last_date: Date; // Last date interest was calculated from interest engine
  interest_payment_structure: 'monthly_payment' | 'amortized_at_maturity'; // How interest is paid

  // 4. Asset & Collateral Information
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
  ltv_ratio: number; // Loan-to-value ratio from asset.maxLTV
  collateral_insurance_status: string;
  insurance_provider: string;
  insurance_expiry_date: Date;
  collateral_assets: Array<{
    // Individual collateral assets
    fund_name: string; //from selectedFunds.fundName
    value: number; //from selectedFunds.value
    pledged_date: Date; //from selectedFunds.subscriptionDate/orignDate?
    status: 'active' | 'released' | 'defaulted';
  }>;

  // 5. Repayment & Loan Monitoring
  outstanding_balance: number; // Calculated from Eunomia
  next_payment_due_date: Date; // Next payment due date
  last_payment_date: Date; // Date of last payment
  payment_status: 'current' | 'late' | 'default'; // Current payment status
  covenants_status: string;
  collateral_status: string;
  default_trigger_event: string;
  default_recourse_action: string;
  repayment_source: string;

  // 6. Legal & Compliance
  jurisdiction: string; //TODO: Is this meant to be the legal jurisdiction country code?
  contract_signed_date: Date; // When contract was signed from contract.signedAt
  contract_status: 'active' | 'pending' | 'completed' | 'defaulted'; // Current loan contract status
  disbursement_date: Date; // When loan was disbursed from loan.dateOpen
  disbursement_method: string; //TODO: validate if needed at all; 'bank_transfer' or 'ach' or 'wire'?
  loan_covenants: string[];
  default_provisions: string[];
  secured_party_name: string;

  // 7. Additional Fields
  notes: string; // Additional notes
  uploaded_documents: string[]; // List of uploaded documents -> should be ref from files table
  modified_by: string; // Who last modified the contract
  created_at: Date; // When contract was created
  updated_at: Date; // When contract was last updated
}

export interface PreApprovedAsset {
  //added by admins at /api/organizations/[id]/assets
  id: string; // Unique asset identifier
  name: string; // Asset name mapping to asset.fundName
  identifier: string; // CUSIP or other unique identifier mapping to asset.symbol
  spreadRate: number; // Interest rate spread for this asset
  maxLVR: number; // Maximum loan-to-value ratio for this asset
  autoApprove: boolean; // Whether asset is automatically approved
  justificationDoc?: {
    // Document justifying pre-approval
    name: string; // Document name
    downloadUrl: string; // Download URL
    storagePath: string; // Storage path
    uploadedAt: Date; // Upload timestamp
  };
  createdAt: Date; // When asset was pre-approved
  updatedAt: Date; // When asset was last updated
}

export interface Loan {
  id: string; // Unique identifier for the loan
  status: 'open' | 'defaulted' | 'closed'; // Current status of the loan
  name: string; // Name of the borrower
  balanceOpen: number; // Opening balance of the loan in cents
  balanceCurrent: number; // Current balance of the loan in cents
  currency: string; // Currency of the loan from ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"]
  dateOpen: Date; // Date when the loan was opened
  dateClose: Date; // Date when the loan was closed
  accountId: string; // ID of the associated account
  loanApplicationId: string; // ID of the associated loan application
  loanContract: LoanContract; // Loan contract jsonb snapshot
  createdAt: Date; // Timestamp when the loan was created
  updatedAt: Date; // Timestamp when the loan was last updated
}
