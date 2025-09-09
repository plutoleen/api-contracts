export interface AdminUser {
  email?: string; // Admin's email
  name?: string; // Admin's name
  role?: 'admin'; // Role is always 'admin'
  createdAt?: Date; // When they were made admin
  createdBy?: string; // UID of who made them admin
  isActive?: boolean; // Whether their admin access is active
}
