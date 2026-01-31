# Betabotz Paygate SDK

Official Node.js SDK for Betabotz Payment Gateway API.

[![npm version](https://img.shields.io/npm/v/betabotz-paygate.svg)](https://www.npmjs.com/package/betabotz-paygate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 Easy to use
- 💳 Support for multiple payment methods (QRIS, Dana, GoPay, OVO, ShopeePay)
- 🔒 Secure API key authentication
- 📦 TypeScript support
- ⚡ Promise-based API
- 🔄 Automatic retries and error handling

## Installation

```bash
npm install betabotz-paygate
```

or with yarn:

```bash
yarn add betabotz-paygate
```

## Quick Start

```javascript
const BetabotzPaygate = require('betabotz-paygate');

// Initialize client
const paygate = new BetabotzPaygate({
  apiKey: 'YOUR_PAYMENT_METHOD_APIKEY',
});

// Create a transaction
async function createPayment() {
  try {
    const transaction = await paygate.createTransaction({
      amount: 10000,
      notes: 'Order #123',
      callback_url: 'https://yourdomain.com/webhook',
      return_url: 'https://yourdomain.com/thankyou',
      metadata: {
        orderId: '123',
        productName: 'Premium Package',
      },
    });

    console.log('Payment URL:', transaction.data.paymentUrl);
    console.log('Transaction ID:', transaction.data.transactionId);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createPayment();
```

## Configuration

### Constructor Options

```javascript
const paygate = new BetabotzPaygate({
  apiKey: 'YOUR_PAYMENT_METHOD_APIKEY', // Required
  baseURL: 'https://web.btzpay.my.id',  // Optional (default value)
  timeout: 30000,                        // Optional (default: 30000ms)
});
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `apiKey` | string | Yes | Your payment method API key from dashboard |
| `baseURL` | string | No | Base URL for API (default: https://web.btzpay.my.id) |
| `timeout` | number | No | Request timeout in milliseconds (default: 30000) |

## API Methods Documentation

### 1. createTransaction(params)

Create a new QRIS or e-wallet transaction.

#### Basic Example

```javascript
const transaction = await paygate.createTransaction({
  amount: 10000,
  notes: 'Payment for Order #123',
});
```

#### Complete Example with All Parameters

```javascript
const transaction = await paygate.createTransaction({
  // Required
  amount: 10000,
  
  // Payment Config (Optional)
  fee: 15,
  paymentMethod: 'qrisgopay',
  timeout: 900000,
  
  // URLs (Optional)
  callback_url: 'https://yourdomain.com/webhook',
  return_url: 'https://yourdomain.com/thankyou',
  
  // Info (Optional)
  notes: 'Order #123',
  
  // Customer (Optional)
  customerInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '081234567890',
  },
  
  // Metadata (Optional)
  metadata: {
    orderId: '123',
    productName: 'Premium Package',
  },
});
```

#### Response

```javascript
{
  success: true,
  data: {
    transactionId: 'TRX17685466153087427',
    paymentUrl: 'https://web.btzpay.my.id/transaction/TRX...',
    accessKey: 'ae160236...',
    amount: 10000,
    totalAmount: 10574,
    status: 'pending',
    // ... more fields
  }
}
```

---

### 2. getTransaction(transactionId, accessKey)

Get transaction details.

#### Example

```javascript
const details = await paygate.getTransaction(
  'TRX17685466153087427',
  'ae160236cc2f6012f8a2e273ac9dd955'
);

console.log(details.data.status); // pending, sukses, gagal, expired, cancel
```

---

### 3. cancelTransaction(transactionId, reason)

Cancel a pending transaction.

#### Example

```javascript
const result = await paygate.cancelTransaction(
  'TRX17685466153087427',
  'User cancelled order'
);

console.log(result.data.status); // cancel
```

---

### 4. sendCallback(params)

Send payment callback from listener app.
`appVersionCode required!`

#### Dana Example

```javascript
const result = await paygate.sendCallback({
  action: 'update',
  app: 'com.dana.id',
  notification: 'Kamu menerima Rp10.000 dari John Doe',
  amount: 10000,
  appVersionCode: 123,
});
```

#### GoPay Example

```javascript
await paygate.sendCallback({
  action: 'update',
  app: 'com.gojek.app',
  notification: 'Pembayaran Rp50.000 berhasil',
  amount: 50000,
  appVersionCode: 123,    
});
```

---

### 5. getPaymentUrl(transactionId, accessKey)

Generate payment URL.

#### Example

```javascript
const url = paygate.getPaymentUrl(
  'TRX17685466153087427',
  'ae160236cc2f6012f8a2e273ac9dd955'
);
// https://web.btzpay.my.id/transaction/TRX...?key=...
```

## Payment Methods

Supported payment methods:

- `qrisdana` - QRIS Dana
- `qrisgopay` - QRIS GoPay
- `qrisorkut` - QRIS Orkut
- `qrisshopeepay` - QRIS ShopeePay

## Webhook/Callback

When a transaction status changes, Betabotz Paygate will send a POST request to your `callback_url`.

### Callback Payload Example

```javascript
{
  pay_id: 'TRX17685536101913729',
  unique_code: '123',
  status: 'sukses', // pending, sukses, gagal, expired, cancel
  raw: {
    success: true,
    message: 'Payment confirmed successfully',
    data: {
      transactionId: 'TRX17685536101913729',
      amount: 10000,
      status: 'sukses',
      paidAt: '2026-01-16T08:53:59.148Z',
      expiredAt: '2026-01-16T08:58:30.261Z',
      orderId: '123',
      productName: 'Premium Package',
      reason: 'macroDroid_notification',
      notes: 'Order #123',
      return_url: 'https://yourdomain.com/thankyou'
    }
  }
}
```

### Handling Webhook (Express.js Example)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { pay_id, status, raw } = req.body;

  console.log('Payment received:', pay_id, status);
  
  // Process the payment based on status
  if (status === 'sukses') {
    // Update your database, fulfill order, etc.
    console.log('Order completed:', raw.data.orderId);
  }

  // IMPORTANT: Respond with success
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

## Transaction Status

| Status | Description |
|--------|-------------|
| `pending` | Transaction is waiting for payment |
| `sukses` | Payment successfully received |
| `gagal` | Payment failed |
| `expired` | Transaction expired (timeout reached) |
| `cancel` | Transaction cancelled by user or merchant |

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Create/Cancel | 10 requests | 1 seconds |
| Callback | 100 requests | 15 seconds |
| Get Transaction | 60 requests | 1 seconds |

## Error Handling

The SDK throws errors that you should catch and handle:

```javascript
try {
  const transaction = await paygate.createTransaction({
    amount: 10000,
  });
} catch (error) {
  console.error('Error code:', error.status);
  console.error('Error message:', error.message);
  console.error('Error data:', error.data);
}
```

### Common Error Responses

**Validation Error (400)**
```javascript
{
  success: false,
  message: 'Validation error',
  errors: [
    {
      field: 'amount',
      message: 'Amount must be a number'
    }
  ]
}
```

**Rate Limit Error (429)**
```javascript
{
  success: false,
  message: 'Too many requests. Please try again in 1 minute.'
}
```

**Not Found (404)**
```javascript
{
  success: false,
  message: 'Transaction not found'
}
```

## TypeScript Support

This package includes TypeScript definitions:

```typescript
import BetabotzPaygate, { CreateTransactionParams, TransactionData } from 'betabotz-paygate';

const paygate = new BetabotzPaygate({
  apiKey: 'YOUR_API_KEY',
});

const params: CreateTransactionParams = {
  amount: 10000,
  notes: 'Order #123',
};

const transaction = await paygate.createTransaction(params);
const data: TransactionData = transaction.data;
```

## Complete Example

```javascript
const BetabotzPaygate = require('betabotz-paygate');
const express = require('express');

const app = express();
app.use(express.json());

const paygate = new BetabotzPaygate({
  apiKey: 'YOUR_API_KEY',
});

// Create payment endpoint
app.post('/create-payment', async (req, res) => {
  try {
    const { amount, orderId, productName } = req.body;

    const transaction = await paygate.createTransaction({
      amount: amount,
      notes: `Order ${orderId}`,
      callback_url: 'https://yourdomain.com/webhook',
      return_url: 'https://yourdomain.com/thankyou',
      metadata: {
        orderId: orderId,
        productName: productName,
      },
    });

    res.json({
      success: true,
      paymentUrl: transaction.data.paymentUrl,
      transactionId: transaction.data.transactionId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const { pay_id, status, raw } = req.body;

  if (status === 'sukses') {
    console.log('✅ Payment successful:', pay_id);
    // Update database, send confirmation email, etc.
  } else if (status === 'expired') {
    console.log('⏱️ Payment expired:', pay_id);
  } else if (status === 'cancel') {
    console.log('❌ Payment cancelled:', pay_id);
  }

  res.json({ success: true });
});

// Check transaction status
app.get('/check-payment/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { accessKey } = req.query;

    const details = await paygate.getTransaction(transactionId, accessKey);

    res.json({
      success: true,
      status: details.data.status,
      amount: details.data.amount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Support

- Documentation: https://web.btzpay.my.id/documentation
- Issues: https://github.com/ERLANRAHMAT/betabotz-paygate/issues
- Email: betabotzpaygate@gmail.com

## License

MIT License - see LICENSE file for details

## Notes

- All amounts are in Indonesian Rupiah (IDR)
- Minimum transaction amount is Rp 1
- Timeout is specified in milliseconds (60000ms = 1 minute)
- Always secure your API key and never commit it to version control
- Use environment variables to store sensitive data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Testing

The SDK includes a comprehensive test suite to verify all functionality.

### Running Tests

```bash
# Run all tests
npm test

# Run transaction tests only
npm run test:transaction
# or
npm run test:tx

# Run callback tests only
npm run test:callback
# or
npm run test:cb

# Run specific test file
node test/callback.test.js
node test/transaction.test.js
```

### Test Coverage

**Transaction Tests (11 tests):**
- Create simple transaction
- Create detailed transaction
- Get transaction details
- Cancel transaction
- All payment methods
- Minimum/maximum amounts
- Custom timeout
- Error handling
- Complete lifecycle

**Callback Tests (9 tests):**
- Callback for Dana, GoPay, OVO, ShopeePay
- Callback with unique code
- Error handling
- Complete flow (create + callback + verify)
- Multiple callbacks (batch)

### Writing Custom Tests

```javascript
const BetabotzPaygate = require('betabotz-paygate');

const paygate = new BetabotzPaygate({
  apiKey: 'YOUR_API_KEY',
});

async function myCustomTest() {
  try {
    const tx = await paygate.createTransaction({
      amount: 50000,
    });
    console.log('✅ Test passed:', tx.data.transactionId);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

myCustomTest();
```

For more details, see [test/README.md](test/README.md).

---
