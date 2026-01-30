# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-30

### Added
- Initial release of Betabotz Paygate SDK
- `createTransaction()` method for creating new QRIS transactions
- `getTransaction()` method for retrieving transaction details
- `cancelTransaction()` method for cancelling pending transactions
- `sendCallback()` method for sending payment listener callbacks
- `getPaymentUrl()` helper method for generating payment URLs
- TypeScript type definitions for type safety
- Support for multiple payment methods (QRIS, Dana, GoPay, OVO, ShopeePay)
- Comprehensive error handling with custom error types
- Request/response interceptors for better error management
- Rate limiting awareness in SDK
- Full documentation with examples
- Webhook handling examples
- Express.js server example
- TypeScript usage example

### Features
- ✅ Easy-to-use API
- ✅ Promise-based methods
- ✅ TypeScript support
- ✅ Automatic error handling
- ✅ Request timeout configuration
- ✅ Customer information support
- ✅ Custom metadata support
- ✅ Callback URL configuration
- ✅ Return URL support
- ✅ Transaction notes
- ✅ Fee calculation
- ✅ Payment method selection
- ✅ Transaction timeout configuration

### Documentation
- Comprehensive README with usage examples
- API reference documentation
- Webhook integration guide
- TypeScript type definitions
- Example code for common use cases
- Environment variable configuration guide

## [Unreleased]

### Planned Features
- Add transaction history/list method
- Add bulk transaction creation
- Add transaction export functionality
- Add signature verification for webhooks
- Add retry mechanism for failed requests
- Add request logging option
- Add metrics and monitoring support
- Add transaction search/filter capabilities

---

For more information, visit [https://web.btzpay.my.id](https://web.btzpay.my.id)
