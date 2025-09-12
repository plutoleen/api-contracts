export type ApplicationStatus =
  | 'draft'
  | 'pending'
  | 'manual_review'
  | 'offered'
  | 'accepted'
  | 'funded'
  | 'rejected'
  | 'cancelled';

export interface LoanApplication {
  id: string; // Unique uuid for loan application
  userId: string; // Borrower's user ID
  name: string; // Application name/description or title
  status: ApplicationStatus; // Current application status
  data: LoanData; // All loan application data
  canRestore?: boolean; //TODO: not sure if needed; whether application can be restored if deleted
  createdAt: Date; // When application was created
  updatedAt: Date; // Last modification timestamp
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
  availableFunds: //assets found on parsing docs, used to select funds to pledge as collateral
  Array<{
    fundName: string; // Fund name
    symbol: string; // Fund's identifier/CUSIP symbol
    type: 'pcap' | 'subscription' | 'other'; //TODO: validate if needed at all
    value: number; // Fund value
    quantity: number; // Number of units/shares held
    maxLTV: number; // Maximum loan-to-value ratio for this fund if match detected during parsing
    pledged: boolean; // Whether asset is pledged as collateral or not
    pledgedDate: Date | null; // Date pledged as collateral during application submission step
  }> | null;
  borrowerInfo: {
    // Borrower's personal information
    nameGiven: string; // Borrower's first name
    nameMiddle?: string; // Borrower's middle name
    nameFamily: string; // Borrower's last name
    address: string; // Street address
    city: string; // City
    state: string; // State/province
    zipCode: string; // ZIP/postal code
    phoneNumber: string; // Contact phone number
    employmentStatus?: 'employed' | 'self-employed' | 'unemployed' | 'retired' | 'student' | 'other'; // Current employment status
  } | null;
  offer?: LoanOffer | null; // Loan offer provided by the lender either through auto-approval or manual review
  loanTerms: LoanTerms | null; // Final loan terms accepted by the borrower
  contract: Contract | null; // Contract agreement signing status
}

export interface Contract {
  signed: boolean; // Whether the contract has been signed by the borrower
  signedAt: Date; // Timestamp when the contract was signed
}

export interface Sofr {
  rate: number; // Current SOFR (Secured Overnight Financing Rate)
  lastUpdated: Date; // Date this SOFR rate was last updated (provided by the SOFR API)
}

export interface LoanOffer {
  //snapshot of the initial loan offer provided by the lender either through auto-approval or manual review
  maxLoanSize: number; // Maximum loan amount offered
  maxLVR: number; // Blended maximum loan-to-value ratio based on all assets pledged as collateral
  termMonths: number; // Loan term in months
  paymentTerms: 'monthly_interest_principal_maturity' | 'amortized_interest_principal_maturity'; // Payment structure
  paymentFrequency?: 'monthly' | 'quarterly' | 'annually' | 'bullet' | 'interest_only'; // How often payments are due
  interestRate: {
    baseRate: Sofr; // Index/benchmark SOFR rate at offer time
    spread: number; // lender’s margin/markup over the base rate
    nominalRate: number; // Combined rate of interest (base rate + spread) used for repayment calculations
    apr: number; // Annual percentage rate used for regulatory disclosures/compliance which bakes in fees, compounding, etc.
    lastUpdated: Date;
  };
  offeredBy: string; // Admin/organization/user who made the loan offer, set to system-auto for auto-approval
  offeredAt: Date; // Timestamp when the loan offer was made
  expiresAt: Date; // Timestamp when the loan offer expires
}

export interface LoanTerms {
  //Final loan terms accepted by the borrower
  loanAmount: number; // Requested loan amount
  ltv: number; // Final loan-to-value ratio
  disbursementDetails: {
    //TODO: should be stored separately from terms, in a vault as sensitive data
    // Bank account for loan proceeds
    accountNumber: string; // Bank account number
    routingNumber: string; // Bank routing number
    accountType: 'checking' | 'savings'; // Type of bank account
    recipientName: string; // Account holder name
  } | null;
}
