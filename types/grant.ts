import { UUID, ISODateString } from './shared';

//Grant entity in Charon
export interface Grant {
  id: UUID; // uuid - Unique identifier for the grant
  userId: UUID; // uuid - ID of the user being granted access
  accountId: UUID; // uuid - ID of the account being accessed
  grantType: 'read' | 'write' | 'admin' | 'owner'; // Type of access granted
  isActive: boolean; // Whether the grant is currently active
  expiresAt: ISODateString; // Timestamp when the grant expires (optional)
  createdAt: ISODateString; // Timestamp when the grant was created
  updatedAt: ISODateString; // Timestamp when the grant was last updated
}
