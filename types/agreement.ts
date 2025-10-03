import { UUID, ISODateString } from './shared';

//Agreement entity in Charon
export interface Agreement {
  id: UUID; //ID of the associated agreement representing a single e-signature contract doc
  fileRefId: UUID; // ID of the associated document from charon fileRefs.id
  envelopeId: string; //DocuSign envelope ID
  status: 'pending' | 'completed' | 'rejected'; //Status of the agreement
  agreementType: 'loan_agreement' | 'pledged_agreement' | 'fund_consent_agreement';
  signers: AgreementSigner[];
  completedAt: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AgreementSigner {
  order: number; //Order of the signer in the agreement signing order
  role: 'borrower' | 'lender' | 'fund' | 'issuer' | 'servicer';
  status: 'draft' | 'sent' | 'declined' | 'voided' | 'expired' | 'completed';
  signedAt: ISODateString; //Timestamp when the contract was signed
}
