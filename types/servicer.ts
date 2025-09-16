import { UUID, ISODateString } from './shared';

export interface Servicer {
  id: UUID; // Unique identifier for the servicer
  name: string; // Name of the servicer organization
  description: string; // Description of the servicer
  createdAt: ISODateString; // Timestamp when the servicer was created
  updatedAt: ISODateString; // Timestamp when the servicer was last updated
}
