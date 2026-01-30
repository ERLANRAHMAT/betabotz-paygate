/**
 * Basic Example - Betabotz Paygate SDK
 * Simple usage example for creating and managing transactions
 */

const BetabotzPaygate = require('betabotz-paygate');

// Initialize the client with your API key
const paygate = new BetabotzPaygate({
  apiKey: 'YOUR_PAYMENT_METHOD_APIKEY', // Replace with your actual API key
});

/**
 * Example 1: Create a simple transaction
 */
async function createSimpleTransaction() {
  try {
    console.log('Creating transaction...');

    const transaction = await paygate.createTransaction({
      amount: 50000, // Rp 50,000
      notes: 'Payment for Order #12345',
    });

    console.log('✅ Transaction created successfully!');
    console.log('Transaction ID:', transaction.data.transactionId);
    console.log('Payment URL:', transaction.data.paymentUrl);
    console.log('Total Amount:', transaction.data.totalAmount);
    console.log('Status:', transaction.data.status);
    console.log('Expires At:', transaction.data.expiredAt);

    return transaction.data;
  } catch (error) {
    console.error('❌ Error creating transaction:', error.message);
    throw error;
  }
}

/**
 * Example 2: Create transaction with full details
 */
async function createDetailedTransaction() {
  try {
    console.log('Creating detailed transaction...');

    const transaction = await paygate.createTransaction({
      amount: 100000, // Rp 100,000
      fee: 50, // Fixed fee Rp 50
      paymentMethod: 'qrisgopay', // Specify payment method
      timeout: 900000, // 15 minutes
      callback_url: 'https://yourdomain.com/webhook/payment',
      return_url: 'https://yourdomain.com/order/success',
      notes: 'Premium Package Purchase',
      customerInfo: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '081234567890',
      },
      metadata: {
        orderId: 'ORD-2026-001',
        productName: 'Premium Membership',
        productSku: 'PREM-001',
        quantity: 1,
      },
    });

    console.log('✅ Detailed transaction created!');
    console.log('Transaction Details:', JSON.stringify(transaction.data, null, 2));

    return transaction.data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Example 3: Check transaction status
 */
async function checkTransactionStatus(transactionId, accessKey) {
  try {
    console.log(`Checking status for transaction: ${transactionId}`);

    const details = await paygate.getTransaction(transactionId, accessKey);

    console.log('Transaction Status:', details.data.status);
    console.log('Amount:', details.data.amount);
    console.log('Created At:', details.data.createdAt);

    if (details.data.paidAt) {
      console.log('Paid At:', details.data.paidAt);
    }

    return details.data;
  } catch (error) {
    console.error('❌ Error checking status:', error.message);
    throw error;
  }
}

/**
 * Example 4: Cancel a transaction
 */
async function cancelTransaction(transactionId) {
  try {
    console.log(`Cancelling transaction: ${transactionId}`);

    const result = await paygate.cancelTransaction(
      transactionId,
      'User requested cancellation'
    );

    console.log('✅ Transaction cancelled successfully!');
    console.log('New Status:', result.data.status);
    console.log('Callback Sent:', result.callback?.sent);

    return result.data;
  } catch (error) {
    console.error('❌ Error cancelling transaction:', error.message);
    throw error;
  }
}

/**
 * Example 5: Generate payment URL
 */
function generatePaymentUrl(transactionId, accessKey) {
  const paymentUrl = paygate.getPaymentUrl(transactionId, accessKey);
  console.log('Payment URL:', paymentUrl);
  return paymentUrl;
}

/**
 * Example 6: Complete flow - Create, Check, and Cancel
 */
async function completeFlow() {
  try {
    // Step 1: Create transaction
    console.log('\n=== Step 1: Creating Transaction ===');
    const transaction = await createSimpleTransaction();

    // Step 2: Generate payment URL
    console.log('\n=== Step 2: Generating Payment URL ===');
    const paymentUrl = generatePaymentUrl(
      transaction.transactionId,
      transaction.accessKey
    );

    // Step 3: Check status (simulate waiting)
    console.log('\n=== Step 3: Checking Status ===');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    await checkTransactionStatus(transaction.transactionId, transaction.accessKey);

    // Step 4: Cancel transaction (for demo purposes)
    console.log('\n=== Step 4: Cancelling Transaction (Demo) ===');
    await cancelTransaction(transaction.transactionId);

    console.log('\n✅ Complete flow finished successfully!');
  } catch (error) {
    console.error('\n❌ Flow error:', error.message);
  }
}

// Run examples
if (require.main === module) {
  console.log('=== Betabotz Paygate SDK Examples ===\n');

  // Uncomment the example you want to run:

  // createSimpleTransaction();
  // createDetailedTransaction();
  completeFlow();

  // Or run specific examples with your own transaction data:
  // checkTransactionStatus('TRX123456789', 'your_access_key');
  // cancelTransaction('TRX123456789');
}

// Export functions for use in other files
module.exports = {
  createSimpleTransaction,
  createDetailedTransaction,
  checkTransactionStatus,
  cancelTransaction,
  generatePaymentUrl,
  completeFlow,
};
