import { UUID, ISODateString } from './shared';

//Pre-approved asset entity in Charon
export interface PreApprovedAsset {
  //added by admins at /api/organizations/[id]/assets
  id: UUID; // Unique asset identifier
  name: string; // Asset name mapping to asset.fundName
  symbol: string; // CUSIP or other unique identifier mapping to asset.symbol
  spreadBps: number; // Interest rate spread for this asset
  maxLVRPct: number; // Maximum loan-to-value ratio for this asset
  autoApprove: boolean; // Whether org wants this asset to be automatically approved
  justificationDoc?: {
    // Document justifying pre-approval
    name: string; // Document name
    downloadUrl: string; // Download URL
    storagePath: string; // Storage path
    uploadedAt: ISODateString; // Upload timestamp
  };
  updatedBy: UUID; // Who last updated the asset
  createdAt: ISODateString; // When asset was pre-approved
  updatedAt: ISODateString; // When asset was last updated
}
