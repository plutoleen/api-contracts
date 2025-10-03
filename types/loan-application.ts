import { UUID, ISODateString, PaymentFrequency, PaymentStructure, Currency, Country } from './shared';
import { Agreement } from './agreement';

export type ApplicationStatus =
  | 'draft' //application is in draft mode, not yet submitted
  | 'pending' //application is pending review by the automatic system
  | 'manual_review' //application is in manual review mode, waiting for manual review by the lender
  | 'rejected' //application is rejected by the lender
  | 'offered' //application is offered by the lender
  | 'accepted' //application is accepted by the borrower
  | 'signed' //application is signed by the borrower
  | 'cancelled' //application is cancelled by the borrower
  | 'funded'; //application is funded by the lender

export interface LoanApplicationSchema {
  //a loan application with comprehensive financial validation and business logic
  id: UUID; // Unique identifier for the loan application
  accountId: UUID; // ID of the associated account that includes the borrower's personal information + contact details
  issuerId: UUID; // ID of the issuer
  servicerId: UUID; // ID of the servicer
  name: string; // Name of the borrower
  status: ApplicationStatus; // Current status of the loan application
  loanOfferJSONB: UUID; // Loan offer provided by the lender either through auto-approval or manual review
  loanTermsJSONB: UUID; // Final loan terms accepted by the borrower
  contractAgreements: Agreement[] | []; // Contract agreements + their signing status
  dateOpen: ISODateString; // Date when the application was opened
  dateClose: ISODateString; // Date when the application was closed
  createdAt: ISODateString; // Timestamp when the application was created
  updatedAt: ISODateString; // Timestamp when the application was last updated
}

// //Previously in demo site loanApplication.data
// documents: StoredDocument[] | []; // All uploaded loan documents -> should be ref from files table, not LoanData
// decisioningDocs: DecisioningDoc[] | [];
// export interface DecisioningDoc {
//   name: string; // Document name from fileRef.filename
//   downloadUrl: string; // Download URL from S3 bucket
//   storagePath: string; // Storage path to get URL from S3 bucket
//   uploadedAt: Date; // Upload timestamp from S3 metadata
//   type: DocumentType; // Document type for decisioning from fileRef.documentType
// }

export interface LoanOffer {
  //snapshot of the initial loan offer provided by the lender either through auto-approval or manual review
  id: UUID; //TODO: discuss if needed for compliance/auditing to keep track of loan offers made
  maxLoanAmount: number; // Maximum loan amount offered
  maxLvrPct: number; // Blended maximum loan-to-value ratio based on all assets pledged as collateral
  termLengthMonths: number; // Loan term in months
  inceptionFeePct: number; // upfront inception fee as a percentage of the loan amount
  inceptionFeeAmount: number; // upfront inception fee amount in cents
  interestRateSpreadBps: number; // lender’s margin/markup over the base rate in basis points for precision (e.g., 150 = 1.50%)
  interestPeriod: 'days' | 'weeks' | 'months' | 'quarters' | 'years'; // Period of loan interest for interest calculation in eunomia
  paymentStructure: PaymentStructure; // Payment structure
  paymentFrequency: PaymentFrequency; // How often payments are due
  latePaymentFee: number; // Fee for late payments set by admin
  prepaymentPenalty: number; // Penalty for early repayment set by admin
  gracePeriodDays: number; // Grace period before late fees set by admin
  jurisdiction: Country; // Legal jurisdiction country code from organization that made the loan offer
  offeredBy: '00000000-0000-0000-0000-000000000001' | string; // Admin/organization/user who made the loan offer, set to system-auto for auto-approval
  offeredAt: ISODateString; // Timestamp when the loan offer was made
  expiresAt: ISODateString; // Timestamp when the loan offer expires
}

export interface LoanTerms {
  //Final loan terms accepted by the borrower
  loanAmount: number; // Requested loan amount
  loanCurrency: Currency;
  assetTotalValue: number; // Total value of all assets pledged as collateral
  assetTotalCurrency: Currency; // Currency of the assets
  lvrPct: number; // Final loan-to-value ratio
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
