export interface Document {
  id?: string; // Unique document identifier (optional for new documents)
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

export interface StoredDocument extends Omit<Document, 'file'> {
  downloadUrl: string; // URL to download the document (required for stored docs)
  storagePath: string; // Internal storage path (required for stored docs)
  documentAnalysis?: any; // Raw analysis data from document processing
  analysisResult?: any; // Processed analysis results
  result?: any; // Final extracted data from document
  extractedText?: string; // Plain text extracted from the document
}
