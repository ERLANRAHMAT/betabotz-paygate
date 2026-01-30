# Quick Start Guide - Betabotz Paygate SDK

Panduan cepat untuk memulai menggunakan Betabotz Paygate SDK dalam 5 menit!

## 🚀 5-Minute Quick Start

### Step 1: Extract & Install (1 minute)

```bash
# Extract ZIP
unzip betabotz-paygate-sdk.zip
cd betabotz-paygate-sdk

# Install dependencies
npm install
```

### Step 2: Setup API Key (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

Paste your API key:
```
BETABOTZ_API_KEY=your_actual_api_key_here
```

### Step 3: Create Your First Payment (3 minutes)

Create file `quick-start.js`:

```javascript
const BetabotzPaygate = require('./src/index');

// Initialize SDK
const paygate = new BetabotzPaygate({
  apiKey: process.env.BETABOTZ_API_KEY,
});

// Create payment
async function createPayment() {
  try {
    const transaction = await paygate.createTransaction({
      amount: 50000,  // Rp 50,000
      notes: 'My first payment',
    });
    
    console.log('\n✅ Payment Created!');
    console.log('Transaction ID:', transaction.data.transactionId);
    console.log('Payment URL:', transaction.data.paymentUrl);
    console.log('Total Amount:', transaction.data.totalAmount);
    console.log('\n📱 Share this URL with your customer:');
    console.log(transaction.data.paymentUrl);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createPayment();
```

Run it:
```bash
node quick-start.js
```

**Output:**
```
✅ Payment Created!
Transaction ID: TRX17685466153087427
Payment URL: https://web.btzpay.my.id/transaction/TRX...
Total Amount: 50574

📱 Share this URL with your customer:
https://web.btzpay.my.id/transaction/TRX17685466153087427?key=abc123...
```

## 🎯 Common Use Cases

### Use Case 1: E-commerce Checkout

```javascript
async function checkout(orderId, productName, price) {
  const transaction = await paygate.createTransaction({
    amount: price,
    notes: `Order ${orderId} - ${productName}`,
    metadata: {
      orderId: orderId,
      productName: productName,
    },
    callback_url: 'https://yourstore.com/webhook',
    return_url: 'https://yourstore.com/thankyou',
  });
  
  return transaction.data.paymentUrl;
}

// Usage
const paymentUrl = await checkout('ORD-123', 'Premium Package', 100000);
console.log('Send customer to:', paymentUrl);
```

### Use Case 2: Subscription Payment

```javascript
async function createSubscription(userId, plan, amount) {
  const transaction = await paygate.createTransaction({
    amount: amount,
    notes: `${plan} Subscription for User ${userId}`,
    paymentMethod: 'qrisgopay',
    timeout: 3600000, // 1 hour
    metadata: {
      userId: userId,
      plan: plan,
      type: 'subscription',
    },
  });
  
  return transaction.data;
}

// Usage
const sub = await createSubscription('user-123', 'Premium', 99000);
```

### Use Case 3: Invoice Payment

```javascript
async function createInvoice(invoiceNumber, items, total) {
  const transaction = await paygate.createTransaction({
    amount: total,
    notes: `Invoice ${invoiceNumber}`,
    customerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    metadata: {
      invoiceNumber: invoiceNumber,
      items: items,
    },
    callback_url: 'https://yourcompany.com/invoice-webhook',
  });
  
  return transaction.data;
}

// Usage
const invoice = await createInvoice('INV-2026-001', 
  [{ name: 'Service A', price: 50000 }], 
  50000
);
```

## 🔔 Setup Webhook (Optional)

Create `webhook.js`:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const { pay_id, status, raw } = req.body;
  
  console.log('Payment received:', pay_id);
  console.log('Status:', status);
  
  if (status === 'sukses') {
    // TODO: Update your database
    // TODO: Fulfill the order
    // TODO: Send email to customer
    console.log('Order completed!');
  }
  
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

Run webhook server:
```bash
node webhook.js
```

## 🧪 Test Your Integration

```bash
# Run all tests
npm test

# Run specific test
npm run test:transaction
npm run test:callback
```

## 📚 What's Next?

### Level 1: Basic Features ✅
- [x] Create payment
- [x] Get payment status
- [ ] Cancel payment
- [ ] Handle webhook

### Level 2: Advanced Features
- [ ] Multiple payment methods
- [ ] Custom timeout
- [ ] Customer information
- [ ] Metadata & notes

### Level 3: Production Ready
- [ ] Error handling
- [ ] Retry mechanism
- [ ] Security (HTTPS, validation)

## 📖 Learn More

| Resource | Description |
|----------|-------------|
| [README.md](README.md) | Complete documentation |
| [INSTALL.md](INSTALL.md) | Detailed installation guide |
| [test/README.md](test/README.md) | Testing guide |
| [examples/](examples/) | Code examples |

## 💡 Pro Tips

1. **Always use HTTPS** for callback_url in production
2. **Store transaction IDs** in your database
3. **Implement webhook** for real-time status updates
4. **Test thoroughly** before going live
5. **Monitor rate limits** to avoid errors

## 🆘 Need Help?

- 📧 Email: betabotzpaygate@gmail.com
- 📖 Docs: https://web.btzpay.my.id/documentation
- 🐛 Issues: https://github.com/ERLANRAHMAT/betabotz-paygate/issues

## 🎉 You're Ready!

Congratulations! You've completed the quick start guide. Now you can:

✅ Create payments
✅ Handle callbacks
✅ Test your integration
✅ Build your application

Happy coding! 🚀
