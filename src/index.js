const axios = require('axios');

/**
 * Betabotz Paygate SDK
 * Official Node.js SDK for Betabotz Payment Gateway
 */
class BetabotzPaygate {
  /**
   * Initialize Betabotz Paygate client
   * @param {Object} config - Configuration object
   * @param {string} config.apiKey - Your payment method API key
   * @param {string} [config.baseURL='https://web.btzpay.my.id'] - Base URL for API
   * @param {number} [config.timeout=30000] - Request timeout in milliseconds
   */
  constructor(config) {
    if (!config || !config.apiKey) {
      throw new Error('API Key is required');
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://web.btzpay.my.id';
    this.timeout = config.timeout || 30000;

    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error status
          const errorData = error.response.data;
          const err = new Error(errorData.message || 'API request failed');
          err.status = error.response.status;
          err.data = errorData;
          throw err;
        } else if (error.request) {
          // Request was made but no response received
          throw new Error('No response from server');
        } else {
          // Something else happened
          throw error;
        }
      }
    );
  }

  /**
   * Create a new QRIS transaction
   * @param {Object} params - Transaction parameters
   * @param {number|string} params.amount - Transaction amount in IDR (minimum 1)
   * @param {number} [params.fee] - Fixed fee amount
   * @param {string} [params.paymentMethodId] - Payment method ID
   * @param {string} [params.paymentMethod] - Payment type: qrisdana, qrisgopay, qrisorkut, qrisshopeepay
   * @param {string} [params.qrisStatic] - Static QRIS code (leave empty for e-wallet)
   * @param {number} [params.timeout] - Timeout in milliseconds (min: 60000, max: 3600000)
   * @param {string} [params.callback_url] - Merchant callback URL
   * @param {string} [params.return_url] - Return URL after transaction completion
   * @param {string} [params.notes] - Transaction notes (max 2000 characters)
   * @param {Object} [params.customerInfo] - Customer information
   * @param {string} [params.customerInfo.name] - Customer name
   * @param {string} [params.customerInfo.email] - Customer email
   * @param {string} [params.customerInfo.phone] - Customer phone
   * @param {Object} [params.metadata] - Custom metadata
   * @param {string} [params.metadata.orderId] - Order ID from merchant system
   * @param {string} [params.metadata.productName] - Product name
   * @param {string} [params.metadata.customNotif] - Custom notification
   * @param {Object} [params.macroDroidConfig] - MacroDroid configuration
   * @param {string} [params.accountNumber] - Account number (non-QRIS)
   * @param {string} [params.accountName] - Account name (non-QRIS)
   * @param {string} [params.bankCode] - Bank code (e.g., BCA, BNI, MANDIRI)
   * @param {string} [params.additionalInfo] - Additional transaction information
   * @returns {Promise<Object>} Transaction data
   */
  async createTransaction(params) {
    if (!params.amount) {
      throw new Error('Amount is required');
    }

    const payload = {
      apikey: this.apiKey,
      amount: params.amount,
      ...params,
    };

    const response = await this.client.post('/api/qris/create', payload);
    return response.data;
  }

  /**
   * Get transaction details
   * @param {string} transactionId - Transaction ID
   * @param {string} accessKey - Transaction access key
   * @returns {Promise<Object>} Transaction details
   */
  async getTransaction(transactionId, accessKey) {
    if (!transactionId || !accessKey) {
      throw new Error('Transaction ID and access key are required');
    }

    const response = await this.client.get(
      `/api/qris/transaction/${transactionId}`,
      {
        params: { key: accessKey },
      }
    );
    return response.data;
  }

  /**
   * Cancel a pending transaction
   * @param {string} transactionId - Transaction ID to cancel
   * @param {string} [reason='cancelled_by_user'] - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelTransaction(transactionId, reason = 'cancelled_by_user') {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }

    const response = await this.client.post(
      `/api/qris/cancel/${transactionId}`,
      {
        apikey: this.apiKey,
        reason,
      }
    );
    return response.data;
  }

  /**
   * Send callback notification from payment listener
   * @param {Object} params - Callback parameters
   * @param {string} params.action - Must be "update"
   * @param {string} params.app - App name (dana, gopay, ovo, shopeepay)
   * @param {string} params.notification - Notification content from payment app
   * @param {number} [params.amount] - Payment amount
   * @param {number} [params.appVersionCode] - App version code
   * @returns {Promise<Object>} Callback result
   */
  async sendCallback(params) {
    if (!params.action || params.action !== 'update') {
      throw new Error('Action must be "update"');
    }
    if (!params.app || !params.notification) {
      throw new Error('App and notification are required');
    }

    const payload = {
      ...params,
      apikey: this.apiKey,
    };

    const response = await this.client.post('/api/qris/callback', payload);
    return response.data;
  }

  /**
   * Generate payment URL for a transaction
   * @param {string} transactionId - Transaction ID
   * @param {string} accessKey - Transaction access key
   * @returns {string} Payment URL
   */
  getPaymentUrl(transactionId, accessKey) {
    if (!transactionId || !accessKey) {
      throw new Error('Transaction ID and access key are required');
    }
    return `${this.baseURL}/transaction/${transactionId}?key=${accessKey}`;
  }

  /**
   * Verify callback signature (placeholder - implement based on actual signature method)
   * @param {Object} callbackData - Callback data received
   * @param {string} signature - Signature to verify
   * @returns {boolean} Verification result
   */
  verifyCallback(callbackData, signature) {
    // TODO: Implement actual signature verification based on Betabotz specs
    // This is a placeholder method
    console.warn('Callback verification not yet implemented');
    return true;
  }
}

module.exports = BetabotzPaygate;
