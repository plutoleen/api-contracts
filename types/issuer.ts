import { UUID, ISODateString } from './shared';

export interface Issuer {
  id: UUID; // Unique identifier for the issuer
  name: string; // Name of the issuer organization
  description: string; // Description of the issuer
  createdAt: ISODateString; // Timestamp when the issuer was created
  updatedAt: ISODateString; // Timestamp when the issuer was last updated
}
