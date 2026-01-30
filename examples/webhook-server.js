/**
 * Webhook Server Example - Betabotz Paygate SDK
 * Complete Express.js server with payment creation and webhook handling
 */

const express = require('express');
const BetabotzPaygate = require('betabotz-paygate');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Betabotz Paygate
const paygate = new BetabotzPaygate({
  apiKey: process.env.BETABOTZ_API_KEY || 'YOUR_PAYMENT_METHOD_APIKEY',
});

// In-memory storage (use database in production)
const transactions = new Map();

/**
 * Home route
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Betabotz Paygate Webhook Server',
    endpoints: {
      createPayment: 'POST /create-payment',
      checkStatus: 'GET /check-payment/:transactionId',
      cancelPayment: 'POST /cancel-payment/:transactionId',
      webhook: 'POST /webhook',
    },
  });
});

/**
 * Create payment endpoint
 * POST /create-payment
 * Body: { amount, orderId, productName, customerEmail, customerName, customerPhone }
 */
app.post('/create-payment', async (req, res) => {
  try {
    const {
      amount,
      orderId,
      productName,
      customerEmail,
      customerName,
      customerPhone,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required',
      });
    }

    console.log('Creating payment for:', { amount, orderId, productName });

    // Create transaction
    const transaction = await paygate.createTransaction({
      amount: parseInt(amount),
      notes: `Order ${orderId || 'N/A'} - ${productName || 'Product'}`,
      callback_url: `${req.protocol}://${req.get('host')}/webhook`,
      return_url: `${req.protocol}://${req.get('host')}/payment-success`,
      paymentMethod: paymentMethod || undefined,
      customerInfo: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      metadata: {
        orderId: orderId,
        productName: productName,
      },
    });

    // Store transaction in memory (use database in production)
    transactions.set(transaction.data.transactionId, {
      ...transaction.data,
      orderId: orderId,
      createdBy: req.ip,
    });

    console.log('✅ Payment created:', transaction.data.transactionId);

    res.json({
      success: true,
      message: 'Payment created successfully',
      data: {
        transactionId: transaction.data.transactionId,
        paymentUrl: transaction.data.paymentUrl,
        totalAmount: transaction.data.totalAmount,
        status: transaction.data.status,
        expiredAt: transaction.data.expiredAt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating payment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Check payment status endpoint
 * GET /check-payment/:transactionId?accessKey=xxx
 */
app.get('/check-payment/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { accessKey } = req.query;

    if (!accessKey) {
      return res.status(400).json({
        success: false,
        message: 'Access key is required',
      });
    }

    console.log('Checking payment status:', transactionId);

    const details = await paygate.getTransaction(transactionId, accessKey);

    res.json({
      success: true,
      data: {
        transactionId: details.data.transactionId,
        status: details.data.status,
        amount: details.data.amount,
        totalAmount: details.data.totalAmount,
        createdAt: details.data.createdAt,
        paidAt: details.data.paidAt,
        expiredAt: details.data.expiredAt,
      },
    });
  } catch (error) {
    console.error('❌ Error checking payment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Cancel payment endpoint
 * POST /cancel-payment/:transactionId
 */
app.post('/cancel-payment/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    console.log('Cancelling payment:', transactionId);

    const result = await paygate.cancelTransaction(
      transactionId,
      reason || 'User requested cancellation'
    );

    // Update local storage
    const stored = transactions.get(transactionId);
    if (stored) {
      stored.status = 'cancel';
      transactions.set(transactionId, stored);
    }

    res.json({
      success: true,
      message: 'Payment cancelled successfully',
      data: {
        transactionId: result.data.transactionId,
        status: result.data.status,
      },
    });
  } catch (error) {
    console.error('❌ Error cancelling payment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * Webhook endpoint - receives payment notifications from Betabotz Paygate
 * POST /webhook
 */
app.post('/webhook', async (req, res) => {
  try {
    const { pay_id, unique_code, status, raw } = req.body;

    console.log('\n=== Webhook Received ===');
    console.log('Transaction ID:', pay_id);
    console.log('Status:', status);
    console.log('Unique Code:', unique_code);
    console.log('Raw Data:', JSON.stringify(raw, null, 2));

    // Update local storage
    const stored = transactions.get(pay_id);
    if (stored) {
      stored.status = status;
      stored.paidAt = raw?.data?.paidAt;
      transactions.set(pay_id, stored);
    }

    // Process based on status
    switch (status) {
      case 'sukses':
        console.log('✅ Payment successful!');
        // TODO: Update database, fulfill order, send confirmation email, etc.
        await handleSuccessfulPayment(pay_id, raw);
        break;

      case 'expired':
        console.log('⏱️ Payment expired');
        // TODO: Update database, notify user
        await handleExpiredPayment(pay_id, raw);
        break;

      case 'cancel':
        console.log('❌ Payment cancelled');
        // TODO: Update database, notify user
        await handleCancelledPayment(pay_id, raw);
        break;

      case 'gagal':
        console.log('❌ Payment failed');
        // TODO: Update database, notify user
        await handleFailedPayment(pay_id, raw);
        break;

      default:
        console.log('ℹ️ Payment status:', status);
    }

    // IMPORTANT: Always respond with success to acknowledge webhook
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    // Still respond with success to prevent retry loops
    res.json({ success: true });
  }
});

/**
 * Payment success page
 */
app.get('/payment-success', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Success</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .success { color: #4CAF50; font-size: 48px; }
        .message { font-size: 24px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="success">✅</div>
      <div class="message">Payment Successful!</div>
      <p>Thank you for your payment. Your order is being processed.</p>
    </body>
    </html>
  `);
});

/**
 * List all transactions (for demo purposes)
 */
app.get('/transactions', (req, res) => {
  const allTransactions = Array.from(transactions.values());
  res.json({
    success: true,
    count: allTransactions.length,
    transactions: allTransactions,
  });
});

// ============================================
// Helper functions for webhook processing
// ============================================

async function handleSuccessfulPayment(transactionId, rawData) {
  // Implement your business logic here:
  // 1. Update database with payment confirmation
  // 2. Fulfill the order
  // 3. Send confirmation email to customer
  // 4. Update inventory
  // 5. Generate invoice/receipt
  
  console.log('Processing successful payment:', transactionId);
  
  // Example:
  const orderInfo = rawData?.data;
  if (orderInfo?.orderId) {
    console.log(`Fulfilling order: ${orderInfo.orderId}`);
    // await updateOrderStatus(orderInfo.orderId, 'paid');
    // await sendConfirmationEmail(orderInfo);
  }
}

async function handleExpiredPayment(transactionId, rawData) {
  // Implement your business logic here:
  // 1. Update database with expired status
  // 2. Notify customer about expiration
  // 3. Release reserved inventory (if any)
  
  console.log('Processing expired payment:', transactionId);
}

async function handleCancelledPayment(transactionId, rawData) {
  // Implement your business logic here:
  // 1. Update database with cancelled status
  // 2. Notify customer about cancellation
  // 3. Release reserved inventory (if any)
  
  console.log('Processing cancelled payment:', transactionId);
}

async function handleFailedPayment(transactionId, rawData) {
  // Implement your business logic here:
  // 1. Update database with failed status
  // 2. Notify customer about failure
  // 3. Suggest alternative payment methods
  
  console.log('Processing failed payment:', transactionId);
}

// ============================================
// Start server
// ============================================

app.listen(PORT, () => {
  console.log('=================================');
  console.log('Betabotz Paygate Webhook Server');
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
  console.log('=================================\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
