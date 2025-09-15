import {
  ISODateString,
  UUID,
  InterestRateSnapshot,
  PaymentFrequency,
  PaymentStructure,
  ApplicationStatus,
  Currency,
} from './shared';

export interface LoanApplication {
  id: UUID; // Unique uuid for loan application
  userId: UUID; // Borrower's user ID
  name: string; // Application name/description or title
  status: ApplicationStatus; // Current application status
  data: {
    availableFunds: AvailableFund[] | [];
    borrowerInfo?: BorrowerInfo | null; //could come from the user profile instead
    offer?: LoanOffer | null; // Loan offer provided by the lender either through auto-approval or manual review
    loanTerms?: LoanTerms | null; // Final loan terms accepted by the borrower
    contract?: Contract | null; // Contract agreement signing status
  }; // All loan application data
  canRestore?: boolean; //TODO: validate if needed; whether application can be restored if deleted
  createdBy?: UUID;
  updatedBy?: UUID;
  createdAt: ISODateString; // When application was created
  updatedAt: ISODateString; // Last modification timestamp
}
export interface AvailableFund {
  //assets found on parsing docs, used to select funds to pledge as collateral -> will be stored in the assets table
  fundName: string; // Fund name
  symbol: string; // Fund's identifier/CUSIP symbol
  type: 'pcap' | 'subscription' | 'other'; //TODO: validate if needed at all
  valueCents: number; // Fund value
  quantity: number; // Number of units/shares held
  maxLVRPct: number; // Maximum loan-to-value ratio for this fund if match detected during parsing
  pledged: boolean; // Whether asset is pledged as collateral or not
  pledgedAt?: ISODateString | null; // Date pledged as collateral during application submission step
}

export interface BorrowerInfo {
  // Borrower's personal information
  nameGiven: string; // Borrower's first name
  nameMiddle?: string | null; // Borrower's middle name
  nameFamily: string; // Borrower's last name
  address: string; // Street address
  city?: string | null; // City
  state?: string | null; // State/province
  postalCode?: string; // ZIP/postal code
  country?: string; // Country
  phoneNumber: string; // Contact phone number
  email: string; // Contact email address
}

export interface Contract {
  signed: boolean; // Whether the contract has been signed by the borrower
  signedAt: ISODateString; // Timestamp when the contract was signed
}

// //Previously in demo site loanApplication.data
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

export interface LoanOffer {
  //snapshot of the initial loan offer provided by the lender either through auto-approval or manual review
  offerId: UUID;
  jurisdiction: string; // Legal jurisdiction country code from organization that made the loan offer
  maxLoanSizeCents: number; // Maximum loan amount offered
  maxLvrPct: number; // Blended maximum loan-to-value ratio based on all assets pledged as collateral
  termMonths: number; // Loan term in months
  paymentStructure: PaymentStructure; // Payment structure
  paymentFrequency?: PaymentFrequency; // How often payments are due
  inceptionFeePct?: number; // upfront inception fee as a percentage of the loan amount
  inceptionFeeAmountCents?: number; // upfront inception fee amount in cents
  interestRate: InterestRateSnapshot;
  latePaymentFee: number; // Fee for late payments set by admin
  prepaymentPenalty: number; // Penalty for early repayment set by admin
  gracePeriodDays: number; // Grace period before late fees set by admin
  offeredBy: 'system-auto' | string; // Admin/organization/user who made the loan offer, set to system-auto for auto-approval
  offeredAt: ISODateString; // Timestamp when the loan offer was made
  expiresAt: ISODateString; // Timestamp when the loan offer expires
}

export interface LoanTerms {
  //Final loan terms accepted by the borrower
  loanAmountCents: number; // Requested loan amount
  totalAssetValueCents: number; // Total value of all assets pledged as collateral
  lvrPct: number; // Final loan-to-value ratio
  currency: Currency;
  disbursementInstrumentId?: UUID; // Taken from Vault id/token
}

export interface DisbursementInstrument {
  //TODO: should be stored separately from terms, in a vault as sensitive data
  // Bank account for loan proceeds
  accountName: string; // Bank account name
  accountNumber: string; // Bank account number
  routingNumber: string; // Bank routing number
  accountType: 'checking' | 'savings'; // Type of bank account
  recipientName: string; // Account holder name
}
