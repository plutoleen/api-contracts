import { UUID, ISODateString } from './shared';

export interface User {
  id: UUID; // Unique identifier for the user
  type: 'individual' | 'manager' | 'admin'; // The type of user, 'individual' by default
  nameGiven: string; // Given name supporting international characters
  nameMiddle: string; // Middle name supporting international characters
  nameFamily: string; // Family name supporting international characters
  email: string; // Email address of the user
  phone: string; // Phone number in international format
  secId: string; // SEC ID - 8-20 alphanumeric characters
  cognitoUsername: string; // Cognito username
  createdAt: ISODateString; // Timestamp when the user was created
  updatedAt: ISODateString; // Timestamp when the user was last updated
}
