import { UUID, Currency, ISODateString } from './shared';

//Asset fund in demo site
export interface AvailableFund {
  //assets found on parsing docs, used to select funds to pledge as collateral
  //TODO: discuss if should be saved in assets table when a doc is uploaded + parsed or when asset is pledged as collateral
  fundName: string; // Fund name
  symbol: string; // Fund's identifier/CUSIP symbol
  type: 'pcap' | 'subscription' | 'other'; //TODO: validate if needed at all
  valueCents: number; // Fund value
  quantity: number; // Number of units/shares held
  maxLVRPct: number; // Maximum loan-to-value ratio for this fund if match detected during parsing
  pledged: boolean; // Whether asset is pledged as collateral or not
  pledgedAt?: ISODateString | null; // Date pledged as collateral during application submission step
}

//Loan asset entity in Charon
export interface LoanAsset {
  //in Charon assets table, subject to change
  id: UUID; // Unique identifier for the loan asset"
  loanApplicationId: UUID; // ID of the associated loan application
  fundName: string; // Name of the fund
  investorName: string; // Name of the investor
  phone: string; // Phone number in international format
  dateOrigin: ISODateString; // Origin date of the asset
  units: number; //Total number of units
  unitsPledged: 1 | 0; // Number of units pledged -> 1 if pledged, 0 otherwise
  unitsCalled: number; // Number of units called
  unitsInvested: number; // Number of units invested
  unitValue: number; // Value per unit in cents
  unitCurrency: Currency; // Currency of the unit value
  totalValuation: number; // Total valuation (computed: unitValue * units)
  createdAt: ISODateString; // Timestamp when the asset was created
  updatedAt: ISODateString; // Timestamp when the asset was last updated
}
