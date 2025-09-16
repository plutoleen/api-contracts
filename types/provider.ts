import { UUID, ISODateString } from './shared';

export interface Provider {
  id: UUID; // Unique identifier for the provider
  name: string; // Name of the provider
  email: string; // Email address of the provider
  phone: string; // Phone number in international format
  description: string; // Description of the provider
  createdAt: ISODateString; // Timestamp when the provider was created
  updatedAt: ISODateString; // Timestamp when the provider was last updated
}
