import { UUID, Currency } from './shared';

export interface LoanAsset {
  //in Charon assets table, subject to change
  id: UUID; // Unique identifier for the loan asset"
  loanApplicationId: UUID; // ID of the associated loan application
  fund: string; // Name of the fund
  investor: string; // Name of the investor
  phone: string; // Phone number in international format
  dateOrigin: Date; // Origin date of the asset
  units: number; //Total number of units
  unitsPledged: 1 | 0; // Number of units pledged -> 1 if pledged, 0 otherwise
  unitsCalled: number; // Number of units called
  unitsInvested: number; // Number of units invested
  unitValue: number; // Value per unit in cents
  unitCurrency: Currency; // Currency of the unit value
  totalValuation: number; // Total valuation (computed: unitValue * units)
  createdAt: Date; // Timestamp when the asset was created
  updatedAt: Date; // Timestamp when the asset was last updated
}
