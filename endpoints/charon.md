# Charon API Endpoints

Charon is the loan origination and contract management system. It handles user accounts, loan applications, loan contracts, and document management.


## Base URL
Development: <http://localhost:3000/api/v1>
Staging: <http://charon-staging-alb-296936603.us-east-2.elb.amazonaws.com/api/v1>

## Authentication
All endpoints require JWT Bearer token

# Missing Endpoints

/org/[id]/assets -> let admin create a pre-approved asset per their organization

# Current Endpoints

## Account Management

### GET /accounts
Retrieve all accounts with filtering and pagination.

**Query Parameters:**

- `limit` (number): Maximum results (default: 20)
- `offset` (number): Pagination offset
- `order` (string): Sort order (e.g., "createdAt", "-name")
- `fields` (string): Comma-separated fields to return

**Response:**
```json
{
  "data": [
    {
      "id": "6cb12312-ed73-4842-ae12-f99f949976a4",
      "name": "John Doe",
      "email": "john@example.com",
      "type": "individual",
      "status": "active",
      "createdAt": "2025-09-11T19:11:06.010502Z",
      "updatedAt": "2025-09-11T19:11:06.010502Z"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

### GET /accounts/{accountId}
Get specific account details.

### POST /accounts
Create new account.

## Loan Applications

### GET /accounts/{accountId}/loan-applications
Get all loan applications for an account.

**Query Parameters:**

- `status` (string): Filter by application status
- `limit` (number): Maximum results (default: 20)
- `offset` (number): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "app-123",
      "userId": "6cb12312-ed73-4842-ae12-f99f949976a4",
      "name": "Investment Loan Application",
      "status": "draft",
      "createdAt": "2025-09-11T19:11:06.010502Z",
      "updatedAt": "2025-09-11T19:11:06.010502Z",
      "data": {
        "selectedFunds": [],
        "personalInfo": {},
        "loanTerms": {},
        "contract": null
      }
    }
  ],
  "total": 1,
  "hasMore": false
}
```

### POST /accounts/{accountId}/loan-applications
Create new loan application.

**Request Body:**
```json
{
  "name": "Investment Loan Application"
}
```

### GET /accounts/{accountId}/loan-applications/{loanAppId}
Get specific loan application.

### PUT /accounts/{accountId}/loan-applications/{loanAppId}
Update loan application.

**Request Body:**
```json
{
  "data": {
    "personalInfo": {
      "nameGiven": "John",
      "nameFamily": "Doe"
    },
    "loanTerms": {
      "loanAmount": 3600000,
      "term": 12
    }
  },
  "status": "pending"
}
```

### DELETE /accounts/{accountId}/loan-applications/{loanAppId}
Delete loan application.

## Loan Management

### GET /accounts/{accountId}/loans
Get all loans for an account.

**Query Parameters:**

- `status` (string): Filter by loan status
- `limit` (number): Maximum results (default: 20)
- `offset` (number): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "668bc542-b148-4bde-a8b6-c245b056d954",
      "name": "John Doe - Investment Loan",
      "status": "open",
      "balanceOpen": 3600000,
      "balanceCurrent": 3600000,
      "currency": "USD",
      "dateOpen": "2025-09-11T19:11:06.010502Z",
      "dateClose": null,
      "accountId": "6cb12312-ed73-4842-ae12-f99f949976a4",
      "loanApplicationId": "app-123",
      "createdAt": "2025-09-11T19:11:06.010502Z",
      "updatedAt": "2025-09-11T19:11:06.010502Z"
    }
  ],
  "total": 1,
  "hasMore": false
}
```

### GET /accounts/{accountId}/loans/{loanId}
Get specific loan details.

### POST /accounts/{accountId}/loans
Create new loan from approved application.

**Request Body:**
```json
{
  "name": "John Doe - Investment Loan",
  "loanApplicationId": "app-123",
  "balanceOpen": 3600000,
  "currency": "USD"
}
```

### PUT /accounts/{accountId}/loans/{loanId}
Update loan details.

## Document Management

### GET /accounts/{accountId}/loan-applications/{loanAppId}/files
Get all files for a loan application.

### POST /accounts/{accountId}/loan-applications/{loanAppId}/files
Upload new file.

### GET /accounts/{accountId}/loan-applications/{loanAppId}/files/{fileId}
Get specific file details.

### GET /accounts/{accountId}/loan-applications/{loanAppId}/files/{fileId}/download
Download file.

### DELETE /accounts/{accountId}/loan-applications/{loanAppId}/files/{fileId}
Delete file.

## User Management

### GET /users
Get all users.

### POST /users
Create new user.

### GET /users/{userId}
Get specific user.

### PUT /users/{userId}
Update user.

## Organization Management

### GET /organizations
Get all organizations.

### POST /organizations
Create new organization.

### GET /organizations/{orgId}
Get specific organization.

### PUT /organizations/{orgId}
Update organization.

### GET /organizations/{orgId}/assets
Get pre-approved assets for organization.

### POST /organizations/{orgId}/assets
Create pre-approved asset (admin only).

**Request Body:**
```json
{
  "name": "Apollo Fund III",
  "identifier": "APOLLO3",
  "spreadRate": 0.5,
  "maxLVR": 0.7,
  "autoApprove": true
}
```

## File References

### GET /file-refs
Get all file references.

### POST /file-refs
Create file reference.

### GET /file-refs/{fileRefId}
Get specific file reference.

### PUT /file-refs/{fileRefId}
Update file reference.

### DELETE /file-refs/{fileRefId}
Delete file reference.
