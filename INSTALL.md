# Installation Guide - Betabotz Paygate SDK

Panduan lengkap untuk menginstall dan setup Betabotz Paygate SDK.

## 📋 Requirements

- Node.js >= 14.0.0
- npm atau yarn
- API Key dari Betabotz Paygate Dashboard

## 🚀 Installation Methods

### Method 1: Install from ZIP (Recommended)

```bash
# 1. Extract ZIP file
unzip betabotz-paygate-sdk.zip
cd betabotz-paygate-sdk

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env
nano .env  # Edit dan isi API key Anda
```

### Method 2: Install from npm (When Published)

```bash
npm install betabotz-paygate
```

### Method 3: Install from Local Directory

```bash
# Jika SDK ada di folder lokal
npm install ./path/to/betabotz-paygate-sdk
```

## ⚙️ Configuration

### 1. Setup Environment Variables

Edit file `.env`:

```bash
# Betabotz Paygate Configuration
BETABOTZ_API_KEY=YOUR_PAYMENT_METHOD_APIKEY
BETABOTZ_BASE_URL=https://web.btzpay.my.id
BETABOTZ_TIMEOUT=30000

# Server Configuration (optional, for webhook server)
PORT=3000
DOMAIN=https://yourdomain.com
```

### 2. Get Your API Key

1. Login ke [Betabotz Paygate Dashboard](https://web.btzpay.my.id)
2. Klik menu **Configuration**
3. Tambah atau pilih **Payment Method**
4. Copy **API Key** yang ditampilkan
5. Paste ke file `.env`

## 📦 Project Structure

```
betabotz-paygate-sdk/
├── src/
│   ├── index.js           # Main SDK
│   └── index.d.ts         # TypeScript definitions
├── examples/
│   ├── basic.js           # Basic usage
│   ├── advanced.js        # Advanced patterns
│   ├── webhook-server.js  # Express server example
│   └── typescript-example.ts
├── test/
│   ├── callback.test.js   # Callback tests
│   ├── transaction.test.js # Transaction tests
│   ├── run.js             # Test runner
│   └── README.md          # Test documentation
├── package.json
├── README.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
└── .env.example
```

## ✅ Verify Installation

### Quick Test

```bash
# Test dengan Node.js
node -e "const SDK = require('./src/index'); console.log('SDK loaded:', typeof SDK);"
```

### Run Example

```javascript
// test-install.js
const BetabotzPaygate = require('./src/index');

const paygate = new BetabotzPaygate({
  apiKey: process.env.BETABOTZ_API_KEY || 'test_key',
});

console.log('✅ SDK initialized successfully!');
console.log('Base URL:', paygate.baseURL);
console.log('Timeout:', paygate.timeout);
```

```bash
node test-install.js
```

### Run Test Suite

```bash
# Run all tests
npm test

# Run specific test
npm run test:transaction
```

## 🔧 Troubleshooting

### Error: "Cannot find module 'axios'"

```bash
npm install axios
```

### Error: "API Key is required"

Pastikan API key sudah diset di `.env`:

```bash
echo "BETABOTZ_API_KEY=your_actual_api_key" >> .env
```

### Error: "ECONNREFUSED"

Check:
1. Koneksi internet aktif
2. Base URL benar (`https://web.btzpay.my.id`)
3. Firewall tidak memblok koneksi

## 📚 Next Steps

### 1. Read Documentation

```bash
# Open README
cat README.md

# Open Test Documentation
cat test/README.md
```

### 2. Try Examples

```bash
# Basic example
node examples/basic.js

# Webhook server
node examples/webhook-server.js
```

### 3. Write Your First Integration

```javascript
// my-first-payment.js
const BetabotzPaygate = require('betabotz-paygate');

const paygate = new BetabotzPaygate({
  apiKey: process.env.BETABOTZ_API_KEY,
});

async function createFirstPayment() {
  try {
    const transaction = await paygate.createTransaction({
      amount: 10000,
      notes: 'My first payment!',
    });
    
    console.log('Payment URL:', transaction.data.paymentUrl);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createFirstPayment();
```

## 🆘 Getting Help

- 📖 Documentation: [README.md](README.md)
- 🧪 Test Examples: [test/README.md](test/README.md)
- 🌐 API Docs: https://web.btzpay.my.id/documentation
- 📧 Support: betabotzpaygate@gmail.com
- 🐛 Issues: https://github.com/ERLANRAHMAT/betabotz-paygate/issues

## 🎉 Installation Complete!

Selamat! SDK sudah terinstall dengan baik. Silakan mulai develop aplikasi Anda dengan Betabotz Paygate!

### Quick Reference

```javascript
// Initialize
const paygate = new BetabotzPaygate({ apiKey: 'YOUR_KEY' });

// Create transaction
const tx = await paygate.createTransaction({ amount: 10000 });

// Get transaction
const details = await paygate.getTransaction(txId, accessKey);

// Cancel transaction
const result = await paygate.cancelTransaction(txId);

// Send callback
await paygate.sendCallback({
  action: 'update',
  app: 'com.dana.id',
  notification: 'Rp10.000',
  amount: 10000,
});
```

Happy coding! 🚀
