export interface Organization {
  id: string; // uuid - Unique identifier for the organization
  name: string; // Organization name
  type: 'admin' | 'client'; // Organization type (admin for Pluto Credit, client for external organizations)
  status: 'active' | 'suspended'; // Organization status
  domain: string; // Email domain for automatic user-organization association
  contactEmail: string; // Primary contact email for the organization
  contactName: string; // Primary contact person name supporting international characters
  settings: Record<string, any>; // Organization-specific settings and configuration
  deletedAt: Date; // Timestamp when the organization was deleted (soft delete)
  createdAt: Date; // Timestamp when the organization was created
  updatedAt: Date; // Timestamp when the organization was last updated
}

export interface PreApprovedAsset {
  //added by admins at /api/organizations/[id]/assets
  id: string; // Unique asset identifier
  name: string; // Asset name mapping to asset.fundName
  symbol: string; // CUSIP or other unique identifier mapping to asset.symbol
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
