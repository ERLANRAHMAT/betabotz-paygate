# Betabotz Paygate SDK - Documentation Index

📦 **Version:** 1.0.0  
📅 **Release Date:** January 30, 2026  
🏢 **Developer:** Betabotz

---

## 📚 Documentation Files

### Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start guide
- **[INSTALL.md](INSTALL.md)** - Detailed installation instructions
- **[README.md](README.md)** - Main documentation & API reference

### Development
- **[CHANGELOG.md](CHANGELOG.md)** - Version history & changes
- **[LICENSE](LICENSE)** - MIT License
- **[.env.example](.env.example)** - Environment variables template

---

## 📂 Directory Structure

```
betabotz-paygate-sdk/
│
├── 📄 Documentation
│   ├── INDEX.md              ← You are here
│   ├── README.md             Main documentation
│   ├── QUICKSTART.md         Quick start guide
│   ├── INSTALL.md            Installation guide
│   ├── CHANGELOG.md          Version history
│   └── LICENSE               MIT License
│
├── 💻 Source Code
│   └── src/
│       ├── index.js          Main SDK implementation
│       └── index.d.ts        TypeScript type definitions
│
├── 📘 Examples
│   └── examples/
│       ├── basic.js          Basic usage examples
│       ├── advanced.js       Advanced patterns
│       ├── webhook-server.js Express.js webhook server
│       └── typescript-example.ts TypeScript examples
│
├── 🧪 Tests
│   └── test/
│       ├── README.md         Testing documentation
│       ├── callback.test.js  Callback tests
│       ├── transaction.test.js Transaction tests
│       └── run.js            Test runner
│
└── ⚙️ Configuration
    ├── package.json          NPM package configuration
    ├── .env.example          Environment template
    └── .gitignore            Git ignore rules
```

---

## 🎯 Quick Navigation

### I'm a beginner, where do I start?
1. Read **[QUICKSTART.md](QUICKSTART.md)** (5 minutes)
2. Follow **[INSTALL.md](INSTALL.md)**
3. Run `examples/basic.js`

### I want to integrate payment gateway
1. Read **[README.md](README.md)** - API Methods section
2. Study `examples/webhook-server.js`
3. Check `test/` folder for examples

### I need specific information about...

| Topic | File |
|-------|------|
| Installation | [INSTALL.md](INSTALL.md) |
| API Methods | [README.md](README.md) #api-methods |
| Create Transaction | [README.md](README.md) #create-transaction |
| Handle Webhook | [examples/webhook-server.js](examples/webhook-server.js) |
| Testing | [test/README.md](test/README.md) |
| Callbacks | [test/callback.test.js](test/callback.test.js) |
| TypeScript | [examples/typescript-example.ts](examples/typescript-example.ts) |
| Error Handling | [examples/advanced.js](examples/advanced.js) |

### I want to see code examples

| Example | File |
|---------|------|
| Basic Usage | [examples/basic.js](examples/basic.js) |
| Complete Flow | `examples/basic.js` - completeFlow() |
| Webhook Server | [examples/webhook-server.js](examples/webhook-server.js) |
| Retry Logic | `examples/advanced.js` - createTransactionWithRetry() |
| Batch Creation | `examples/advanced.js` - createBatchTransactions() |
| Status Polling | `examples/advanced.js` - pollTransactionStatus() |
| TypeScript | [examples/typescript-example.ts](examples/typescript-example.ts) |

### I need to test the SDK

| Test Type | Command |
|-----------|---------|
| All Tests | `npm test` |
| Transaction Tests | `npm run test:transaction` |
| Callback Tests | `npm run test:callback` |
| Custom Test | `node test/callback.test.js` |

See [test/README.md](test/README.md) for details.

---

## 🔗 External Resources

- **Dashboard:** https://web.btzpay.my.id
- **API Documentation:** https://web.btzpay.my.id/documentation
- **Support Email:** betabotzpaygate@gmail.com
- **GitHub Issues:** https://github.com/ERLANRAHMAT/betabotz-paygate/issues

---

## 📖 Reading Recommendations

### For Complete Beginners
1. **QUICKSTART.md** - Get started in 5 minutes
2. **examples/basic.js** - See working code
3. **README.md** - Understand the API

### For Developers
1. **README.md** - Full API reference
2. **examples/webhook-server.js** - Production patterns
3. **examples/advanced.js** - Advanced techniques
4. **test/** - Testing patterns

### For TypeScript Users
1. **src/index.d.ts** - Type definitions
2. **examples/typescript-example.ts** - TypeScript examples
3. **README.md** - TypeScript section

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Installation errors | See [INSTALL.md](INSTALL.md) #troubleshooting |
| API errors | See [README.md](README.md) #error-handling |
| Test failures | See [test/README.md](test/README.md) #troubleshooting |
| Rate limits | See [README.md](README.md) #rate-limits |

---

## 📊 SDK Features Checklist

- ✅ Create QRIS transactions
- ✅ Get transaction details
- ✅ Cancel transactions
- ✅ Send payment callbacks
- ✅ Multiple payment methods (Dana, GoPay, OVO, ShopeePay)
- ✅ Customer information
- ✅ Custom metadata
- ✅ Webhook integration
- ✅ TypeScript support
- ✅ Comprehensive tests
- ✅ Error handling
- ✅ Examples & documentation

---

## 🎓 Learning Path

### Level 1: Basics (1 hour)
- [ ] Read QUICKSTART.md
- [ ] Install SDK
- [ ] Run basic.js example
- [ ] Create first payment

### Level 2: Integration (2-4 hours)
- [ ] Setup webhook server
- [ ] Implement payment flow
- [ ] Handle callbacks
- [ ] Add error handling

### Level 3: Advanced (4-8 hours)
- [ ] Multiple payment methods
- [ ] Custom metadata
- [ ] Retry mechanisms
- [ ] Testing & QA

### Level 4: Production (1-2 days)
- [ ] Security review
- [ ] Performance optimization
- [ ] Monitoring setup
- [ ] Go live!

---

## 📝 Quick Reference

### Initialize SDK
```javascript
const BetabotzPaygate = require('betabotz-paygate');
const paygate = new BetabotzPaygate({ apiKey: 'YOUR_KEY' });
```

### Create Payment
```javascript
const tx = await paygate.createTransaction({ amount: 10000 });
```

### Check Status
```javascript
const details = await paygate.getTransaction(txId, accessKey);
```

### Cancel Payment
```javascript
await paygate.cancelTransaction(txId);
```

### Send Callback
```javascript
await paygate.sendCallback({
  action: 'update',
  app: 'com.dana.id',
  notification: 'Rp10.000',
  amount: 10000,
});
```

---

**Last Updated:** January 30, 2026  
**SDK Version:** 1.0.0

For the latest updates, visit: https://web.btzpay.my.id
