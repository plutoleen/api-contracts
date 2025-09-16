# Eunomia API Endpoints

Eunomia is the financial engine and accounting system. It handles loan disbursements, interest calculations, ledger entries, and financial reporting.

## Base URL

```
Development: http://localhost:8000
Staging: https://dev-eunomia.plutocredit.com
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
  "timestamp": "2025-07-29T21:45:00Z"
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
  "contract_terms": "{\"term_length\": \"12 months\", \"payment_frequency\": \"monthly\"}",
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
  "loan_amount": "10000.00",
  "base_rate_bps": 533,
  "spread_bps": 525,
  "total_rate_bps": 1058,
  "incept_fee_bps": 100,
  "contract_status": "active",
  "ledger_entries_created": 2,
  "timestamp": "2025-07-29T21:45:00Z"
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
    "loan_amount": 1000000.00,
    "interest_rate": 5.5,
    "interest_rate_spread": 200.0,
    "maturity_date": "2026-07-29T00:00:00Z",
    "status": "active",
    "created_at": "2025-07-29T21:45:00Z"
  }
]
```

### GET /contracts/{contract_id}
Get specific contract details.

**Response:**
```json
{
  "id": "uuid-12345",
  "loan_contract_id": "CONTRACT-001",
  "loan_amount": 1000000.00,
  "interest_rate": 5.5,
  "interest_rate_spread": 200.0,
  "maturity_date": "2026-07-29T00:00:00Z",
  "status": "active",
  "created_at": "2025-07-29T21:45:00Z"
}
```

### GET /contracts/{contract_id}/ledger
Get all ledger entries for a specific contract.

**Response:**
```json
[
  {
    "id": "uuid-12345",
    "debit_account_id": "loans-outstanding",
    "credit_account_id": "cash",
    "amount": "100000.00",
    "description": "Loan disbursement - Contract CONTRACT-001",
    "user_id": "system-auto",
    "contract_id": "uuid-12345",
    "timestamp": "2025-08-14T16:20:01.615691"
  }
]
```

### GET /contracts/{contract_id}/balances
Get current account balances for accounts associated with a contract.

**Response:**
```json
[
  {
    "account_id": "loans-outstanding",
    "balance": "100000.00",
    "last_updated": "2025-08-14T16:20:01.615691"
  }
]
```

## Interest Management

### POST /interest/calculate
Calculate interest for a specific contract using current SOFR rates.

**Request Body:**
```json
{
  "contract_id": "uuid-12345",
  "calculation_date": "2025-01-15",
  "force_refresh": false
}
```

**Response:**
```json
{
  "success": true,
  "contract_id": "uuid-12345",
  "calculation_date": "2025-01-15",
  "daily_interest": "150.6849",
  "base_rate": "5.33",
  "spread": "2.00",
  "total_rate": "7.33",
  "loan_amount": "750000.00",
  "already_posted": false,
  "posted_to_ledger": false,
  "posting_timestamp": null
}
```

### GET /interest/accrued/{contract_id}
Get total accrued interest for a specific contract.

**Query Parameters:**

- `as_of_date` (string, optional): Date to calculate accrued interest as of (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "contract_id": "uuid-12345",
  "as_of_date": "2025-01-15",
  "total_accrued_interest": "4520.5470",
  "entry_count": 30,
  "loan_amount": "750000.00",
  "total_interest_rate": "7.33"
}
```

### POST /interest/post
Calculate and post interest for a specific contract to the general ledger.

**Request Body:**
```json
{
  "contract_id": "uuid-12345",
  "calculation_date": "2025-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "contract_id": "uuid-12345",
  "calculation_date": "2025-01-15",
  "daily_interest": "150.6849",
  "posted_to_ledger": true,
  "posting_timestamp": "2025-01-15T10:30:00Z"
}
```

### GET /interest/schedule
Process interest for all active contracts.

**Query Parameters:**

- `calculation_date` (string, optional): Date to calculate interest for (YYYY-MM-DD, defaults to today)
- `force_refresh` (boolean, optional): Whether to force refresh SOFR rates (default: false)

**Response:**
```json
{
  "success": true,
  "calculation_date": "2025-01-15",
  "total_contracts": 25,
  "processed_count": 23,
  "error_count": 2,
  "total_interest": "3465.7534",
  "errors": [
    {
      "contract_id": "uuid-12345",
      "error": "Failed to process interest"
    }
  ]
}
```

## Missing Endpoints (To Be Implemented)

### Payment Processing

- `POST /contracts/{contract_id}/payments` - Process payment
- `GET /contracts/{contract_id}/payments` - Get payment history
- `GET /contracts/{contract_id}/payments/{id}` - Get specific payment details

### Statement Generation

- `GET /contracts/{contract_id}/statements` - Get statements/payment schedule
- `POST /contracts/{contract_id}/statements` - Generate statement

### SOFR Rate Management

- `GET /sofr/rates` - Get SOFR rates
- `POST /sofr/rates` - Update SOFR rate

**Note:** SOFR service exists in the codebase but API endpoints are not yet implemented.
