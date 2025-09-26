import { UUID, ISODateString } from './shared';

//Borrower entity proposal if needed
export interface Borrower {
  id: UUID; // Borrower's ID which is the account.id in Charon
  addressId: UUID; // Borrower's address referenced from address.id in Charon
  nameGiven: string; // Borrower's first name
  nameMiddle: string; // Borrower's middle name
  nameFamily: string; // Borrower's last name
  phone: string; // Borrower's phone number
  email: string; // Borrower's email address
  type: 'individual' | 'business'; // Type of borrower (individual, business)
  createdAt: ISODateString; // Timestamp when the borrower was created
  updatedAt: ISODateString; // Timestamp when the borrower was last updated
}

//borrower entity in Eunomia
export interface EunomiaUser {
  uid: string; // Primary key (user ID in charon)
  name: string; // Borrower's full name
}
