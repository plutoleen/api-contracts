// demo/types/admin.ts
export interface AdminUser {
  email?: string; // Admin's email
  name?: string; // Admin's name
  role?: 'admin'; // Role is always 'admin'
  createdAt?: Date; // When they were made admin
  createdBy?: string; // UID of who made them admin
  isActive?: boolean; // Whether their admin access is active
}

// vs. charon/resources/users
export interface User {
  id: string; // uuid - Unique identifier for the user
  type: 'individual' | 'manager' | 'admin'; // The type of user, 'individual' by default
  nameGiven: string; // Given name supporting international characters
  nameMiddle: string; // Middle name supporting international characters
  nameFamily: string; // Family name supporting international characters
  email: string; // Email address of the user
  phone: string; // Phone number in international format
  secId: string; // SEC ID - 8-20 alphanumeric characters
  cognitoUsername: string; // Cognito username
  createdAt: Date; // Timestamp when the user was created
  updatedAt: Date; // Timestamp when the user was last updated
}

// vs. charon/resources/grants
export interface Grant {
  id: string; // uuid - Unique identifier for the grant
  userId: string; // uuid - ID of the user being granted access
  accountId: string; // uuid - ID of the account being accessed
  grantType: 'read' | 'write' | 'admin' | 'owner'; // Type of access granted
  isActive: boolean; // Whether the grant is currently active
  expiresAt: Date; // Timestamp when the grant expires (optional)
  createdAt: Date; // Timestamp when the grant was created
  updatedAt: Date; // Timestamp when the grant was last updated
}
