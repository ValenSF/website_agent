// services/apiService.ts
export interface WebDepositRequest {
  method: string;
  amount_id: number;
  agent_id: number;
  agent_referral: string;
  neo_player_id: string;
  phone_no: string;
}

export interface WebDepositResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    message: string;
    data: {
      qr_url: string;
      qr_content: string | null;
      redirect_url: string;
    };
    total_amount: number;
  };
}

export interface WebDepositStatusRequest {
  id: number;
}

export interface WebDepositStatusResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    status: string;
    amount: number;
    neo_player_id: string;
    phone_no: string;
    created_at: string;
    updated_at: string;
  };
}

export interface TopupRequest {
  neo_id: string;
  whatsapp_number: string;
  'h-captcha-response': string;
}

export interface TopupResponse {
  status: string;
  message: string;
  data?: any; // Sesuaikan dengan struktur respons backend
}

// New interfaces for Web Inquiry (Withdraw)
export interface WebInquiryRequest {
  bank_id: number;
  amount_id: number;
  bank_account_no: string;
  bank_account_name: string;
  agent_referral: string;
  neo_player_id: string;
  phone_no: string;
}

export interface WebInquiryResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    code: string;
    target_player_id: string;
    target_nick: string;
    amount: number;
    chip_amount: number;
  };
}

export interface WebInquiryStatusRequest {
  id: number;
}

export interface WebInquiryStatusResponse {
  status: string;
  message: string;
  data?: {
    id: number;
    transaction_code: string;
    created_at: string;
    amount: number;
    chip_amount: number;
    status: string;
    bank_account_no: string;
    bank_account_name: string;
  };
}

// NEW: Interface for Banks API
export interface BankData {
  id: number;
  name: string;
  type: 'BANK' | 'EWALLET';
}

export interface BanksResponse {
  status: string;
  message: string;
  data: BankData[];
}

export interface BankAccountData {
  id: number;
  bank_id: number;
  bank_name: string;
  bank_code: string;
  bank_type?: string;
  lgpay_bank_code?: string;
  bank_account_no: string;
  bank_account_name: string;
  created_at: string;
  formatted_account: string;
}

export interface BankAccountInquiryRequest {
  neo_player_id: string;
  agent_referral: string; // Tambahkan agent_referral
}

export interface BankAccountInquiryResponse {
  status: string;
  message: string;
  data?: {
    user_id: number;
    user_name: string | null;
    neo_player_id: string;
    agent_info: {
      id: number;
      username: string;
      referral_code: string;
    };
    bank_accounts: BankAccountData[];
    total_accounts: number;
  };
}

export interface NeoPersonalInfoRequest {
  id: number;
}

export interface NeoPersonalInfoResponse {
  status: string;
  message: string;
  data?: {
    PlayerId: string;
    Nick: string;
    Vip: string;
    Coin: string;
    Level: string;
  };
}

// Interface for Cancel Transaction
export interface CancelTransactionRequest {
  transaction_id: number;
}

export interface CancelTransactionResponse {
  status: string;
  message: string;
  data?: any;
}

const API_BASE_URL = 'https://api.hidupcuan.org/api';
// const API_BASE_URL = 'https://staging-api.hidupcuan.org/api';

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' = 'POST', 
    data?: any
  ): Promise<T> {
    try {
      // Enhanced debug logging
      console.log('🚀 [API] Making request:', {
        url: `${API_BASE_URL}${endpoint}`,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        bodyParsed: data
      });

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add user agent to match browser behavior
          'User-Agent': 'Mozilla/5.0 (compatible; WebApp/1.0)',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      console.log('📨 [API] Response status:', response.status);
      console.log('📨 [API] Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📨 [API] Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ [API] JSON parse error:', parseError);
        console.error('❌ [API] Raw response that failed to parse:', responseText);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
      }

      console.log('📨 [API] Parsed response:', result);

      // Don't throw on HTTP errors, let the calling code handle error status
      return result;
    } catch (error) {
      console.error(`❌ [API] Request failed on ${endpoint}:`, error);
      throw error;
    }
  }
  async createTopup(params: TopupRequest): Promise<TopupResponse> {
    console.log('🚀 [API] Sending topup request:', params);
    return this.makeRequest<TopupResponse>('/topup', 'POST', params);
  }

  // Create web deposit transaction
  async createWebDeposit(params: {
    amount_id: number;
    agent_referral: string;
    neo_player_id: string;
    phone_no: string;
  }): Promise<WebDepositResponse> {
    const requestData = {
      method: "QRIS",
      amount_id: params.amount_id,
      agent_referral: params.agent_referral,
      neo_player_id: params.neo_player_id,
      phone_no: params.phone_no,
    };

    console.log('🚀 [API] Sending request (WITHOUT agent_id):', requestData);
    return this.makeRequest<WebDepositResponse>('/lgpay-transaction/web-deposit', 'POST', requestData);
  }

  // Check deposit status
  async checkDepositStatus(transactionId: number): Promise<WebDepositStatusResponse> {
    const requestData: WebDepositStatusRequest = {
      id: transactionId,
    };

    console.log('📊 [API] Checking deposit status for transaction:', transactionId);
    
    try {
      const response = await this.makeRequest<WebDepositStatusResponse>('/lgpay-transaction/web-deposit-status', 'POST', requestData);
      
      // ✅ Enhanced logging untuk debug payment status
      console.log('📨 [API] Status check response:', {
        status: response.status,
        message: response.message,
        data: response.data,
        transactionId: transactionId
      });
      
      return response;
    } catch (error) {
      console.error('❌ [API] Status check failed:', error);
      throw error;
    }
  }

  // New: Create web inquiry (withdraw) transaction
  async createWebInquiry(params: {
    bank_id: number;
    amount_id: number;
    bank_account_no: string;
    bank_account_name: string;
    agent_referral: string;
    neo_player_id: string;
    phone_no: string;
  }): Promise<WebInquiryResponse> {
    const requestData: WebInquiryRequest = {
      bank_id: params.bank_id,
      amount_id: params.amount_id,
      bank_account_no: params.bank_account_no,
      bank_account_name: params.bank_account_name,
      agent_referral: params.agent_referral,
      neo_player_id: params.neo_player_id,
      phone_no: params.phone_no,
    };

    console.log('🚀 [API] Sending web inquiry (withdraw) request:', requestData);
    return this.makeRequest<WebInquiryResponse>('/lgpay-transaction/web-inquiry', 'POST', requestData);
  }

  // New: Check inquiry (withdraw) status
  async checkInquiryStatus(transactionId: number): Promise<WebInquiryStatusResponse> {
    const requestData: WebInquiryStatusRequest = {
      id: transactionId,
    };

    console.log('📊 [API] Checking inquiry (withdraw) status for transaction:', transactionId);
    
    try {
      const response = await this.makeRequest<WebInquiryStatusResponse>('/lgpay-transaction/web-inquiry-status', 'POST', requestData);
      
      // ✅ Enhanced logging for inquiry status
      console.log('📨 [API] Inquiry status check response:', {
        status: response.status,
        message: response.message,
        data: response.data,
        transactionId: transactionId
      });
      
      return response;
    } catch (error) {
      console.error('❌ [API] Inquiry status check failed:', error);
      throw error;
    }
  }

  // NEW: Get banks list from API (using POST method)
  async getBanks(): Promise<BanksResponse> {
    console.log('🏦 [API] Fetching banks list...');
    
    try {
      const response = await this.makeRequest<BanksResponse>('/master/banks', 'POST');
      
      console.log('📨 [API] Banks response:', {
        status: response.status,
        message: response.message,
        banksCount: response.data?.length || 0,
        banks: response.data
      });
      
      return response;
    } catch (error) {
      console.error('❌ [API] Failed to fetch banks:', error);
      throw error;
    }
  }

  async getBankAccounts(neoPlayerId: string, agentReferral: string): Promise<BankAccountInquiryResponse> {
    const requestData: BankAccountInquiryRequest = {
      neo_player_id: neoPlayerId,
      agent_referral: agentReferral, // Tambahkan agent_referral
    };

    console.log('🏦 [API] Fetching bank accounts with agent validation:', {
      neoPlayerId,
      agentReferral
    });
    
    try {
      const response = await this.makeRequest<BankAccountInquiryResponse>(
        '/lgpay-transaction/bank-accounts', 
        'POST', 
        requestData
      );
      
      console.log('📨 [API] Bank accounts response:', {
        status: response.status,
        message: response.message,
        userId: response.data?.user_id,
        agentInfo: response.data?.agent_info,
        totalAccounts: response.data?.total_accounts || 0,
        accounts: response.data?.bank_accounts || []
      });
      
      return response;
    } catch (error) {
      console.error('❌ [API] Failed to fetch bank accounts:', error);
      throw error;
    }
  }

  // NEW: Get bank ID by name (helper function)
  getBankIdByName(bankName: string, banksList: BankData[]): number {
    const bank = banksList.find(b => 
      b.name.toLowerCase().includes(bankName.toLowerCase()) ||
      bankName.toLowerCase().includes(b.name.toLowerCase())
    );
    
    if (!bank) {
      console.warn(`⚠️ [API] Bank not found: ${bankName}`);
      return 1; // Default to first bank (BCA)
    }
    
    console.log(`🏦 [API] Found bank: ${bankName} → ID: ${bank.id}`);
    return bank.id;
  }

  async getNeoPersonalInfo(neoPlayerId: string): Promise<NeoPersonalInfoResponse> {
  const requestData: NeoPersonalInfoRequest = {
    id: parseInt(neoPlayerId),
  };

  console.log('🎮 [API] Getting Neo personal info for player:', neoPlayerId);
  
  try {
    const response = await this.makeRequest<NeoPersonalInfoResponse>('/neo/personal-info-free', 'POST', requestData);
    
    console.log('📨 [API] Neo personal info response:', {
      status: response.status,
      message: response.message,
      data: response.data
    });
    
    return response;
  } catch (error) {
    console.error('❌ [API] Failed to get Neo personal info:', error);
    throw error;
  }
}

async cancelTransaction(transactionId: number): Promise<CancelTransactionResponse> {
  const requestData: CancelTransactionRequest = {
    transaction_id: transactionId,
  };

  console.log('🚫 [API] Cancelling transaction:', transactionId);
  
  try {
    const response = await this.makeRequest<CancelTransactionResponse>('/lgpay-transaction/cancel-lgpay', 'POST', requestData);
    
    console.log('📨 [API] Cancel transaction response:', {
      status: response.status,
      message: response.message,
      data: response.data
    });
    
    return response;
  } catch (error) {
    console.error('❌ [API] Failed to cancel transaction:', error);
    throw error;
  }
}
  getAmountId(topUpAmount: string): number {
    const amountMap: { [key: string]: number } = {
      '10000': 1,
      '20000': 2,
      '32500': 3,
      '50000': 4,
      '65000': 5,
      '130000': 6,
      '195000': 7,
      '260000': 8,
      '650000': 9,
      '1950000': 10,
      '2600000': 11
    };
    
    return amountMap[topUpAmount] || 1;
  }

  getBongkarAmountId(bongkarAmount: string): number {
  const amountMap: { [key: string]: number } = {
    '12500': 2,
    '27500': 3,
    '45000': 4,
    '60000': 5,
    '120000': 6,
    '180000': 7,
    '240000': 8,
    '600000': 9,
    '1800000': 10,
    '2400000': 11
  };
  
  return amountMap[bongkarAmount] || 2;
}

  // Extract referral code from URL
  getReferralFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref') || urlParams.get('referral') || 'default_ref';
  }

  // Format phone number (keep original format, just clean non-numeric)
  formatPhoneNumber(phoneNo: string): string {
    // Remove any non-numeric characters only
    const cleanPhone = phoneNo.replace(/\D/g, '');
    
    // Return as-is, don't add country code
    return cleanPhone;
  }
}

export const apiService = new ApiService();