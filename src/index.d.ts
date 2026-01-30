declare module 'betabotz-paygate' {
  /**
   * Configuration for Betabotz Paygate client
   */
  export interface BetabotzPaygateConfig {
    /** Your payment method API key */
    apiKey: string;
    /** Base URL for API (default: https://web.btzpay.my.id) */
    baseURL?: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
  }

  /**
   * Customer information
   */
  export interface CustomerInfo {
    /** Customer name */
    name?: string;
    /** Customer email */
    email?: string;
    /** Customer phone number */
    phone?: string;
  }

  /**
   * Transaction metadata
   */
  export interface TransactionMetadata {
    /** Order ID from merchant system */
    orderId?: string;
    /** Product name */
    productName?: string;
    /** Custom notification message */
    customNotif?: string;
    /** Any other custom fields */
    [key: string]: any;
  }

  /**
   * MacroDroid configuration
   */
  export interface MacroDroidConfig {
    [key: string]: any;
  }

  /**
   * Account details for non-QRIS payments
   */
  export interface AccountDetails {
    /** Account number */
    accountNumber?: string;
    /** Account holder name */
    accountName?: string;
    /** Bank code (e.g., BCA, BNI, MANDIRI) */
    bankCode?: string;
    /** Additional information */
    additionalInfo?: string;
  }

  /**
   * Payment method information
   */
  export interface PaymentMethodInfo {
    [key: string]: any;
  }

  /**
   * Parameters for creating a transaction
   */
  export interface CreateTransactionParams {
    /** Transaction amount in IDR (minimum 1) */
    amount: number | string;
    /** Fixed fee amount */
    fee?: number;
    /** Payment method ID */
    paymentMethodId?: string;
    /** Payment type: qrisdana, qrisgopay, qrisorkut, qrisshopeepay */
    paymentMethod?: string;
    /** Static QRIS code (leave empty for e-wallet) */
    qrisStatic?: string;
    /** Timeout in milliseconds (min: 60000, max: 3600000) */
    timeout?: number;
    /** Merchant callback URL */
    callback_url?: string;
    /** Return URL after transaction completion */
    return_url?: string;
    /** Transaction notes (max 2000 characters) */
    notes?: string;
    /** Customer information */
    customerInfo?: CustomerInfo;
    /** Custom metadata */
    metadata?: TransactionMetadata;
    /** MacroDroid configuration */
    macroDroidConfig?: MacroDroidConfig;
    /** Account number (non-QRIS) */
    accountNumber?: string;
    /** Account name (non-QRIS) */
    accountName?: string;
    /** Bank code */
    bankCode?: string;
    /** Additional information */
    additionalInfo?: string;
  }

  /**
   * Transaction data response
   */
  export interface TransactionData {
    /** Transaction ID */
    transactionId: string;
    /** Transaction amount */
    amount: number;
    /** Fee amount */
    fee: number;
    /** Total amount (amount + fee) */
    totalAmount: number;
    /** QRIS string */
    qrisString: string;
    /** QRIS image URL or base64 */
    qrisImage: string;
    /** Account details for non-QRIS */
    accountDetails: AccountDetails;
    /** Payment type (ewallet, qris, etc.) */
    paymentType: string;
    /** Payment method name */
    paymentMethod: string;
    /** Transaction status */
    status: 'pending' | 'sukses' | 'gagal' | 'expired' | 'cancel';
    /** Expiration date/time */
    expiredAt: string;
    /** Creation date/time */
    createdAt: string;
    /** Payment date/time (if paid) */
    paidAt?: string;
    /** Payment URL */
    paymentUrl: string;
    /** Access key for transaction */
    accessKey: string;
    /** Transaction notes */
    notes?: string;
    /** Callback URL */
    callback_url?: string;
    /** Return URL */
    return_url?: string;
    /** Transaction metadata */
    metadata?: TransactionMetadata;
  }

  /**
   * API response wrapper
   */
  export interface ApiResponse<T> {
    /** Success status */
    success: boolean;
    /** Response data */
    data?: T;
    /** Error message */
    message?: string;
    /** Validation errors */
    errors?: Array<{
      field: string;
      message: string;
    }>;
  }

  /**
   * Callback parameters for payment listener
   */
  export interface CallbackParams {
    /** Action type (must be "update") */
    action: 'update';
    /** App name (dana, gopay, ovo, shopeepay) */
    app: string;
    /** Notification content from payment app */
    notification: string;
    /** Payment amount */
    amount?: number;
    /** App version code */
    appVersionCode?: number;
  }

  /**
   * Callback payload sent to merchant
   */
  export interface MerchantCallbackPayload {
    /** Transaction ID */
    pay_id: string;
    /** Unique code/fee */
    unique_code: string;
    /** Transaction status */
    status: 'pending' | 'sukses' | 'gagal' | 'expired' | 'cancel';
    /** Raw response data */
    raw: {
      success: boolean;
      message: string;
      data: {
        transactionId: string;
        amount: number;
        status: string;
        paidAt?: string;
        expiredAt: string;
        orderId?: string;
        productName?: string;
        reason?: string;
        notes?: string;
        return_url?: string;
      };
    };
  }

  /**
   * Betabotz Paygate SDK
   */
  export default class BetabotzPaygate {
    /**
     * Initialize Betabotz Paygate client
     * @param config - Configuration object
     */
    constructor(config: BetabotzPaygateConfig);

    /**
     * Create a new QRIS transaction
     * @param params - Transaction parameters
     * @returns Promise with transaction data
     */
    createTransaction(params: CreateTransactionParams): Promise<ApiResponse<TransactionData>>;

    /**
     * Get transaction details
     * @param transactionId - Transaction ID
     * @param accessKey - Transaction access key
     * @returns Promise with transaction details
     */
    getTransaction(transactionId: string, accessKey: string): Promise<ApiResponse<TransactionData>>;

    /**
     * Cancel a pending transaction
     * @param transactionId - Transaction ID to cancel
     * @param reason - Cancellation reason (default: 'cancelled_by_user')
     * @returns Promise with cancellation result
     */
    cancelTransaction(transactionId: string, reason?: string): Promise<ApiResponse<{
      transactionId: string;
      status: string;
    }>>;

    /**
     * Send callback notification from payment listener
     * @param params - Callback parameters
     * @returns Promise with callback result
     */
    sendCallback(params: CallbackParams): Promise<ApiResponse<{
      transactionId: string;
      amount: number;
      status: string;
      paidAt: string;
      return_url?: string;
    }>>;

    /**
     * Generate payment URL for a transaction
     * @param transactionId - Transaction ID
     * @param accessKey - Transaction access key
     * @returns Payment URL
     */
    getPaymentUrl(transactionId: string, accessKey: string): string;

    /**
     * Verify callback signature
     * @param callbackData - Callback data received
     * @param signature - Signature to verify
     * @returns Verification result
     */
    verifyCallback(callbackData: MerchantCallbackPayload, signature: string): boolean;
  }
}
