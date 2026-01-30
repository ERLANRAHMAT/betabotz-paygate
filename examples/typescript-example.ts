/**
 * TypeScript Example - Betabotz Paygate SDK
 * Example usage with TypeScript type definitions
 */

import BetabotzPaygate, {
  BetabotzPaygateConfig,
  CreateTransactionParams,
  TransactionData,
  ApiResponse,
  MerchantCallbackPayload,
} from 'betabotz-paygate';

// Configuration
const config: BetabotzPaygateConfig = {
  apiKey: process.env.BETABOTZ_API_KEY || 'YOUR_API_KEY',
  baseURL: 'https://web.btzpay.my.id',
  timeout: 30000,
};

// Initialize client
const paygate = new BetabotzPaygate(config);

/**
 * Create a transaction with type safety
 */
async function createTypedTransaction(): Promise<TransactionData> {
  const params: CreateTransactionParams = {
    amount: 100000,
    fee: 50,
    paymentMethod: 'qrisgopay',
    timeout: 900000,
    callback_url: 'https://yourdomain.com/webhook',
    return_url: 'https://yourdomain.com/success',
    notes: 'Order #12345',
    customerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '081234567890',
    },
    metadata: {
      orderId: '12345',
      productName: 'Premium Package',
      customNotif: 'Thank you for your purchase!',
    },
  };

  try {
    const response: ApiResponse<TransactionData> = await paygate.createTransaction(params);
    
    if (response.success && response.data) {
      console.log('Transaction created:', response.data.transactionId);
      console.log('Payment URL:', response.data.paymentUrl);
      console.log('Status:', response.data.status);
      
      return response.data;
    } else {
      throw new Error('Failed to create transaction');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Check transaction status with type safety
 */
async function checkTransactionStatus(
  transactionId: string,
  accessKey: string
): Promise<TransactionData> {
  try {
    const response: ApiResponse<TransactionData> = await paygate.getTransaction(
      transactionId,
      accessKey
    );

    if (response.success && response.data) {
      console.log('Status:', response.data.status);
      console.log('Amount:', response.data.amount);
      
      return response.data;
    } else {
      throw new Error('Transaction not found');
    }
  } catch (error) {
    console.error('Error checking status:', error);
    throw error;
  }
}

/**
 * Handle webhook callback with type safety
 */
function handleWebhookCallback(payload: MerchantCallbackPayload): void {
  console.log('Webhook received:', payload.pay_id);
  console.log('Status:', payload.status);
  
  switch (payload.status) {
    case 'sukses':
      console.log('✅ Payment successful!');
      // Process successful payment
      if (payload.raw.data.orderId) {
        processOrder(payload.raw.data.orderId);
      }
      break;
      
    case 'expired':
      console.log('⏱️ Payment expired');
      // Handle expired payment
      break;
      
    case 'cancel':
      console.log('❌ Payment cancelled');
      // Handle cancelled payment
      break;
      
    case 'gagal':
      console.log('❌ Payment failed');
      // Handle failed payment
      break;
      
    default:
      console.log('Unknown status:', payload.status);
  }
}

/**
 * Process order after successful payment
 */
function processOrder(orderId: string): void {
  console.log(`Processing order: ${orderId}`);
  // Implement your order processing logic here
}

/**
 * Cancel transaction with type safety
 */
async function cancelTransactionSafely(transactionId: string): Promise<void> {
  try {
    const response = await paygate.cancelTransaction(
      transactionId,
      'User requested cancellation'
    );

    if (response.success) {
      console.log('Transaction cancelled:', response.data?.transactionId);
      console.log('New status:', response.data?.status);
    }
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    throw error;
  }
}

/**
 * Complete payment flow with error handling
 */
async function completePaymentFlow(): Promise<void> {
  try {
    // Step 1: Create transaction
    console.log('Step 1: Creating transaction...');
    const transaction = await createTypedTransaction();
    
    // Step 2: Get payment URL
    console.log('\nStep 2: Getting payment URL...');
    const paymentUrl = paygate.getPaymentUrl(
      transaction.transactionId,
      transaction.accessKey
    );
    console.log('Payment URL:', paymentUrl);
    
    // Step 3: Simulate waiting
    console.log('\nStep 3: Waiting for payment...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 4: Check status
    console.log('\nStep 4: Checking status...');
    const status = await checkTransactionStatus(
      transaction.transactionId,
      transaction.accessKey
    );
    
    console.log('\nPayment flow completed!');
    console.log('Final status:', status.status);
  } catch (error) {
    console.error('Payment flow error:', error);
  }
}

// Export functions
export {
  createTypedTransaction,
  checkTransactionStatus,
  handleWebhookCallback,
  cancelTransactionSafely,
  completePaymentFlow,
};

// Run if executed directly
if (require.main === module) {
  completePaymentFlow();
}
