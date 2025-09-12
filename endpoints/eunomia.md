# Eunomia API Endpoints

Eunomia is the financial engine and accounting system. It handles loan disbursements, interest calculations, ledger entries, and financial reporting.

## Base URL

```
Development: http://localhost:8000
Production: https://api.plutocredit.com/eunomia
```

## Authentication
Currently open access. JWT authentication will be added in future releases.

## Health and Info

### GET /
Get API information and navigation links.

**Response:**
```json
{
  "message": "Welcome to Eunomia - Pluto's core ledger system",
  "version": "0.1.0",
  "docs": "/docs",
  "redoc": "/redoc",
  "health": "/health"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "eunomia",
  "version": "0.1.0",
  "database": "connected",
  "timestamp": "2025-09-11T19:11:06.010502Z"
}
```

## Loan Disbursement

### POST /disburse
Create loan contract and initial ledger entries.

**Request Body:**
```json
{
  "contract_id": "CONTRACT-001",
  "int_rate_bps": 525,
  "incept_fee_bps": 100,
  "contract_terms": "{\"loan_amount\": 3600000, \"term_length\": \"12 months\", \"payment_frequency\": \"monthly\"}",
  "borrower_id": "BORROWER-001"
}
```

**Response:**
```json
{
  "success": true,
  "contract_id": "CONTRACT-001",
  "loan_contract_id": "uuid-12345",
  "borrower_id": "BORROWER-001",
  "loan_amount": "36000.00",
  "base_rate_bps": 533,
  "spread_bps": 525,
  "total_rate_bps": 1058,
  "incept_fee_bps": 100,
  "contract_status": "active",
  "ledger_entries_created": 2,
  "timestamp": "2025-09-11T19:11:06.010502Z"
}
```

## Contract Management

### GET /contracts
List all loan contracts.

**Response:**
```json
[
  {
    "id": "uuid-12345",
    "loan_contract_id": "CONTRACT-001",
    "loan_amount": 36000.00,
    "interest_rate": 5.5,
    "interest_rate_spread": 200,
    "maturity_date": "2026-09-11T00:00:00Z",
    "status": "active",
    "created_at": "2025-09-11T19:11:06.010502Z"
  }
]
```

### GET /contracts/{contractId}
Get specific contract details.

### GET /contracts/{contractId}/balance
Get current contract balance.

**Response:**
```json
{
  "contract_id": "CONTRACT-001",
  "total_balance": "36000.00",
  "principal_balance": "36000.00",
  "interest_balance": "0.00",
  "fees_balance": "0.00",
  "last_payment_date": null,
  "last_interest_accrual": "2025-09-11T19:11:06.010502Z",
  "as_of_date": "2025-09-11T19:11:06.010502Z"
}
```

## Interest Management

### GET /interest/accrued
Get accrued interest for a contract.

**Query Parameters:**

- `contract_id` (string): Contract ID
- `as_of_date` (string): Date to calculate interest as of (YYYY-MM-DD)

**Response:**
```json
{
  "contract_id": "CONTRACT-001",
  "as_of_date": "2025-09-11",
  "accrued_interest": "150.68",
  "daily_interest_rate": "0.0147",
  "outstanding_principal": "36000.00",
  "days_accrued": 10
}
```

### POST /interest/post
Calculate and post interest to ledger.

**Request Body:**
```json
{
  "contract_id": "CONTRACT-001",
  "calculation_date": "2025-09-11"
}
```

**Response:**
```json
{
  "success": true,
  "contract_id": "CONTRACT-001",
  "calculation_date": "2025-09-11",
  "daily_interest": "150.68",
  "posted_to_ledger": true,
  "posting_timestamp": "2025-09-11T19:11:06.010502Z"
}
```

## Missing Endpoints (To Be Implemented)

### Payment Processing

- `GET /contracts/{contractId}/payment-schedule` - Get payment schedule
- `POST /contracts/{contractId}/payments` - Process payment
- `GET /contracts/{contractId}/payments` - Get payment history
- `GET /contracts/{contractId}/payments/{id}` - Get specific payment details

### Statement Generation

- `GET /contracts/{contractId}/statements` - Get statements
- `POST /contracts/{contractId}/statements` - Generate statement

### Financial Reporting

- `GET /contracts/{contractId}/financial-summary` - Get comprehensive financial summary
- `GET /contracts/{contractId}/ledger` - Get ledger entries

### SOFR Rate Management

- `GET /sofr/rates` - Get SOFR rates
- `POST /sofr/rates` - Update SOFR rate (admin only)
