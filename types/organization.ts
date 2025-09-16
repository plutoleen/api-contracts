import { UUID, ISODateString } from './shared';

//Organization entity in Charon
export interface Organization {
  id: UUID; // Unique identifier for the organization
  type: 'admin' | 'client'; // Organization type (admin for Pluto Credit, client for external organizations)
  status: 'active' | 'suspended'; // Organization status
  name: string; // Organization name
  domain: string; // Email domain for automatic user-organization association
  contactEmail: string; // Primary contact email for the organization
  contactName: string; // Primary contact person name supporting international characters
  settings: Record<string, any>; // Organization-specific settings and configuration
  deletedAt: ISODateString; // Timestamp when the organization was deleted (soft delete)
  createdAt: ISODateString; // Timestamp when the organization was created
  updatedAt: ISODateString; // Timestamp when the organization was last updated
}
