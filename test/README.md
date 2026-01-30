# Betabotz Paygate SDK - Test Suite

Folder ini berisi test files untuk menguji semua fungsi SDK Betabotz Paygate.

## 📂 Test Files

### 1. `transaction.test.js`
Test untuk operasi transaksi dasar:
- ✅ Create simple transaction
- ✅ Create detailed transaction  
- ✅ Get transaction details
- ✅ Cancel transaction
- ✅ Multiple payment methods
- ✅ Minimum/maximum amount
- ✅ Custom timeout
- ✅ Error handling
- ✅ Complete transaction lifecycle

### 2. `callback.test.js`
Test untuk callback dari payment listener:
- ✅ Callback Dana
- ✅ Callback GoPay
- ✅ Callback OVO
- ✅ Callback ShopeePay
- ✅ Callback with unique code
- ✅ Error handling (invalid action, missing fields)
- ✅ Complete flow (create + callback)
- ✅ Multiple callbacks (batch testing)

## 🚀 Cara Menjalankan Test

### Setup Environment

```bash
# Edit .env dan isi API key Anda
nano .env
```

### Run All Tests

```bash
# Test transaction operations
node test/transaction.test.js

# Test callback operations
node test/callback.test.js
```

### Run Individual Test

```javascript
// Import test file
const { testCreateSimpleTransaction } = require('./test/transaction.test');
const { testCallbackDana } = require('./test/callback.test');

// Run specific test
testCreateSimpleTransaction();
testCallbackDana();
```

## 📋 Test Coverage

### Transaction Tests (11 tests)

| Test | Description | Status |
|------|-------------|--------|
| Create Simple | Create basic transaction | ✅ |
| Create Detailed | Create with full parameters | ✅ |
| Get Transaction | Retrieve transaction details | ✅ |
| Cancel Transaction | Cancel pending transaction | ✅ |
| All Payment Methods | Test all supported methods | ✅ |
| Minimum Amount | Test Rp 1 transaction | ✅ |
| Large Amount | Test Rp 10,000,000 transaction | ✅ |
| Custom Timeout | Test custom expiry time | ✅ |
| Invalid Amount | Error handling for amount = 0 | ✅ |
| Missing Amount | Error handling for missing amount | ✅ |
| Complete Lifecycle | Full transaction flow | ✅ |

### Callback Tests (9 tests)

| Test | Description | Status |
|------|-------------|--------|
| Callback Dana | Test Dana notification | ✅ |
| Callback GoPay | Test GoPay notification | ✅ |
| Callback OVO | Test OVO notification | ✅ |
| Callback ShopeePay | Test ShopeePay notification | ✅ |
| Unique Code | Test with unique fee code | ✅ |
| Invalid Action | Error handling for wrong action | ✅ |
| Missing Fields | Error handling for missing data | ✅ |
| Complete Flow | Create + callback + verify | ✅ |
| Multiple Callbacks | Batch callback testing | ✅ |

## 🎯 Expected Results

### Successful Test
```
✅ Transaction created successfully!
Transaction ID: TRX17685466153087427
Payment URL: https://web.btzpay.my.id/transaction/TRX...
Status: pending
Total Amount: 50000
```

### Error Handling Test
```
✅ Error caught as expected: Amount must be a number
```

## 📝 Notes

- Pastikan API key valid sebelum menjalankan test
- Beberapa test memiliki delay untuk menghindari rate limiting
- Test akan otomatis skip jika API key tidak valid
- Gunakan environment variable untuk menyimpan API key

## 🔧 Troubleshooting

### Error: "API Key is required"
```bash
# Set environment variable
export BETABOTZ_API_KEY=your_api_key_here

# Atau edit .env file
echo "BETABOTZ_API_KEY=your_api_key_here" > .env
```

### Error: "Rate limit exceeded"
```javascript
// Tambahkan delay antara test
await new Promise(resolve => setTimeout(resolve, 1000));
```

### Error: "Transaction not found"
```javascript
// Pastikan menggunakan accessKey yang benar
const details = await paygate.getTransaction(transactionId, accessKey);
```

## 💡 Tips

1. **Run tests secara terpisah** untuk debugging yang lebih mudah
2. **Gunakan environment variables** untuk sensitive data
3. **Check rate limits** jika test gagal
4. **Simpan transaction IDs** untuk testing manual
5. **Review console output** untuk debugging

## 🔗 Related Documentation

- [Main README](../README.md)
- [API Documentation](https://web.btzpay.my.id/documentation)
- [Examples](../examples/)

## 📧 Support

Jika menemukan bug atau ada pertanyaan:
- Email: betabotzpaygate@gmail.com
- GitHub Issues: [Create Issue](https://github.com/betabotz/betabotz-paygate/issues)
