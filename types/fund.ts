import { UUID, ISODateString } from './shared';

export interface Fund {
  id: UUID; // Unique identifier for the fund
  issuerId: UUID; // ID of the associated issuer
  name: string; // Name of the fund
  description: string; // Description of the fund
  createdAt: ISODateString; // Timestamp when the fund was created
  updatedAt: ISODateString; // Timestamp when the fund was last updated
}
