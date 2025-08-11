import React, { useState, useEffect } from "react";
import { Box, Text, Button, Modal, Loader } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { apiService } from '../../services/apiService';

interface BankData {
  bankId: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface LocationState {
  bankData?: BankData;
  amount?: string;
  chipAmount?: string;
  neoId?: string;
  whatsappNumber?: string;
  amountId?: number;
  agentReferral?: string;
}

export default function BankConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State untuk modal dan loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info'); // 'info', 'error', 'success'
  const [transactionId, setTransactionId] = useState<any>('');
  
  // State untuk Neo Player data
  const [senderNeoData, setSenderNeoData] = useState<{nick: string, coin: string} | null>(null);
  const [targetNeoData, setTargetNeoData] = useState<{nick: string, coin: string} | null>(null);
  const [isLoadingNeoData, setIsLoadingNeoData] = useState(false);

  // State untuk polling transaksi dan timer
  const [isProcessing, setIsProcessing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [countdown, setCountdown] = useState(300);

  // State untuk mencegah multiple submissions
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isApiCalling, setIsApiCalling] = useState(false);

  // Ambil data dari state navigation
  const locationState = location.state as LocationState;
  const {
    bankData,
    amount,
    chipAmount,
    neoId,
    whatsappNumber,
    amountId,
    agentReferral
  } = locationState || {};

  // Data pengirim dari form yang sudah diisi
  const senderBank = bankData?.bankName || "-";
  const senderNeoPartyId = neoId || "-";
  const senderIDR = amount || "-";
  const senderAccountName = bankData?.accountHolderName || "-";
  const senderAccountNumber = bankData?.accountNumber || "-";
  const senderKoin = chipAmount || "-";

  // Data penerima (target) - menggunakan data dari API
  const targetNeoId = "168168";
  const targetUsername = targetNeoData?.nick || "CuanApp";
  const targetKoin = targetNeoData?.coin || chipAmount || "-";

  // Load Neo Player data when component mounts
  useEffect(() => {
    const loadNeoPlayerData = async () => {
      if (!neoId) return;
      
      setIsLoadingNeoData(true);
      
      try {
        // Load sender Neo data
        if (neoId) {
          const senderResponse = await apiService.getNeoPersonalInfo(neoId);
          if (senderResponse.status === 'success' && senderResponse.data) {
            setSenderNeoData({
              nick: senderResponse.data.Nick,
              coin: senderResponse.data.Coin
            });
          }
        }
        
        // Load target Neo data (168168)
        const targetResponse = await apiService.getNeoPersonalInfo("168168");
        if (targetResponse.status === 'success' && targetResponse.data) {
          setTargetNeoData({
            nick: targetResponse.data.Nick,
            coin: targetResponse.data.Coin
          });
        }
      } catch (error) {
        console.error('Error loading Neo player data:', error);
        // Set fallback data if API fails
        setSenderNeoData({ nick: 'Unknown', coin: '0' });
        setTargetNeoData({ nick: 'CuanApp', coin: '0' });
      } finally {
        setIsLoadingNeoData(false);
      }
    };
    
    loadNeoPlayerData();
  }, [neoId]);

  // Countdown timer logic
  useEffect(() => {
    if (!isProcessing) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          setIsProcessing(false);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isProcessing]);

  // Function to format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to handle timeout
  const handleTimeout = async () => {
    if (transactionId) {
      try {
        await apiService.cancelTransaction(transactionId);
        console.log('✅ [TIMEOUT] Transaction cancelled successfully');
      } catch (err) {
        console.error('❌ [TIMEOUT] Failed to cancel transaction:', err);
      }
    }
    
    setModalType('error');
    setModalTitle('Timeout');
    setModalMessage('Transaksi dibatalkan karena melebihi batas waktu.');
    setShowModal(true);
  };

  // Function to format currency (IDR)
  const formatCurrency = (amount: string) => {
    if (!amount) return "-";
    // Remove any non-numeric characters and format with thousand separators
    const numericAmount = amount.replace(/\D/g, '');
    return numericAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Nominal chip format (sesuaikan biar seperti gambar)
  function formatKoin(koin: string) {
    if (!koin) return "-";
    // Format 888.222.777.555
    return koin.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Function to format chip amount display
  const formatChipAmount = (chipAmount: string) => {
    const match = chipAmount.match(/^(\d+(?:\.\d+)?)([MB])$/i);

    if (!match) return chipAmount; // kalau format tidak sesuai

    let [_, value, unit] = match;
    let amount = parseFloat(value);

    if (unit.toUpperCase() === "B") {
      return `${amount}B`;
    } else if (unit.toUpperCase() === "M") {
      if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}B`;
      }
      return `${amount}M`;
    }
  };
  const formattedChipAmount = formatChipAmount(senderKoin);

  // Function to get bank display name
  const getBankDisplayName = (bankCode: string) => {
    const bankMap: { [key: string]: string } = {
      'bca': 'BCA',
      'mandiri': 'MANDIRI',
      'bni': 'BNI',
      'bri': 'BRI',
      'cimb': 'CIMB NIAGA',
      'danamon': 'DANAMON',
      'permata': 'PERMATA',
      'ocbc': 'OCBC NISP',
      'maybank': 'MAYBANK',
      'btn': 'BTN',
    };
    return bankMap[bankCode] || bankCode.toUpperCase();
  };

  // Format chip amount with thousands separator and "chip" suffix
  function formatChipAmountWithSuffix(amount: string) {
    const num = parseInt(amount || '0', 10);
    return `${num.toLocaleString('id-ID')} chip`;
  }

  // Function to check transaction status
  const checkTransactionStatus = async (transactionId: number) => {
    try {
      const response = await apiService.checkInquiryStatus(transactionId);
      
      if (response.status === 'success' && response.data) {
        const { status } = response.data;
        
        console.log('Transaction status:', status);
        
        if (status === 'SUCCESS') {
          // Stop polling
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          
          setIsProcessing(false);
          
          // Navigate to success page
          navigate('/success-bongkar', {
            state: {
              transactionData: response.data,
              amount,
              chipAmount,
              bankData,
              neoId,
              whatsappNumber
            }
          });
        } else if (status === 'FAILED') {
          // Stop polling
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          
          setIsProcessing(false);
          
          // Show error modal
          setModalType('error');
          setModalTitle('Transaksi Gagal');
          setModalMessage('Transaksi gagal diproses. Silakan coba lagi.');
          setShowModal(true);
        }
        // If PENDING, continue polling
      } else {
        console.error('Error checking transaction status:', response.message);
      }
    } catch (error) {
      console.error('Error checking transaction status:', error);
      
      // Stop polling on error
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      
      setIsProcessing(false);
      
      // Show error modal
      setModalType('error');
      setModalTitle('Error');
      setModalMessage('Terjadi kesalahan saat mengecek status transaksi.');
      setShowModal(true);
    }
  };

  // Function to start polling transaction
  const startPolling = (transactionId: number) => {
    setIsProcessing(true);
    
    // Check immediately
    checkTransactionStatus(transactionId);
    
    // Then check every 3 seconds
    const interval = setInterval(() => {
      checkTransactionStatus(transactionId);
    }, 3000);
    
    setPollingInterval(interval);
    
    // Stop polling after 1 minute (timeout)
    const timeoutId = setTimeout(async () => {
      if (interval) {
        clearInterval(interval);
        setPollingInterval(null);
        setIsProcessing(false);

        try {
          // Batalkan transaksi kalau belum selesai
          await apiService.cancelTransaction(transactionId);
        } catch (err) {
          console.error("❌ Gagal membatalkan transaksi:", err);
        }

        setModalType('error');
        setModalTitle('Timeout');
        setModalMessage('Transaksi dibatalkan karena melebihi batas waktu.');
        setShowModal(true);
      }
    }, 300000); 
    
    // Store timeout for cleanup
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  };

  // Function to cancel transaction
  const handleCancelTransaction = async () => {
    if (!transactionId || isCancelling || isSubmitting) return;
    
    // Show modal instead of window.confirm
    setShowCancelModal(true);
  };

  // Function to confirm cancellation
  const confirmCancellation = async () => {
    if (!transactionId) return;
    
    setShowCancelModal(false);
    setIsCancelling(true);
    
    try {
      // Stop polling first
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      setIsProcessing(false);
      
      console.log('🚫 [CONFIRMATION] Cancelling transaction ID:', transactionId);
      
      // Call cancel API with correct payload
      const response = await apiService.cancelTransaction(transactionId);
      
      if (response.status === 'success') {
        console.log('✅ [CONFIRMATION] Transaction cancelled successfully');
        
        // Reset states
        setTransactionId(null);
        setIsProcessing(false);
        
        // Show success message
        setModalType('success');
        setModalTitle('Berhasil');
        setModalMessage('Transaksi berhasil dibatalkan.');
        setShowModal(true);
      } else {
        throw new Error(response.message || 'Gagal membatalkan transaksi');
      }
    } catch (error) {
      console.error('❌ [CONFIRMATION] Error cancelling transaction:', error);
      
      let errorMessage = 'Terjadi kesalahan saat membatalkan transaksi.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      setModalType('error');
      setModalTitle('Error');
      setModalMessage(errorMessage);
      setShowModal(true);
    } finally {
      setIsCancelling(false);
    }
  };

  // Function to submit transaction (dengan strict API call prevention)
  const handleSubmitTransaction = async () => {
    // STRICT: Prevent ANY multiple calls
    if (isSubmitting || hasSubmitted || transactionId || isApiCalling) {
      console.log('⚠️  Submit BLOCKED:', { 
        isSubmitting, 
        hasSubmitted, 
        hasTransactionId: !!transactionId,
        isApiCalling 
      });
      return;
    }

    console.log('🔄 Starting transaction submission');

    // Validasi data yang diperlukan
    if (!bankData || !neoId || !whatsappNumber) {
      setModalType('error');
      setModalTitle('Data Tidak Lengkap');
      setModalMessage('Data transaksi tidak lengkap. Silakan kembali dan lengkapi data Anda.');
      setShowModal(true);
      return;
    }

    // Validasi amountId dan agentReferral
    if (!amountId) {
      setModalType('error');
      setModalTitle('Error');
      setModalMessage('Amount ID tidak ditemukan. Silakan pilih nominal kembali.');
      setShowModal(true);
      return;
    }

    if (!agentReferral) {
      setModalType('error');
      setModalTitle('Error');
      setModalMessage('Agent referral tidak ditemukan. Silakan hubungi customer service.');
      setShowModal(true);
      return;
    }

    // Set ALL flags to prevent any duplicate calls
    setIsSubmitting(true);
    setHasSubmitted(true);
    setIsApiCalling(true);

    try {
      // Double check sebelum API call
      if (transactionId) {
        console.log('⚠️  API call cancelled: transactionId already exists');
        return;
      }

      // Prepare data for API using the correct interface
      const requestData = {
        bank_id: bankData.bankId,
        amount_id: amountId,
        bank_account_no: bankData.accountNumber,
        bank_account_name: bankData.accountHolderName,
        agent_referral: agentReferral,
        neo_player_id: neoId,
        phone_no: whatsappNumber
      };

      console.log('📤 CALLING API - createWebInquiry:', requestData);

      // SINGLE API CALL
      const response = await apiService.createWebInquiry(requestData);

      console.log('📥 API Response received:', response);

      if (response.status === 'success' && response.data) {
        const { id } = response.data;
        console.log('✅ Transaction submitted successfully with ID:', id);
        setTransactionId(id);
        
        // Start polling for transaction status
        startPolling(id);
      } else {
        throw new Error(response.message || 'Transaksi gagal diproses');
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      
      let errorMessage = 'Terjadi kesalahan saat memproses transaksi.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      setModalType('error');
      setModalTitle('Transaksi Gagal');
      setModalMessage(errorMessage);
      setShowModal(true);
      
      // Reset states on error to allow retry
      setHasSubmitted(false);
      setTransactionId(null);
    } finally {
      setIsSubmitting(false);
      setIsApiCalling(false);
    }
  };

  // Fungsi tombol kembali
  function handleBack() {
    // Stop polling if active
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setIsProcessing(false);
    
    navigate(-1);
  }

  // Handle modal close (dengan proper state reset)
  const handleCloseModal = () => {
    setShowModal(false);
    
    // Reset states for both error and success cases to allow retry or new transaction
    console.log('🔄 Resetting states after modal close');
    setHasSubmitted(false);
    setIsProcessing(false);
    setIsApiCalling(false);
    setTransactionId(null);
    
    // Navigate to bank-form only for error modals
    if (modalType === 'error') {
      console.log('🔄 Navigating to /bank-form due to error modal');
      navigate(-1);
    }
  };

  // Auto submit when component mounts (dengan STRICT prevention)
  useEffect(() => {
    // STRICT: Multiple layers of prevention
    if (hasSubmitted || isSubmitting || isProcessing || transactionId || isApiCalling) {
      console.log('⚠️  Auto-submit BLOCKED:', { 
        hasSubmitted, 
        isSubmitting, 
        isProcessing, 
        hasTransactionId: !!transactionId,
        isApiCalling 
      });
      return;
    }
    
    console.log('🚀 Starting auto-submit process');
    
    // Use ref to prevent multiple calls
    let submitted = false;
    
    const autoSubmit = async () => {
      try {
        // Prevent race condition
        if (submitted) {
          console.log('⚠️  Auto-submit cancelled: already submitted in this cycle');
          return;
        }
        submitted = true;
        
        // Mark as submitted immediately
        setHasSubmitted(true);
        
        // Small delay to show the confirmation page briefly
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Triple check before submitting
        if (isSubmitting || isProcessing || transactionId || isApiCalling) {
          console.log('⚠️  Auto-submit cancelled: state changed during delay');
          return;
        }
        
        console.log('📝 Executing auto-submit');
        await handleSubmitTransaction();
      } catch (error) {
        console.error('❌ Auto-submit error:', error);
        // Reset on error so user can try again
        setHasSubmitted(false);
        submitted = false;
      }
    };
    
    // Add small delay to prevent immediate multiple calls
    const timeoutId = setTimeout(autoSubmit, 100);
    
    return () => {
      clearTimeout(timeoutId);
      submitted = true; // Prevent execution if component unmounts
    };
  }, []); // STRICT: Empty dependency array

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <Box style={{ 
      background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #40E0D0 70%, #20B2AA 100%)',
      minHeight: '100vh',
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Ocean Animation Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '-8%',
        width: '100px',
        height: '35px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '40px',
        animation: 'floatCloud1 18s infinite linear',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '-10%',
        width: '80px',
        height: '30px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '35px',
        animation: 'floatCloud2 22s infinite linear reverse',
        zIndex: 0
      }} />

      {/* Success Celebration Bubbles */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '8%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50%',
        animation: 'celebrationBubble1 6s infinite ease-in-out',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '12%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '50%',
        animation: 'celebrationBubble2 8s infinite ease-in-out',
        zIndex: 0
      }} />

      {/* Bottom Wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100px',
        background: 'linear-gradient(to top, #F4A460 0%, rgba(222,184,135,0.8) 50%, transparent 100%)',
        clipPath: 'polygon(0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 50%, 100% 100%, 0% 100%)',
        zIndex: 0
      }} />

      {/* Main Content Container dengan Background Image */}
      <Box style={{
        margin: '0 auto',
        minHeight: '100vh',
        maxWidth: 400,
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        backgroundImage: 'url(/img/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>

        {/* Board Container */}
        <Box style={{
          width: '100%',
          maxWidth: '350px',
          position: 'relative',
          minHeight: '650px'
        }}>
          
          {/* Cat Character - Separate and above everything */}
          <Box style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5
          }}>
            <Box style={{
              width: '140px',
              height: '140px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/img/shine.png"
                alt="Shine"
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '-75px',
                  width: '280px',
                  height: '170px',
                  objectFit: 'contain',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              />
              <img
                src="/img/cat.png"
                alt="Cat Character"
                style={{
                  width: '250px',
                  height: '120px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                fontSize: '18px',
                animation: 'sparkle 2s infinite',
                zIndex: 2
              }}>✨</div>
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '20px',
                fontSize: '16px',
                animation: 'sparkle 2s infinite 0.5s',
                zIndex: 2
              }}>✨</div>
              <div style={{
                position: 'absolute',
                bottom: '25px',
                right: '20px',
                fontSize: '14px',
                animation: 'sparkle 2s infinite 1s',
                zIndex: 2
              }}>✨</div>
            </Box>
          </Box>
          
          {/* Board Background - Moved down */}
          <img
            src="/img/papan.png"
            alt="Board Background"
            style={{
              position: 'absolute',
              top: '150px',
              left: 0,
              width: '100%',
              height: 'calc(100% - 120px)',
              objectFit: 'cover',
              zIndex: 1
            }}
          />
          
          {/* Board Top (Header) - Moved down */}
          <img
            src="/img/papanatas.png"
            alt="Board Top"
            style={{
              position: 'absolute',
              top: '100px',
              left: 0,
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              zIndex: 2
            }}
          />

          {/* Content Container */}
          <Box style={{
            position: 'relative',
            zIndex: 3,
            padding: '140px 30px 40px',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            
            {/* Always show confirmation content - no conditional rendering */}
            <>
              {/* Title */}
              <Text style={{
                fontSize: '20px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '15px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                {isProcessing ? 'Memproses Transaksi' : 'Konfirmasi Data Anda'}
              </Text>

              {/* Selected Amount Display with processing indicator and timer */}
              <Box style={{
                padding: '15px',
                marginBottom: '10px',
                textAlign: 'left',
                background: isProcessing ? 'rgba(255, 165, 0, 0.1)' : 'rgba(139, 69, 19, 0.1)',
                borderRadius: '15px',
                border: isProcessing ? '2px solid rgba(255, 165, 0, 0.3)' : '2px solid rgba(139, 69, 19, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                {/* Coin Image Container with processing state */}
                <Box style={{
                  width: '60px',
                  height: '60px',
                  background: isProcessing 
                    ? 'linear-gradient(145deg, #FFA500, #FF8C00)' 
                    : 'linear-gradient(145deg, #8B4513, #A0522D)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                  border: '2px solid #DAA520',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {isProcessing ? (
                    <Loader size="md" color="white" />
                  ) : (
                    <img
                      src="/img/coin.png"
                      alt="Coin"
                      style={{
                        width: '35px',
                        height: '35px',
                        objectFit: 'contain',
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  )}
                </Box>

                {/* Text Content with Timer */}
                <Box style={{ flex: 1 }}>
                  <Box style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#8B4513',
                      marginBottom: '2px'
                    }}>
                      {isProcessing ? 'MEMPROSES ' : 'BONGKAR '} {formattedChipAmount}
                    </Text>
                    {isProcessing && (
                      <Text style={{
                        fontSize: '11px',
                        color: countdown < 60 ? '#FF4444' : '#FF69B4',
                        fontWeight: 600,
                        animation: countdown < 60 ? 'blink 1s infinite' : 'none'
                      }}>
                        ⏰ {formatTime(countdown)}
                      </Text>
                    )}
                  </Box>
                  <Text style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#8B4513'
                  }}>
                    (IDR {formatCurrency(senderIDR)})
                  </Text>
                </Box>
              </Box>

              {/* Processing Status Indicator */}
              {isProcessing && (
                <Box style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px',
                  padding: '10px',
                  background: 'rgba(255, 165, 0, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 165, 0, 0.3)'
                }}>
                  <Loader size="sm" color="orange" />
                  <Text style={{
                    fontSize: '14px',
                    color: '#8B4513',
                    fontWeight: 600
                  }}>
                    Mengecek status transaksi...
                  </Text>
                </Box>
              )}

              {/* Added Instruction Text */}
              <Text style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#8B4513',
                marginBottom: '20px',
                textAlign: 'center',
                fontStyle: 'normal'
              }}>
                {isProcessing 
                  ? 'TRANSAKSI SEDANG DIPROSES, HARAP TUNGGU...'
                  : 'TRANSAKSI AKAN DIMULAI OTOMATIS, HARAP TUNGGU...'
                }
              </Text>

              {/* Rekening Pengirim */}
              <Box style={{ marginBottom: '16px', textAlign: 'left' }}>
                <Box
                  style={{
                    background: '#00D1FF',
                    padding: '8px 0 7px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 800,
                      color: '#fff',
                      fontSize: '15px',
                      letterSpacing: 0.2,
                    }}
                  >
                    Rekening Pengirim
                  </Text>
                </Box>
                <Box>
                  <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                    Rekening Bank <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{senderBank}</span>
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                    ID Neo Party <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{senderNeoPartyId}</span>
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                    Username Neo Party <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>
                      {isLoadingNeoData ? 'Loading...' : (senderNeoData?.nick || 'Unknown')}
                    </span>
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                    IDR <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{formatCurrency(senderIDR)}</span>
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700, marginBottom: '4px' }}>
                    Nama Rekening <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>{senderAccountName}</span>
                  </Text>
                  <Text style={{ fontSize: '12px', color: '#B5894F', fontWeight: 700 }}>
                    Koin <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>
                      {isLoadingNeoData ? 'Loading...' : formatKoin(senderNeoData?.coin || senderKoin)}
                    </span>
                  </Text>
                </Box>
              </Box>

              {/* Kirim sesuai Neo ID di bawah */}
              <Box
                style={{
                  background: '#FF7A1A',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  color: '#fff',
                  marginBottom: '12px',
                }}
              >
                <Text style={{ fontWeight: 800, fontSize: '15px', letterSpacing: 0.2 }}>
                  Kirim Sesuai Neo ID di Bawah
                </Text>
              </Box>

              {/* Target info */}
              <Box style={{ marginBottom: '12px', textAlign: 'left' }}>
                <Text style={{ fontSize: '14px', fontWeight: 900, color: '#E69034', marginBottom: '4px' }}>
                  ID Neo Party <span style={{ float: 'right', fontWeight: 800, color: '#8B4513' }}>{targetNeoId}</span>
                </Text>
                <Text style={{ fontSize: '12px', fontWeight: 600, color: '#B5894F', marginBottom: '4px' }}>
                  Username Neo Party <span style={{ float: 'right', fontWeight: 600, color: '#8B4513' }}>
                    {isLoadingNeoData ? 'Loading...' : targetUsername}
                  </span>
                </Text>
                <Text style={{ fontSize: '12px', fontWeight: 600, color: '#B5894F' }}>
                  Koin <span style={{ float: 'right', fontWeight: 700, color: '#8B4513' }}>
                    {isLoadingNeoData ? 'Loading...' : formatKoin(targetKoin)}
                  </span>
                </Text>
              </Box>

              {/* Catatan */}
              <Text
                style={{
                  fontSize: '10px',
                  color: '#E69034',
                  marginTop: '8px',
                  marginBottom: '8px',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                *Pastikan anda mengirim chip sesuai dengan jumlah yang telah dipilih agar proses lebih cepat
              </Text>

              {/* Warning - show different message based on processing state */}
              <Box
                style={{
                  background: 'rgba(255, 165, 0, 0.1)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  marginTop: '6px',
                  marginBottom: '16px',
                }}
              >
                <Text
                  style={{
                    fontSize: '10px',
                    color: '#8B4513',
                    lineHeight: 1.3,
                    textAlign: 'center',
                  }}
                >
                  {isProcessing 
                    ? 'Jangan tutup halaman ini. Sistem akan otomatis memperbarui status transaksi Anda.'
                    : 'Silakan pastikan kembali bahwa semua informasi yang Anda masukkan sudah benar. Kami tidak dapat melakukan perubahan apabila terjadi kesalahan'
                  }
                </Text>
              </Box>

              {/* Tombol - Hanya tampilkan Kembali dan Batal Transaksi */}
              <Box style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button 
                  onClick={handleBack} 
                  disabled={isSubmitting || isCancelling || isProcessing || (transactionId && isProcessing)}
                  style={{
                    background: (isSubmitting || isCancelling || isProcessing || (transactionId && isProcessing))
                      ? 'linear-gradient(145deg, #ADB5BD, #868E96)'  // Disabled color
                      : 'linear-gradient(145deg, #6C757D, #5A6268)',  // Normal color
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: (isSubmitting || isCancelling || isProcessing || (transactionId && isProcessing)) 
                      ? 'not-allowed' 
                      : 'pointer',
                    boxShadow: (isSubmitting || isCancelling || isProcessing || (transactionId && isProcessing))
                      ? '0 2px 6px rgba(108, 117, 125, 0.2)'  // Reduced shadow when disabled
                      : '0 4px 12px rgba(108, 117, 125, 0.4)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    opacity: (isSubmitting || isCancelling || isProcessing || (transactionId && isProcessing)) ? 0.5 : 1,
                    transform: (isSubmitting || isCancelling || isProcessing || (transactionId && isProcessing)) ? 'scale(0.98)' : 'scale(1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  title={
                    (isSubmitting || isCancelling || isProcessing || (transactionId && isProcessing))
                      ? "Tidak dapat kembali saat transaksi sedang berjalan"
                      : "Kembali ke halaman sebelumnya"
                  }
                >
                  {(isSubmitting || isProcessing) && <Loader size="xs" color="white" />}
                  {isSubmitting || isProcessing ? 'Harap Tunggu...' : 'Kembali'}
                </button>
                
                <button 
                  onClick={handleCancelTransaction}
                  disabled={isSubmitting || isCancelling || !transactionId}
                  style={{
                    background: 'linear-gradient(145deg, #DC3545, #C82333)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: (isSubmitting || isCancelling || !transactionId) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    opacity: (isSubmitting || isCancelling || !transactionId) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {(isSubmitting || isCancelling) && <Loader size="xs" color="white" />}
                  {isSubmitting ? 'Memproses...' : (isCancelling ? 'Membatalkan...' : 'Batal Transaksi')}
                </button>
              </Box>
            </>
          </Box>
        </Box>
      </Box>

      {/* Modal for transaction status */}
      <Modal
        opened={showModal}
        onClose={handleCloseModal}
        title={modalTitle}
        centered
        closeOnClickOutside={true}
        closeOnEscape={true}
        withCloseButton={true}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Box style={{ textAlign: 'center', padding: '20px' }}>
          <Text style={{ 
            fontSize: '14px', 
            lineHeight: 1.5,
            color: modalType === 'error' ? '#e74c3c' : '#2c3e50'
          }}>
            {modalMessage}
          </Text>
          
          <Box style={{ marginTop: '20px' }}>
            <Button
              onClick={handleCloseModal}
              style={{
                background: modalType === 'error' 
                  ? 'linear-gradient(145deg, #e74c3c, #c0392b)'
                  : 'linear-gradient(145deg, #3498db, #2980b9)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {modalType === 'error' ? 'Tutup' : 'OK'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        opened={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Konfirmasi Pembatalan"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Box style={{ textAlign: 'center', padding: '20px' }}>
          <Text style={{ 
            fontSize: '16px', 
            lineHeight: 1.5,
            color: '#2c3e50',
            marginBottom: '20px'
          }}>
            Apakah Anda yakin ingin membatalkan transaksi ini?
          </Text>
          
          <Text style={{ 
            fontSize: '14px', 
            lineHeight: 1.4,
            color: '#e74c3c',
            marginBottom: '25px',
            fontWeight: 600
          }}>
            Transaksi sebesar IDR {parseInt(amount || '0').toLocaleString('id-ID')} akan dibatalkan.
          </Text>
          
          <Box style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center' 
          }}>
            <Button
              onClick={() => setShowCancelModal(false)}
              variant="outline"
              color="gray"
              style={{
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Tidak
            </Button>
            
            <Button
              onClick={confirmCancellation}
              color="red"
              style={{
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 'bold',
                fontSize: '14px',
                background: 'linear-gradient(145deg, #DC3545, #C82333)'
              }}
            >
              Ya, Batalkan
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-8px) scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }
        
        @keyframes floatCloud1 {
          0% { transform: translateX(-100px); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateX(calc(100vw + 100px)); opacity: 0.2; }
        }
        
        @keyframes floatCloud2 {
          0% { transform: translateX(calc(100vw + 80px)); opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { transform: translateX(-80px); opacity: 0.1; }
        }
        
        @keyframes celebrationBubble1 {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-40px) scale(1.2); opacity: 0.6; }
          100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
        }
        
        @keyframes celebrationBubble2 {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-35px) scale(1.1); opacity: 0.5; }
          100% { transform: translateY(-70px) scale(0.7); opacity: 0; }
        }
        
        @keyframes floatCat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes pendingPulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </Box>
  );
}