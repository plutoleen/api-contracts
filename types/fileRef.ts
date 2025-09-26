import { UUID, ISODateString } from './shared';

export type DocumentType =
  | 'subscription'
  | 'pcap'
  | 'other'
  | 'loan_agreement'
  | 'pledged_agreement'
  | 'fund_consent_agreement'
  | 'justification'; //Type of document for categorization

// File reference type in Charon
export interface FileRef {
  id: UUID; //Unique identifier for the file reference
  accountId: UUID; //ID of the associated account
  documentableId: UUID; //ID of the documentable object
  documentableType: 'loanApplication' | 'loanAsset' | 'account'; //Type of the documentable object
  documentType: DocumentType; //Type of document for categorization
  filename: string; //Original filename with secure character restrictions
  fileContentType:
    | 'application/pdf'
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/webp'
    | 'application/msword'
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    | 'application/vnd.ms-excel'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'text/csv'
    | 'text/plain'; //MIME type of the file (restricted to allowed types)
  awsBucket: string; //AWS S3 bucket name (DNS-compliant)
  awsKey: string; //AWS S3 key (path traversal protection)
  status: 'quarantined' | 'processed' | 'failed'; //Processing status of the file
  metadata: any; //Additional metadata as JSON object
  createdAt: ISODateString; //Timestamp when the file reference was created
  updatedAt: ISODateString; //Timestamp when the file reference was last updated
}

//document analysis result from Clio/AWS Bedrock
export interface ClioDocumentAnalysis {
  summary: {
    type: 'Subscription Document';
    fund_name: 'Apollo Strategic Fund III';
    issuer: 'Apollo Global Management';
    investor_name: 'John Doe';
    total_commitment: '$1,000,000';
    address: '123 Main St, New York, NY 10001';
  };
  metadata: {
    bucket: 'my-documents-bucket';
    key: 'subscription-doc.pdf';
    contentType: 'application/pdf';
    modelId: 'global.anthropic.claude-sonnet-4-20250514-v1:0';
  };
}

//Document type in Demo site
export interface Document {
  id?: UUID; // Unique document identifier (optional for new documents)
  name: string; // Display name of the document
  type: 'pending' | 'subscription' | 'pcap' | 'other'; // Document category
  status?: 'quarantined' | 'processed' | 'failed'; // Processing status
  file?: File; // File object for new uploads
  downloadUrl?: string; // URL to download the document
  storagePath?: string; // Internal storage path for the document
  documentAnalysis?: {
    // Document analysis results
    analysisResult?: {
      // Processed analysis data
      result?: {
        // Final extracted data
        subscription_or_pcap?: {
          // Fund-specific extracted data
          fund_name?: string; // Name of the investment fund
          fund_symbol?: string; // Fund's trading symbol
          total_amount_called_or_invested?: number; // Total amount called or invested
        };
        extracted_text?: string; // Plain text extracted from document
      };
    };
  };
}
export interface StoredDocument {
  name: string; // Display name of the document
  type: 'pending' | 'subscription' | 'pcap' | 'other'; // Document category used to map to AI model parsing result
  // downloadUrl: string; // URL to download the document
  // storagePath: string; // Internal storage path for the document - result of calling uploadToStorage(file)
  // documentAnalysis?: any; // Raw analysis data from document processing - result of calling /api/process-document within analyzeDocument(extractedText)
  // analysisResult?: any; // Processed analysis results - result of calling analyzeDocument(extractedText)
  // result?: any; // Raw extracted data from document - result of calling /api/process-document within analyzeDocument(extractedText)
  // extractedText?: string; // Plain text extracted from the document - result of calling extractTextFromPDF(file)
  metadata?: any; // Metadata extracted and parsed from the document as an array of objects
  status?: 'quarantined' | 'processed' | 'failed'; // Processing status
}
