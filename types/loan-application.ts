import { UUID, ISODateString, InterestRateSnapshot, PaymentFrequency, PaymentStructure, Currency } from './shared';
import { Agreement } from './agreement';
import { AvailableFund } from './asset';
export interface LoanApplicationSchema {
  //a loan application with comprehensive financial validation and business logic
  id: UUID; // Unique identifier for the loan application
  accountId: UUID; // ID of the associated account that includes the borrower's personal information + contact details
  issuerId: UUID; // ID of the issuer
  servicerId: UUID; // ID of the servicer
  name: string; // Name of the borrower
  status: 'draft' | 'pending' | 'manual_review' | 'offered' | 'accepted' | 'funded' | 'rejected' | 'cancelled'; // Current status of the loan application
  assetTotalValue: number; // Total value of assets in cents
  assetTotalCurrency: Currency; // Currency of the assets
  loanAmount: number; // Loan amount in cents
  loanCurrency: Currency; // Currency of the loan
  metadata: {
    // All loan application data
    availableFunds: AvailableFund[] | [];
    offer: LoanOffer | null; // Loan offer provided by the lender either through auto-approval or manual review
    loanTerms: LoanTerms | null; // Final loan terms accepted by the borrower
    contractAgreements: Agreement[] | []; // Contract agreements + their signing status
  };
  canRestore: boolean; //TODO: validate if needed; whether application can be restored if deleted
  dateOpen: ISODateString; // Date when the application was opened
  dateClose: ISODateString; // Date when the application was closed
  createdBy: UUID; // ID of the user who created the loan application
  createdAt: ISODateString; // Timestamp when the application was created
  updatedAt: ISODateString; // Timestamp when the application was last updated
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
  id: UUID; //TODO: discuss if needed for compliance/auditing to keep track of loan offers made
  maxLoanSizeCents: number; // Maximum loan amount offered
  maxLvrPct: number; // Blended maximum loan-to-value ratio based on all assets pledged as collateral
  termMonths: number; // Loan term in months
  inceptionFeePct: number; // upfront inception fee as a percentage of the loan amount
  inceptionFeeAmountCents: number; // upfront inception fee amount in cents
  interestRate: InterestRateSnapshot;
  interestPeriod: 'days' | 'weeks' | 'months' | 'quarters' | 'years'; // Period of loan interest for interest calculation in eunomia
  paymentStructure: PaymentStructure; // Payment structure
  paymentFrequency: PaymentFrequency; // How often payments are due
  latePaymentFee: number; // Fee for late payments set by admin
  prepaymentPenalty: number; // Penalty for early repayment set by admin
  gracePeriodDays: number; // Grace period before late fees set by admin
  jurisdiction: string; // Legal jurisdiction country code from organization that made the loan offer
  offeredBy: 'system-auto' | string; // Admin/organization/user who made the loan offer, set to system-auto for auto-approval
  offeredAt: ISODateString; // Timestamp when the loan offer was made
  expiresAt: ISODateString; // Timestamp when the loan offer expires
}

export interface LoanTerms {
  //Final loan terms accepted by the borrower
  loanAmountCents: number; // Requested loan amount
  totalAssetValueCents: number; // Total value of all assets pledged as collateral
  lvrPct: number; // Final loan-to-value ratio
  loanCurrency: Currency;
  disbursementInstrumentId: UUID; // Taken from Vault id/token
}

// Bank account for loan proceeds to store securely in Eunomia
export interface DisbursementInstrument {
  //TODO: should be stored separately from terms, in a vault as sensitive data
  accountName: string; // Bank account name
  accountNumber: string; // Bank account number
  routingNumber: string; // Bank routing number
  accountType: 'checking' | 'savings'; // Type of bank account
  recipientName: string; // Account holder name
}
