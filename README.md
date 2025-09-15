# Missing API Data for Loan Management Functionality

## Overview
This document outlines the missing data fields and API endpoints that would make loan management functionality work seamlessly with just API data, without requiring complex calculations or fallback logic.

## Critical Data Type and ID Issues

### 5. Borrower ID Mismatch and Foreign Key Constraints

- **Charon account ID**: `6cb12312-ed73-4842-ae12-f99f949976a4` (from auth context)
- **Eunomia borrower_id**: Must exist in Eunomia's `users` table (foreign key constraint)
- **Issue**: Cannot use Charon account ID directly in Eunomia disbursement
- **Current workaround**: Hardcoded `borrower_id: 'BORROWER-001'` in disbursement
- **Impact**: Breaks the relationship between borrower identity across systems

### 6. Missing User/Borrower Management

- **Charon**: Has user accounts but no borrower entity
- **Eunomia**: Has borrower entity but separate from Charon users
- **Issue**: No unified borrower identity across systems

## Data Consistency Issues

### 1. Contract ID Mismatch

- **Charon loan ID**: `668bc542-b148-4bde-a8b6-c245b056d954`
- **Eunomia contract_id**: `b6a1dffb-f448-4d34-8906-b182acef5b28`
- **Issue**: Different IDs; may be better to keep the same to correlate data between systems

### 2. Amount Format Inconsistency

- **Charon**: Stores amounts in cents (3600000 = $36,000)
- **Eunomia**: Stores amounts as decimal strings ("36000.00")
- **Issue**: Requires conversion logic and can cause calculation errors

### 3. Missing Interest Rate Data

- **Charon**: Not returning interest rate information
- **Eunomia**: No interest rate information
- **Issue**: Must use hardcoded defaults (4.25% SOFR)

### 4. Missing Payment Schedule

- **Charon**: No payment schedule data
- **Eunomia**: No payment schedule data
- **Issue**: Unable to show next payment due date or amount

### Endpoint Ideas

- `GET /contracts/{id}/balance` - Get current loan balance (principal + interest)
- `GET /contracts/{id}/interest-summary` - Get interest accrual summary
- `GET /contracts/{id}/payment-schedule` - Get upcoming payment schedule
- `GET /contracts/{id}/statements` - Get generated statements
- `GET /contracts/{id}/payments` - Get payment history (filtered from ledger)

### Missing Aggregated Data Endpoints

- `GET /contracts/{id}/financial-summary` - Get all financial data in one call:
  ```json
  {
    "contract_id": "668bc542-b148-4bde-a8b6-c245b056d954",
    "principal_amount": 3600000,
    "principal_owed": 3600000,
    "interest_owed": 0,
    "total_owed": 3600000,
    "fees_paid": 36000,
    "last_payment_date": null,
    "next_payment_due": null,
    "interest_rate": {
      "base_rate": 4.25,
      "spread_rate": 0,
      "total_rate": 4.25
    },
    "payment_history": [...],
    "recent_statements": [...]
  }
  ```

## Recommended API Improvements

### 1. Unified Contract ID

- Use the same contract ID across both Charon and Eunomia
- Or provide a mapping endpoint: `GET /contracts/{charon_id}/eunomia-id`

### 2. Standardized Amount Format

- Agree on a consistent format (cents vs. decimals)
- Or provide conversion utilities in the API

### 3. Enhanced Loan Contract Endpoint
```json
GET /api/proxy/accounts/{accountId}/loans/{id}/full
{
  "id": "668bc542-b148-4bde-a8b6-c245b056d954",
  "borrower_name": "Neel Ganu",
  "principal_amount": 3600000,
  "principal_owed": 3600000,
  "interest_owed": 0,
  "total_owed": 3600000,
  "interest_rate": {
    "base_rate": 4.25,
    "spread_rate": 0,
    "total_rate": 4.25,
    "last_updated": "2025-09-11T19:11:06.010502Z"
  },
  "next_payment": {
    "amount": 0,
    "due_date": null
  },
  "contract_status": "active",
  "created_at": "2025-09-11T19:11:06.010502Z",
  "documents": [],
  "eunomia_contract_id": "b6a1dffb-f448-4d34-8906-b182acef5b28",
  "financial_summary": {
    "principal_amount": 3600000,
    "interest_owed": 0,
    "total_owed": 3600000,
    "fees_paid": 36000
  }
}
```

### 4. Enhanced Ledger Endpoint
```json
GET /contracts/{id}/ledger/enhanced
{
  "entries": [
    {
      "id": "54",
      "entry_type": "disbursement",
      "category": "loan_principal",
      "amount": "36000.00",
      "description": "Loan disbursement",
      "timestamp": "2025-09-11T19:11:06.010502",
      "is_loan_balance": true,
      "affects_principal": true,
      "affects_interest": false
    },
    {
      "id": "55",
      "entry_type": "fee",
      "category": "inception_fee",
      "amount": "360.00",
      "description": "Inception fee",
      "timestamp": "2025-09-11T19:11:06.010502",
      "is_loan_balance": false,
      "affects_principal": false,
      "affects_interest": false
    }
  ],
  "summary": {
    "total_disbursed": "36000.00",
    "total_paid": "0.00",
    "total_fees": "360.00",
    "interest_accrued": "0.00",
    "current_balance": "36000.00"
  }
}
```

## Implementation Priority

### High Priority (Critical for basic functionality)

1. **Unified contract ID** - Fix the ID mismatch between systems
2. **Standardized amount format** - Agree on cents vs. decimals
3. **Enhanced loan contract endpoint** - Include all necessary fields
4. **Financial summary endpoint** - Provide aggregated data

### Medium Priority (Important for user experience)

1. **Interest rate data** - Include in loan contract response
2. **Payment schedule data** - Show next payment due
3. **Enhanced ledger entries** - Add entry types and categories
4. **Document management** - Include document references

### Low Priority (Nice to have)

1. **Payment method tracking** - For payment history
2. **Reference numbers** - For payment tracking
3. **Detailed fee breakdown** - Separate fee types
4. **Statement generation** - Automated statement creation

## Conclusion

With these API improvements, the loan management functionality could work entirely with API data, eliminating the need for:

- Complex calculation logic in the frontend
- Fallback DOM scraping
- Hardcoded default values
- Multiple API calls to piece together data
