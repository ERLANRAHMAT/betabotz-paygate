/**
 * Test Transaction Operations - Betabotz Paygate SDK
 * Test untuk create, get, dan cancel transaction
 */

const BetabotzPaygate = require('../src/index');

// Initialize client
const paygate = new BetabotzPaygate({
  apiKey: process.env.BETABOTZ_API_KEY || 'YOUR_PAYMENT_METHOD_APIKEY',
});

/**
 * Test 1: Create simple transaction
 */
async function testCreateSimpleTransaction() {
  console.log('\n=== Test Create Simple Transaction ===');
  
  try {
    const result = await paygate.createTransaction({
      amount: 50000,
      notes: 'Test simple transaction',
    });

    console.log('✅ Transaction created successfully!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Payment URL:', result.data.paymentUrl);
    console.log('Status:', result.data.status);
    console.log('Total Amount:', result.data.totalAmount);
    
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 2: Create transaction with full details
 */
async function testCreateDetailedTransaction() {
  console.log('\n=== Test Create Detailed Transaction ===');
  
  try {
    const result = await paygate.createTransaction({
      amount: 100000,
      fee: 50,
      paymentMethod: 'qrisgopay',
      timeout: 900000, // 15 minutes
      callback_url: 'https://yourdomain.com/webhook',
      return_url: 'https://yourdomain.com/success',
      notes: 'Premium package order',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
      },
      metadata: {
        orderId: 'ORD-001',
        productName: 'Premium Package',
        quantity: 1,
      },
    });

    console.log('✅ Detailed transaction created!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Payment Method:', result.data.paymentMethod);
    console.log('Customer:', result.data.customerInfo?.name);
    console.log('Order ID:', result.data.metadata?.orderId);
    
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 3: Create transaction for each payment method
 */
async function testCreateTransactionAllMethods() {
  console.log('\n=== Test Create Transaction - All Methods ===');
  
  const methods = ['qrisdana', 'qrisgopay', 'qrisorkut', 'qrisshopeepay'];
  const results = [];

  for (const method of methods) {
    try {
      console.log(`\nCreating transaction for ${method}...`);
      
      const result = await paygate.createTransaction({
        amount: 25000,
        paymentMethod: method,
        notes: `Test payment via ${method}`,
      });

      results.push({
        success: true,
        method: method,
        transactionId: result.data.transactionId,
      });

      console.log(`✅ ${method}: ${result.data.transactionId}`);
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      results.push({
        success: false,
        method: method,
        error: error.message,
      });
      
      console.error(`❌ ${method}: ${error.message}`);
    }
  }

  console.log('\nSummary:');
  console.log('Success:', results.filter(r => r.success).length);
  console.log('Failed:', results.filter(r => !r.success).length);
  
  return results;
}

/**
 * Test 4: Get transaction details
 */
async function testGetTransaction() {
  console.log('\n=== Test Get Transaction ===');
  
  try {
    // First, create a transaction
    console.log('Creating transaction...');
    const created = await paygate.createTransaction({
      amount: 30000,
      notes: 'Test get transaction',
    });

    console.log('Transaction created:', created.data.transactionId);

    // Then, get the transaction details
    console.log('\nGetting transaction details...');
    const details = await paygate.getTransaction(
      created.data.transactionId,
      created.data.accessKey
    );

    console.log('✅ Transaction details retrieved!');
    console.log('Transaction ID:', details.data.transactionId);
    console.log('Amount:', details.data.amount);
    console.log('Status:', details.data.status);
    console.log('Created At:', details.data.createdAt);
    console.log('Expired At:', details.data.expiredAt);
    
    return details.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 5: Cancel transaction
 */
async function testCancelTransaction() {
  console.log('\n=== Test Cancel Transaction ===');
  
  try {
    // First, create a transaction
    console.log('Creating transaction...');
    const created = await paygate.createTransaction({
      amount: 40000,
      notes: 'Test cancel transaction',
    });

    console.log('Transaction created:', created.data.transactionId);
    console.log('Initial status:', created.data.status);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Then, cancel it
    console.log('\nCancelling transaction...');
    const cancelled = await paygate.cancelTransaction(
      created.data.transactionId,
      'User requested cancellation for testing'
    );

    console.log('✅ Transaction cancelled successfully!');
    console.log('Transaction ID:', cancelled.data.transactionId);
    console.log('New Status:', cancelled.data.status);
    console.log('Callback Sent:', cancelled.callback?.sent);
    
    return cancelled.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 6: Transaction with minimum amount
 */
async function testMinimumAmount() {
  console.log('\n=== Test Minimum Amount (Rp 1) ===');
  
  try {
    const result = await paygate.createTransaction({
      amount: 1, // Minimum amount
      notes: 'Test minimum amount',
    });

    console.log('✅ Transaction with Rp 1 created!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Amount:', result.data.amount);
    
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 7: Transaction with large amount
 */
async function testLargeAmount() {
  console.log('\n=== Test Large Amount (Rp 10,000,000) ===');
  
  try {
    const result = await paygate.createTransaction({
      amount: 10000000, // 10 million
      notes: 'Test large amount transaction',
    });

    console.log('✅ Transaction with Rp 10,000,000 created!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Amount:', result.data.amount);
    console.log('Total Amount:', result.data.totalAmount);
    
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 8: Transaction with custom timeout
 */
async function testCustomTimeout() {
  console.log('\n=== Test Custom Timeout ===');
  
  try {
    const result = await paygate.createTransaction({
      amount: 50000,
      timeout: 300000, // 5 minutes
      notes: 'Test custom timeout',
    });

    console.log('✅ Transaction with custom timeout created!');
    console.log('Transaction ID:', result.data.transactionId);
    console.log('Expires At:', result.data.expiredAt);
    
    // Calculate timeout duration
    const created = new Date(result.data.createdAt);
    const expires = new Date(result.data.expiredAt);
    const duration = (expires - created) / 1000 / 60; // in minutes
    
    console.log('Timeout Duration:', duration.toFixed(2), 'minutes');
    
    return result.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Test 9: Error handling - Invalid amount
 */
async function testInvalidAmount() {
  console.log('\n=== Test Invalid Amount ===');
  
  try {
    await paygate.createTransaction({
      amount: 0, // Invalid: less than 1
      notes: 'Test invalid amount',
    });

    console.log('❌ Test should have failed!');
  } catch (error) {
    console.log('✅ Error caught as expected:', error.message);
  }
}

/**
 * Test 10: Error handling - Missing amount
 */
async function testMissingAmount() {
  console.log('\n=== Test Missing Amount ===');
  
  try {
    await paygate.createTransaction({
      notes: 'Test missing amount',
    });

    console.log('❌ Test should have failed!');
  } catch (error) {
    console.log('✅ Error caught as expected:', error.message);
  }
}

/**
 * Test 11: Complete transaction lifecycle
 */
async function testCompleteLifecycle() {
  console.log('\n=== Test Complete Transaction Lifecycle ===');
  
  try {
    // 1. Create
    console.log('\n1. Creating transaction...');
    const created = await paygate.createTransaction({
      amount: 75000,
      notes: 'Complete lifecycle test',
      metadata: {
        orderId: 'LIFECYCLE-001',
      },
    });
    console.log('✅ Created:', created.data.transactionId);

    // 2. Get details
    console.log('\n2. Getting transaction details...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const details = await paygate.getTransaction(
      created.data.transactionId,
      created.data.accessKey
    );
    console.log('✅ Status:', details.data.status);

    // 3. Generate payment URL
    console.log('\n3. Generating payment URL...');
    const paymentUrl = paygate.getPaymentUrl(
      created.data.transactionId,
      created.data.accessKey
    );
    console.log('✅ Payment URL:', paymentUrl);

    // 4. Simulate waiting
    console.log('\n4. Simulating user interaction...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Cancel
    console.log('\n5. Cancelling transaction...');
    const cancelled = await paygate.cancelTransaction(
      created.data.transactionId,
      'Lifecycle test completed'
    );
    console.log('✅ Final status:', cancelled.data.status);

    console.log('\n✅ Complete lifecycle test finished!');
    
    return {
      created: created.data,
      details: details.data,
      cancelled: cancelled.data,
    };
  } catch (error) {
    console.error('❌ Lifecycle error:', error.message);
    throw error;
  }
}

/**
 * Helper: Run all tests
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Betabotz Paygate - Transaction Tests ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // Basic tests
    await testCreateSimpleTransaction();
    await testCreateDetailedTransaction();
    await testGetTransaction();
    await testCancelTransaction();
    
    // Amount tests
    await testMinimumAmount();
    await testLargeAmount();
    
    // Advanced tests
    await testCustomTimeout();
    await testCreateTransactionAllMethods();
    
    // Error handling tests
    await testInvalidAmount();
    await testMissingAmount();
    
    // Lifecycle test
    await testCompleteLifecycle();
    
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
  testCreateSimpleTransaction,
  testCreateDetailedTransaction,
  testCreateTransactionAllMethods,
  testGetTransaction,
  testCancelTransaction,
  testMinimumAmount,
  testLargeAmount,
  testCustomTimeout,
  testInvalidAmount,
  testMissingAmount,
  testCompleteLifecycle,
  runAllTests,
};

// Run all tests if executed directly
if (require.main === module) {
  runAllTests();
}
