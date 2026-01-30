/**
 * Test Callback Transaction - Betabotz Paygate SDK
 * Test untuk simulasi callback dari payment listener
 */

const BetabotzPaygate = require('../src/index');

// Initialize client
const paygate = new BetabotzPaygate({
  apiKey: process.env.BETABOTZ_API_KEY || 'YOUR_PAYMENT_METHOD_APIKEY',
});

/**
 * Test 1: Callback untuk Dana
 */
async function testCallbackDana() {
  console.log('\n=== Test Callback Dana ===');
  
  try {
    const result = await paygate.sendCallback({
      action: 'update',
      app: 'com.dana.id',
      notification: 'Kamu menerima Rp50.000 dari John Doe',
      amount: 50000,
      appVersionCode: 123,
    });

    console.log('✅ Callback Dana berhasil!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Status:', result.data.status);
    console.log('Amount:', result.data.amount);
    console.log('Paid At:', result.data.paidAt);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 2: Callback untuk GoPay
 */
async function testCallbackGoPay() {
  console.log('\n=== Test Callback GoPay ===');
  
  try {
    const result = await paygate.sendCallback({
      action: 'update',
      app: 'com.gojek.app',
      notification: 'Pembayaran Rp100.000 berhasil diterima',
      amount: 100000,
      appVersionCode: 456,
    });

    console.log('✅ Callback GoPay berhasil!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Status:', result.data.status);
    console.log('Return URL:', result.data.return_url);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 3: Callback untuk OVO
 */
async function testCallbackOVO() {
  console.log('\n=== Test Callback OVO ===');
  
  try {
    const result = await paygate.sendCallback({
      action: 'update',
      app: 'ovo.id',
      notification: 'Terima uang Rp25.500 dari merchant',
      amount: 25500,
      appVersionCode: 789,
    });

    console.log('✅ Callback OVO berhasil!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Status:', result.data.status);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 4: Callback untuk ShopeePay
 */
async function testCallbackShopeePay() {
  console.log('\n=== Test Callback ShopeePay ===');
  
  try {
    const result = await paygate.sendCallback({
      action: 'update',
      app: 'com.shopee.id',
      notification: 'Pembayaran masuk Rp75.000',
      amount: 75000,
      appVersionCode: 321,
    });

    console.log('✅ Callback ShopeePay berhasil!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Status:', result.data.status);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 5: Callback dengan amount custom (unique code)
 */
async function testCallbackWithUniqueCode() {
  console.log('\n=== Test Callback dengan Unique Code ===');
  
  try {
    // Simulasi pembayaran dengan unique code
    // Misal: amount = 10000, unique code = 574, total = 10574
    const result = await paygate.sendCallback({
      action: 'update',
      app: 'com.dana.id',
      notification: 'Kamu menerima Rp10.574 dari Customer',
      amount: 10574, // Amount dengan unique code
      appVersionCode: 123,
    });

    console.log('✅ Callback dengan unique code berhasil!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Total Amount (dengan unique code):', result.data.amount);
    console.log('Status:', result.data.status);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 6: Callback error - Action invalid
 */
async function testCallbackInvalidAction() {
  console.log('\n=== Test Callback Invalid Action ===');
  
  try {
    await paygate.sendCallback({
      action: 'invalid_action', // Wrong action
      app: 'com.dana.id',
      notification: 'Test notification',
      amount: 10000,
      appVersionCode: 6
    });

    console.log('❌ Test should have failed!');
  } catch (error) {
    console.log('✅ Error caught as expected:', error.message);
  }
}

/**
 * Test 7: Callback error - Missing required fields
 */
async function testCallbackMissingFields() {
  console.log('\n=== Test Callback Missing Fields ===');
  
  try {
    await paygate.sendCallback({
      action: 'update',
      // Missing 'app' and 'notification' & app version Code
      amount: 10000,
    });

    console.log('❌ Test should have failed!');
  } catch (error) {
    console.log('✅ Error caught as expected:', error.message);
  }
}

/**
 * Test 8: Complete Flow - Create Transaction + Callback
 */
async function testCompleteFlowWithCallback() {
  console.log('\n=== Test Complete Flow: Create + Callback ===');
  
  try {
    // Step 1: Create transaction
    console.log('\nStep 1: Creating transaction...');
    const transaction = await paygate.createTransaction({
      amount: 50000,
      notes: 'Test Order #999',
      metadata: {
        orderId: '999',
        productName: 'Test Product',
      },
    });

    console.log('✅ Transaction created!');
    console.log('Transaction ID:', transaction.data.transactionId);
    console.log('Total Amount:', transaction.data.totalAmount);
    console.log('Payment URL:', transaction.data.paymentUrl);

    // Step 2: Simulate waiting for payment
    console.log('\nStep 2: Simulating payment process...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Send callback (simulate payment notification)
    console.log('\nStep 3: Sending callback notification...');
    const callbackResult = await paygate.sendCallback({
      action: 'update',
      app: 'com.dana.id',
      notification: `Kamu menerima Rp${transaction.data.totalAmount} dari Customer`,
      amount: transaction.data.totalAmount,
      appVersionCode: 123,
    });

    console.log('✅ Callback sent successfully!');
    console.log('Payment Status:', callbackResult.data.status);
    console.log('Paid At:', callbackResult.data.paidAt);

    // Step 4: Verify transaction status
    console.log('\nStep 4: Verifying transaction status...');
    const verification = await paygate.getTransaction(
      transaction.data.transactionId,
      transaction.data.accessKey
    );

    console.log('✅ Transaction verified!');
    console.log('Final Status:', verification.data.status);
    
    console.log('\n✅ Complete flow finished successfully!');
    
    return {
      transaction: transaction.data,
      callback: callbackResult.data,
      verification: verification.data,
    };
  } catch (error) {
    console.error('❌ Flow error:', error.message);
    throw error;
  }
}

/**
 * Test 9: Multiple Callbacks (Batch Testing)
 */
async function testMultipleCallbacks() {
  console.log('\n=== Test Multiple Callbacks ===');
  
  const testCases = [
    {
      app: 'com.dana.id',
      notification: 'Dana: Rp20.000',
      amount: 20000,
    },
    {
      app: 'com.gojek.app',
      notification: 'GoPay: Rp30.000',
      amount: 30000,
    },
    {
      app: 'ovo.id',
      notification: 'OVO: Rp40.000',
      amount: 40000,
    },
    {
      app: 'com.shopee.id',
      notification: 'ShopeePay: Rp50.000',
      amount: 50000,
    },
  ];

  const results = [];
  
  for (const testCase of testCases) {
    try {
      const result = await paygate.sendCallback({
        action: 'update',
        ...testCase,
        appVersionCode: 123,
      });
      
      results.push({
        success: true,
        app: testCase.app,
        transactionId: result.data.transactionId,
      });
      
      console.log(`✅ ${testCase.app}: Success`);
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({
        success: false,
        app: testCase.app,
        error: error.message,
      });
      
      console.log(`❌ ${testCase.app}: Failed - ${error.message}`);
    }
  }
  
  console.log('\nResults Summary:');
  console.log('Success:', results.filter(r => r.success).length);
  console.log('Failed:', results.filter(r => !r.success).length);
  
  return results;
}

/**
 * Helper: Run all tests
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Betabotz Paygate - Callback Tests    ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // Basic callback tests
    await testCallbackDana();
    await testCallbackGoPay();
    await testCallbackOVO();
    await testCallbackShopeePay();
    
    // Advanced tests
    await testCallbackWithUniqueCode();
    
    // Error handling tests
    await testCallbackInvalidAction();
    await testCallbackMissingFields();
    
    // Complete flow test
    await testCompleteFlowWithCallback();
    
    // Batch test
    await testMultipleCallbacks();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  ✅ All Tests Completed Successfully!  ║');
    console.log('╚════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n╔════════════════════════════════════════╗');
    console.error('║  ❌ Tests Failed!                      ║');
    console.error('╚════════════════════════════════════════╝');
    console.error('\nError:', error.message);
    process.exit(1);
  }
}

// Export functions for individual testing
module.exports = {
  testCallbackDana,
  testCallbackGoPay,
  testCallbackOVO,
  testCallbackShopeePay,
  testCallbackWithUniqueCode,
  testCallbackInvalidAction,
  testCallbackMissingFields,
  testCompleteFlowWithCallback,
  testMultipleCallbacks,
  runAllTests,
};

// Run all tests if executed directly
if (require.main === module) {
  runAllTests();
}
