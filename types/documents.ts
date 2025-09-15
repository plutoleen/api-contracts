import { UUID, ISODateString } from './shared';

//Document type in Demo site
export interface Document {
  id?: UUID; // Unique document identifier (optional for new documents)
  name: string; // Display name of the document
  type: 'subscription' | 'pcap' | 'earnings' | 'other' | 'pending'; // Document category
  status?: 'uploading' | 'processing' | 'complete' | 'error' | 'deleted'; // Processing status
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
  type: 'subscription' | 'pcap' | 'earnings' | 'other' | 'pending'; // Document category used to map to AI model parsing result
  // downloadUrl: string; // URL to download the document
  // storagePath: string; // Internal storage path for the document - result of calling uploadToStorage(file)
  // documentAnalysis?: any; // Raw analysis data from document processing - result of calling /api/process-document within analyzeDocument(extractedText)
  // analysisResult?: any; // Processed analysis results - result of calling analyzeDocument(extractedText)
  // result?: any; // Raw extracted data from document - result of calling /api/process-document within analyzeDocument(extractedText)
  // extractedText?: string; // Plain text extracted from the document - result of calling extractTextFromPDF(file)
  meta?: any; // Metadata extracted and parsed from the document as an array of objects
  status?: 'uploading' | 'processing' | 'complete' | 'error' | 'deleted'; // Processing status
}

// File reference type in Charon
export interface FileRef {
  id: UUID; //uuid - Unique identifier for the file reference
  accountId: UUID; //uuid - ID of the associated account
  documentableId: UUID; //uuid - ID of the documentable object
  documentableType: 'loanApplication' | 'loanAsset' | 'loanIncome' | 'account'; //Type of the documentable object
  documentType: 'subscription' | 'pcap' | 'W2' | '1099-MISC' | '1099-INT' | '1099-DIV' | '1099-R' | 'other'; //Type of document for categorization
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
