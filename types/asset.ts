import { UUID, Currency, ISODateString } from './shared';

//Current loan asset entity in Charon
export interface LoanAsset {
  //in Charon assets table, subject to change
  id: UUID; // Unique identifier for the loan asset"
  loanApplicationId: UUID; // ID of the associated loan application
  fundName: string; // Name of the fund
  investorName: string; // Name of the investor
  identifier: string; // CUSIP/ISIN/internal identifier for the fund
  phone: string; // Phone number in international format
  totalCommitmentCents: number; // Total capital committed by the investor
  capitalCalledCents: number; // Capital called for payment by the fund
  capitalInvestedCents: number; // Capital actually paid by the investor
  currency: Currency; // Currency of the asset commitment
  maxLVRPct: number; // Maximum loan-to-value ratio for this fund if match detected during parsing
  pledged: boolean; // Whether asset is pledged as collateral or not
  pledgedAt: ISODateString | null; // Date pledged as collateral during application submission step
  dateOrigin: ISODateString; // Origin date of the asset, could be the statement date or the date system parsed and uploaded to DB from docs
  createdAt: ISODateString; // Timestamp when the asset was created
  updatedAt: ISODateString; // Timestamp when the asset was last updated
}
