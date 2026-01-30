/**
 * Advanced Examples - Betabotz Paygate SDK
 * Advanced usage patterns and best practices
 */

const BetabotzPaygate = require('betabotz-paygate');

// Initialize with custom configuration
const paygate = new BetabotzPaygate({
  apiKey: process.env.BETABOTZ_API_KEY || 'YOUR_API_KEY',
  baseURL: process.env.BETABOTZ_BASE_URL || 'https://web.btzpay.my.id',
  timeout: 60000, // 60 seconds for slow connections
});

/**
 * Example 1: Retry mechanism for failed requests
 */
async function createTransactionWithRetry(params, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}...`);
      const transaction = await paygate.createTransaction(params);
      console.log('✅ Success on attempt', attempt);
      return transaction;
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);

      // Don't retry on validation errors
      if (error.status === 400) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Example 2: Batch transaction creation
 */
async function createBatchTransactions(orders) {
  const results = [];
  const errors = [];

  console.log(`Creating ${orders.length} transactions...`);

  for (const order of orders) {
    try {
      const transaction = await paygate.createTransaction({
        amount: order.amount,
        notes: `Order ${order.id}`,
        metadata: {
          orderId: order.id,
          productName: order.product,
        },
      });

      results.push({
        orderId: order.id,
        transactionId: transaction.data.transactionId,
        paymentUrl: transaction.data.paymentUrl,
      });

      console.log(`✅ Created transaction for order ${order.id}`);
    } catch (error) {
      errors.push({
        orderId: order.id,
        error: error.message,
      });
      console.error(`❌ Failed to create transaction for order ${order.id}`);
    }

    // Rate limiting: wait between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { results, errors };
}

/**
 * Example 3: Transaction status polling
 */
async function pollTransactionStatus(transactionId, accessKey, options = {}) {
  const {
    maxAttempts = 30,
    intervalMs = 2000,
    onUpdate = null,
  } = options;

  console.log('Starting to poll transaction status...');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const details = await paygate.getTransaction(transactionId, accessKey);
      const status = details.data.status;

      console.log(`[${attempt}/${maxAttempts}] Status: ${status}`);

      // Call callback if provided
      if (onUpdate) {
        onUpdate(status, details.data);
      }

      // Check if transaction is in terminal state
      if (['sukses', 'gagal', 'expired', 'cancel'].includes(status)) {
        console.log('✅ Transaction reached terminal state:', status);
        return details.data;
      }

      // Wait before next poll
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    } catch (error) {
      console.error(`Poll attempt ${attempt} failed:`, error.message);
    }
  }

  throw new Error('Transaction status polling timeout');
}

/**
 * Example 4: Automatic cancellation on timeout
 */
async function createTransactionWithAutoCancel(params, timeoutMs = 300000) {
  const transaction = await paygate.createTransaction(params);
  const { transactionId, accessKey } = transaction.data;

  console.log('Transaction created:', transactionId);
  console.log('Auto-cancel timeout:', timeoutMs / 1000, 'seconds');

  // Set timeout for auto-cancellation
  const cancelTimer = setTimeout(async () => {
    try {
      const details = await paygate.getTransaction(transactionId, accessKey);

      if (details.data.status === 'pending') {
        console.log('⏱️ Timeout reached, auto-cancelling...');
        await paygate.cancelTransaction(transactionId, 'auto_cancel_timeout');
        console.log('✅ Transaction auto-cancelled');
      }
    } catch (error) {
      console.error('Error during auto-cancel:', error.message);
    }
  }, timeoutMs);

  // Monitor transaction status
  const finalStatus = await pollTransactionStatus(transactionId, accessKey, {
    maxAttempts: Math.ceil(timeoutMs / 2000),
    intervalMs: 2000,
    onUpdate: (status) => {
      if (status !== 'pending') {
        clearTimeout(cancelTimer);
      }
    },
  });

  clearTimeout(cancelTimer);
  return finalStatus;
}

/**
 * Example 5: Dynamic fee calculation
 */
async function createTransactionWithDynamicFee(baseAmount, feePercentage = 0) {
  // Calculate fee based on percentage
  const calculatedFee = Math.round(baseAmount * (feePercentage / 100));

  const transaction = await paygate.createTransaction({
    amount: baseAmount,
    fee: calculatedFee,
    notes: `Amount: Rp${baseAmount}, Fee: ${feePercentage}% (Rp${calculatedFee})`,
  });

  console.log('Base Amount:', baseAmount);
  console.log('Calculated Fee:', calculatedFee);
  console.log('Total Amount:', transaction.data.totalAmount);

  return transaction;
}

/**
 * Example 6: Multi-payment method support
 */
async function createTransactionForMultipleMethods(amount, methods) {
  const transactions = [];

  for (const method of methods) {
    try {
      const transaction = await paygate.createTransaction({
        amount: amount,
        paymentMethod: method,
        notes: `Payment via ${method}`,
        metadata: {
          paymentMethod: method,
        },
      });

      transactions.push({
        method: method,
        transactionId: transaction.data.transactionId,
        paymentUrl: transaction.data.paymentUrl,
      });

      console.log(`✅ Created ${method} transaction:`, transaction.data.transactionId);
    } catch (error) {
      console.error(`❌ Failed to create ${method} transaction:`, error.message);
    }
  }

  return transactions;
}

/**
 * Example 7: Transaction validation before creation
 */
async function createValidatedTransaction(params) {
  // Validate amount
  if (!params.amount || params.amount < 1) {
    throw new Error('Amount must be at least Rp 1');
  }

  // Validate timeout
  if (params.timeout && (params.timeout < 60000 || params.timeout > 3600000)) {
    throw new Error('Timeout must be between 60000ms (1 min) and 3600000ms (1 hour)');
  }

  // Validate notes length
  if (params.notes && params.notes.length > 2000) {
    throw new Error('Notes must not exceed 2000 characters');
  }

  // Validate callback URL format
  if (params.callback_url && !isValidUrl(params.callback_url)) {
    throw new Error('Invalid callback URL format');
  }

  // Validate return URL format
  if (params.return_url && !isValidUrl(params.return_url)) {
    throw new Error('Invalid return URL format');
  }

  // Create transaction after validation
  console.log('✅ Validation passed, creating transaction...');
  return await paygate.createTransaction(params);
}

/**
 * Example 8: Error handling wrapper
 */
async function safeCreateTransaction(params) {
  try {
    const transaction = await paygate.createTransaction(params);
    return {
      success: true,
      data: transaction.data,
      error: null,
    };
  } catch (error) {
    console.error('Transaction creation failed:', error.message);

    // Parse error details
    const errorResponse = {
      success: false,
      data: null,
      error: {
        message: error.message,
        status: error.status,
        details: error.data,
      },
    };

    // Handle specific error types
    if (error.status === 400) {
      console.error('Validation error:', error.data.errors);
    } else if (error.status === 429) {
      console.error('Rate limit exceeded, please try again later');
    } else if (error.status === 500) {
      console.error('Server error, please contact support');
    }

    return errorResponse;
  }
}

/**
 * Example 9: Transaction summary generator
 */
async function generateTransactionSummary(transactionId, accessKey) {
  const details = await paygate.getTransaction(transactionId, accessKey);
  const data = details.data;

  const summary = {
    id: data.transactionId,
    status: data.status,
    statusEmoji: getStatusEmoji(data.status),
    amount: formatCurrency(data.amount),
    fee: formatCurrency(data.fee || 0),
    total: formatCurrency(data.totalAmount),
    paymentMethod: data.paymentMethod,
    createdAt: formatDate(data.createdAt),
    expiredAt: formatDate(data.expiredAt),
    paidAt: data.paidAt ? formatDate(data.paidAt) : null,
    notes: data.notes || '-',
    metadata: data.metadata || {},
  };

  console.log('\n=== Transaction Summary ===');
  console.log(`Status: ${summary.statusEmoji} ${summary.status}`);
  console.log(`ID: ${summary.id}`);
  console.log(`Amount: ${summary.amount}`);
  console.log(`Fee: ${summary.fee}`);
  console.log(`Total: ${summary.total}`);
  console.log(`Method: ${summary.paymentMethod}`);
  console.log(`Created: ${summary.createdAt}`);
  console.log(`Expires: ${summary.expiredAt}`);
  if (summary.paidAt) console.log(`Paid: ${summary.paidAt}`);
  console.log('========================\n');

  return summary;
}

// ============================================
// Helper Functions
// ============================================

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getStatusEmoji(status) {
  const emojis = {
    pending: '⏳',
    sukses: '✅',
    gagal: '❌',
    expired: '⏱️',
    cancel: '🚫',
  };
  return emojis[status] || '❓';
}

// ============================================
// Example Usage
// ============================================

async function runAdvancedExamples() {
  try {
    console.log('=== Advanced Examples ===\n');

    // Example 1: Create with retry
    console.log('1. Creating transaction with retry...');
    const tx1 = await createTransactionWithRetry({
      amount: 50000,
      notes: 'Retry example',
    });
    console.log('Transaction ID:', tx1.data.transactionId, '\n');

    // Example 2: Dynamic fee
    console.log('2. Creating transaction with dynamic fee...');
    const tx2 = await createTransactionWithDynamicFee(100000, 2.5);
    console.log('');

    // Example 3: Validation
    console.log('3. Creating validated transaction...');
    const tx3 = await createValidatedTransaction({
      amount: 25000,
      notes: 'Validated transaction',
      callback_url: 'https://example.com/webhook',
    });
    console.log('Transaction ID:', tx3.data.transactionId, '\n');

    console.log('✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Example failed:', error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  runAdvancedExamples();
}

// Export functions
module.exports = {
  createTransactionWithRetry,
  createBatchTransactions,
  pollTransactionStatus,
  createTransactionWithAutoCancel,
  createTransactionWithDynamicFee,
  createTransactionForMultipleMethods,
  createValidatedTransaction,
  safeCreateTransaction,
  generateTransactionSummary,
};
