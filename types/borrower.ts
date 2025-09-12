export interface Borrower {
  id: string; // Borrower's ID which is the Charon account ID
  address_id: string; // Borrower's address ID from Charon
  nameGiven: string; // Borrower's first name
  nameMiddle: string; // Borrower's middle name
  nameFamily: string; // Borrower's last name
  phone: string; // Borrower's phone number
  email: string; // Borrower's email address
  tax_id: string; // Borrower's tax ID
  ssn: string; // Borrower's social security number
  type: 'individual' | 'business'; // Type of borrower (individual, business)
  createdAt: Date; // Timestamp when the borrower was created
  updatedAt: Date; // Timestamp when the borrower was last updated
}
