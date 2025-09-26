import { UUID, ISODateString } from './shared';

//Pre-approved asset entity in Charon
export interface PreApprovedAsset {
  //added by admins at /api/admin/organizations/[id]/pre-approved-assets
  id: UUID; // Unique asset identifier
  fundName: string; // Asset name mapping to asset.fundName
  identifier: string; // CUSIP or other unique identifier mapping to asset.symbol
  spreadBps: number; // Interest rate spread for this asset
  maxLVRPct: number; // Maximum loan-to-value ratio for this asset
  justificationDocID: UUID; //fileRef uui
  updatedBy: UUID; // Who last updated the asset
  createdAt: ISODateString; // When asset was pre-approved
  updatedAt: ISODateString; // When asset was last updated
}
