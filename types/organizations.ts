export interface Organization {
  id: string; // uuid - Unique identifier for the organization
  name: string; // Organization name
  type: 'admin' | 'client'; // Organization type (admin for Pluto Credit, client for external organizations)
  status: 'active' | 'suspended'; // Organization status
  domain: string; // Email domain for automatic user-organization association
  contactEmail: string; // Primary contact email for the organization
  contactName: string; // Primary contact person name supporting international characters
  settings: Record<string, any>; // Organization-specific settings and configuration
  createdAt: Date; // Timestamp when the organization was created
  updatedAt: Date; // Timestamp when the organization was last updated
  deletedAt: Date; // Timestamp when the organization was deleted (soft delete)
}
