import { UUID, ISODateString } from './shared';
import { FileRef } from './fileRef';

//Agreement entity in Charon
export interface Agreement {
  id: UUID; //ID of the associated agreement representing a single e-signature contract doc
  fileRefId: UUID; // ID of the associated document from charon fileRefs.id
  agreementableId: UUID; //ID of the associated object like loan.id
  agreementableType: 'loanApplication' | 'loan' | 'account';
  agreementType: 'loanAgreement' | 'pledgedAgreement' | 'fundConsentAgreement';
  envelopeId: string; //DocuSign envelope ID
  templateVersion: number;
  file: FileRef[]; //Signed PDF + audit trail
  signers: AgreementSigner[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface AgreementSigner {
  order: number; //Order of the signer in the agreement signing order
  role: 'borrower' | 'lender' | 'fund' | 'guarantor' | 'servicer' | 'admin';
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'executed';
  signedAt?: ISODateString; //Timestamp when the contract was signed
}
