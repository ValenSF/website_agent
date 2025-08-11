import { Box, Text, Button, Select, LoadingOverlay } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { apiService } from '../../services/apiService';

export default function QrisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const retryCountRef = useRef(0); // Untuk melacak jumlah percobaan
  const maxRetries = 60; // Sekitar 2.5 menit dengan interval 5 detik
  
  // ✅ Prevent multiple API calls
  const initializingRef = useRef(false);
  const autoCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  // ✅ Get data from location state, including transaction data
  const { 
    amount_id,
    topUpAmount, 
    topUpValue, 
    neoId, 
    whatsappNumber, 
    referralCode,
    transactionData,
    transactionId: existingTransactionId,
    qrCodeUrl: existingQrCodeUrl
  } = location.state || {};

  // ✅ Handle modal close with transaction cancellation
  const handleModalClose = async () => {
    const currentTransactionId = transactionId || existingTransactionId;
    
    if (currentTransactionId) {
      try {
        console.log('🚫 [QRIS] Cancelling transaction:', currentTransactionId);
        await apiService.cancelTransaction(currentTransactionId);
        console.log('✅ [QRIS] Transaction cancelled successfully');
      } catch (err) {
        console.error('🚨 [QRIS] Failed to cancel transaction:', err);
      }
    }
    
    console.log('🏠 [QRIS] Navigating to home page');
    navigate('/');
  };

  // Debug logging untuk tracking referral
  useEffect(() => {
    console.log('🔍 [QRIS] useEffect triggered with state:', {
      amount_id,
      topUpAmount,
      topUpValue,
      neoId,
      whatsappNumber,
      existingTransactionId,
      existingQrCodeUrl,
      transactionId,
      qrCodeUrl
    });

    if (!topUpAmount || !topUpValue || !neoId || !whatsappNumber) {
      console.log('❌ [QRIS] Missing required data, redirecting to home');
      navigate('/');
      return;
    }

    if (existingTransactionId && existingQrCodeUrl) {
      console.log('✅ [QRIS] Using existing transaction data, starting auto-check');
      setTransactionId(existingTransactionId);
      setQrCodeUrl(existingQrCodeUrl);
      startAutoCheck();
    } else {
      console.warn('⚠️ [QRIS] No existing transaction data, initializing new transaction');
      if (!initializingRef.current && !transactionId) {
        initializeTransaction();
      }
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          console.log('⏰ [QRIS] Countdown expired, triggering handleModalClose');
          clearInterval(timer);
          if (autoCheckIntervalRef.current) {
            clearInterval(autoCheckIntervalRef.current);
            autoCheckIntervalRef.current = null;
          }
          handleModalClose(); // Call handleModalClose instead of navigating to failed
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log('🧹 [QRIS] Cleaning up timer and auto-check interval');
      clearInterval(timer);
      if (autoCheckIntervalRef.current) {
        clearInterval(autoCheckIntervalRef.current);
        autoCheckIntervalRef.current = null;
      }
      hasStartedRef.current = false; // Reset untuk sesi berikutnya
      retryCountRef.current = 0; // Reset retry count
    };
  }, [topUpAmount, topUpValue, neoId, whatsappNumber, navigate, transactionId, existingTransactionId, existingQrCodeUrl]);

  // ✅ Initialize transaction only if no existing data (fallback)
  const initializeTransaction = async () => {
    if (initializingRef.current) {
      console.log('⚠️ [QRIS] Already initializing, skipping...');
      return;
    }

    initializingRef.current = true;
    setLoading(true);
    setError('');

    try {
      const amountId = amount_id;
      
      const finalReferralCode = referralCode || 
                              sessionStorage.getItem('referralCode') || 
                              new URLSearchParams(window.location.search).get('ref') ||
                              new URLSearchParams(window.location.search).get('referral') ||
                              'default_ref';
      
      const formattedPhone = apiService.formatPhoneNumber(whatsappNumber);

      console.log('🚀 [QRIS] Creating fallback transaction:', {
        amount_id: amountId,
        agent_referral: finalReferralCode,
        neo_player_id: neoId,
        phone_no: formattedPhone
      });

      const response = await apiService.createWebDeposit({
        amount_id: amountId,
        agent_referral: finalReferralCode,
        neo_player_id: neoId,
        phone_no: formattedPhone,
      });

      console.log('📨 [QRIS] Fallback transaction response:', response);

      if (response.status === 'success' && response.data) {
        setTransactionId(response.data.id);
        if (response.data.data.qr_url) {
          setQrCodeUrl(response.data.data.qr_url);
        }
        setError('');
        console.log('✅ [QRIS] Fallback transaction created successfully');
        
        // Start auto-check after transaction is created
        startAutoCheck();
        
      } else {
        const errorMsg = response.message || 'Gagal membuat transaksi';
        setError(errorMsg);
        console.error('❌ [QRIS] Fallback transaction failed:', {
          status: response.status,
          message: response.message
        });
        
        setTimeout(() => {
          navigate('/failed', {
            state: {
              reason: 'transaction_failed',
              message: errorMsg,
              amount: topUpAmount,
              topUpValue: topUpValue,
              neoId,
              whatsappNumber
            }
          });
        }, 3000);
      }
    } catch (err) {
      console.error('🚨 [QRIS] Fallback transaction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat transaksi';
      setError(errorMessage);
      
      setTimeout(() => {
        navigate('/failed', {
          state: {
            reason: 'network_error',
            message: errorMessage,
            amount: topUpAmount,
            topUpValue: topUpValue,
            neoId,
            whatsappNumber
          }
        });
      }, 3000);
    } finally {
      setLoading(false);
      initializingRef.current = false;
    }
  };

  // ✅ Payment status check
  const checkPaymentStatus = async () => {
    const currentTransactionId = transactionId || existingTransactionId;

    if (!currentTransactionId || checkingStatus) {
      console.log('⚠️ [QRIS] Skipping status check - no transaction ID or already checking');
      return;
    }

    setCheckingStatus(true);
    setError('');

    try {
      console.log('📊 [QRIS] Checking payment status for transaction:', currentTransactionId);
      const response = await apiService.checkDepositStatus(currentTransactionId);
      console.log('📊 [QRIS] Payment status response:', response);

      if (response.status === 'success' && response.data && response.data.status) {
        const { status } = response.data;
        console.log('📊 [QRIS] Payment status:', status);

        switch (status.toLowerCase()) {
          case 'completed':
          case 'success':
          case 'paid':
          case 'settlement':
          case 'confirmed':
          case 'finished':
            console.log('🚀 [QRIS] Payment successful, navigating to success page');
            if (autoCheckIntervalRef.current) {
              clearInterval(autoCheckIntervalRef.current);
              autoCheckIntervalRef.current = null;
            }
            navigate('/success', {
              state: {
                amount: topUpAmount,
                topUpValue: topUpValue,
                neoId,
                whatsappNumber,
                transactionId: currentTransactionId.toString(),
                paymentTime: new Date().toISOString()
              }
            });
            break;

          case 'pending':
            retryCountRef.current += 1;
            break;

          case 'failed':
          case 'cancelled':
          case 'expired':
          case 'denied':
            console.log('❌ [QRIS] Payment failed, navigating to failed page:', status);
            if (autoCheckIntervalRef.current) {
              clearInterval(autoCheckIntervalRef.current);
              autoCheckIntervalRef.current = null;
            }
            navigate('/failed', {
              state: {
                reason: status,
                message: getFailedMessage(status),
                amount: topUpAmount,
                topUpValue: topUpValue,
                neoId,
                whatsappNumber,
                transactionId: currentTransactionId.toString()
              }
            });
            break;

          default:
            console.error('⚠️ [QRIS] Unknown payment status:', status);
            setError(`Status pembayaran tidak dikenal: ${status}`);
            retryCountRef.current += 1;
        }
      } else {
        console.error('❌ [QRIS] Invalid API response:', response);
        setError(response.message || 'Respons API tidak valid');
        retryCountRef.current += 1;
      }
    } catch (err) {
      console.error('🚨 [QRIS] Payment status check error:', err, {
        transactionId: currentTransactionId,
        response: (typeof err === 'object' && err !== null && 'response' in err)
          ? (err as any).response?.data
          : undefined
      });
      setError('Terjadi kesalahan saat mengecek status pembayaran');
      retryCountRef.current += 1;
    } finally {
      console.log('✅ [QRIS] Resetting checkingStatus to false');
      setCheckingStatus(false);
    }
  };

  // ✅ Start auto-check
  const startAutoCheck = () => {
    const currentTransactionId = transactionId || existingTransactionId;

    if (!currentTransactionId) {
      console.warn('❌ [QRIS] No transaction ID, skipping auto-check');
      return;
    }

    if (autoCheckIntervalRef.current || hasStartedRef.current) {
      console.log('⚠️ [QRIS] Auto-check already running or started');
      return;
    }

    hasStartedRef.current = true;
    console.log('🔄 [QRIS] Starting auto-check for transaction:', currentTransactionId);

    // Cek pertama setelah 5 detik
    setTimeout(() => {
      console.log('🔍 [QRIS] Initial payment status check');
      checkPaymentStatus();
    }, 5000);

    // Loop pengecekan tiap 15 detik
    autoCheckIntervalRef.current = setInterval(() => {
      if (checkingStatus || loading) {
        console.log('⏸ [QRIS] Skipping check - still checking or loading');
        return;
      }

      if (retryCountRef.current >= maxRetries) {
        console.error('❌ [QRIS] Max retries reached, stopping auto-check');
        clearInterval(autoCheckIntervalRef.current!);
        autoCheckIntervalRef.current = null;
        navigate('/failed', {
          state: {
            reason: 'max_retries',
            message: 'Gagal memeriksa status pembayaran setelah beberapa percobaan',
            amount: topUpAmount,
            topUpValue: topUpValue,
            neoId,
            whatsappNumber,
            transactionId: currentTransactionId.toString()
          }
        });
        return;
      }

      console.log('🔁 [QRIS] Performing periodic payment status check...');
      checkPaymentStatus();
    }, 15000); // <-- interval 15 detik
  };

  // Get appropriate message for failed status
  const getFailedMessage = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'failed':
        return 'Pembayaran gagal diproses';
      case 'cancelled':
        return 'Pembayaran dibatalkan';
      case 'expired':
        return 'Waktu pembayaran telah habis';
      case 'denied':
        return 'Pembayaran ditolak';
      default:
        return 'Pembayaran tidak berhasil';
    }
  };

  const formatTopUpValue = (value: string): string => {
    const numValue = parseInt(value);
    
    if (numValue >= 1000) {
      const billions = numValue / 1000;
      if (billions % 1 === 0) {
        return `${billions}`;
      } else {
        return `${billions.toFixed(1)}`;
      }
    }
    
    return `${value}`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Payment methods dengan instruksi cara bayar
  const paymentMethods = [
    {
      value: 'gopay',
      label: 'GoPay',
      instructions: [
        '1. Buka aplikasi Gojek',
        '2. Pilih menu GoPay',
        '3. Tap "Scan QR"',
        '4. Scan QR code di atas',
        '5. Masukkan PIN GoPay',
        '6. Pembayaran selesai'
      ]
    },
    {
      value: 'ovo',
      label: 'OVO',
      instructions: [
        '1. Buka aplikasi OVO',
        '2. Tap "Scan" di beranda',
        '3. Scan QR code QRIS',
        '4. Konfirmasi nominal',
        '5. Masukkan PIN OVO',
        '6. Pembayaran berhasil'
      ]
    },
    {
      value: 'dana',
      label: 'DANA',
      instructions: [
        '1. Buka aplikasi DANA',
        '2. Pilih "Scan QR"',
        '3. Arahkan kamera ke QR code',
        '4. Periksa detail pembayaran',
        '5. Masukkan PIN DANA',
        '6. Transaksi selesai'
      ]
    },
    {
      value: 'bca',
      label: 'BCA mobile',
      instructions: [
        '1. Buka BCA mobile',
        '2. Pilih menu "QRIS"',
        '3. Tap "Bayar dengan QRIS"',
        '4. Scan QR code',
        '5. Masukkan PIN m-BCA',
        '6. Konfirmasi pembayaran'
      ]
    },
    {
      value: 'mandiri',
      label: 'Livin by Mandiri',
      instructions: [
        '1. Buka aplikasi Livin',
        '2. Pilih "QRIS"',
        '3. Tap "Scan & Pay"',
        '4. Scan QR code QRIS',
        '5. Konfirmasi detail',
        '6. Masukkan MPIN'
      ]
    },
    {
      value: 'bni',
      label: 'BNI Mobile',
      instructions: [
        '1. Buka BNI Mobile Banking',
        '2. Pilih menu "Transfer"',
        '3. Pilih "QRIS"',
        '4. Scan QR code',
        '5. Konfirmasi transaksi',
        '6. Masukkan PIN'
      ]
    },
    {
      value: 'cimb',
      label: 'CIMB Niaga',
      instructions: [
        '1. Buka OCTO Mobile',
        '2. Pilih "QRIS Payment"',
        '3. Scan QR code',
        '4. Verifikasi detail',
        '5. Masukkan PIN',
        '6. Pembayaran selesai'
      ]
    },
    {
      value: 'linkaja',
      label: 'LinkAja',
      instructions: [
        '1. Buka aplikasi LinkAja',
        '2. Tap "Scan"',
        '3. Scan QR code QRIS',
        '4. Konfirmasi pembayaran',
        '5. Masukkan PIN LinkAja',
        '6. Transaksi berhasil'
      ]
    }
  ];

  const selectedMethod = paymentMethods.find(method => method.value === selectedPaymentMethod);

  return (
    <Box style={{
      background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #20B2AA 70%, #008B8B 100%)',
      minHeight: '100vh',
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <LoadingOverlay visible={loading} />

      {/* Debug panel untuk development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          // position: 'fixed',
          // bottom: '10px',
          // left: '10px',
          // background: 'rgba(0,0,0,0.9)',
          // color: 'white',
          // padding: '8px',
          // borderRadius: '5px',
          // fontSize: '10px',
          // zIndex: 9999,
          // maxWidth: '250px'
        }}>
          {/* <div>🔗 Referral: {referralCode || sessionStorage.getItem('referralCode') || 'none'}</div>
          <div>💳 Amount: {topUpAmount}</div>
          <div>📞 Phone: {whatsappNumber}</div>
          <div>🎮 Neo: {neoId}</div>
          <div>🆔 TxID: {transactionId || existingTransactionId || 'none'}</div>
          <div>🔄 Auto-check: {autoCheckIntervalRef.current ? 'ON' : 'OFF'}</div>
          <div>📊 QR: {qrCodeUrl || existingQrCodeUrl ? 'READY' : 'LOADING'}</div> */}
        </div>
      )}

      {/* Ocean Animations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '120px',
        height: '40px',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50px',
        animation: 'floatCloud1 20s infinite linear',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '25%',
        right: '-8%',
        width: '60px',
        height: '25px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '30px',
        animation: 'floatCloud2 25s infinite linear reverse',
        zIndex: 0
      }} />

      {/* Floating Bubbles */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '8%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'bubble1 8s infinite ease-in-out',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '60%',
        right: '12%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '50%',
        animation: 'bubble2 10s infinite ease-in-out',
        zIndex: 0
      }} />

      {/* Bottom Wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '120px',
        background: 'linear-gradient(to top, #F4A460 0%, #DEB887 40%, transparent 100%)',
        clipPath: 'polygon(0 60%, 15% 50%, 30% 60%, 45% 45%, 60% 55%, 75% 40%, 90% 50%, 100% 45%, 100% 100%, 0% 100%)',
        zIndex: 0
      }} />

      {/* Main Content Container */}
      <Box style={{
        margin: '0 auto',
        minHeight: '100vh',
        maxWidth: 400,
        position: 'relative',
        zIndex: 2,
        backgroundImage: 'url(/img/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}>

        {/* Content Wrapper */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>

          {/* Error Message */}
          {error && (
            <Box style={{
              background: 'rgba(255, 107, 107, 0.9)',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
              width: '100%',
              maxWidth: '340px',
              color: 'white',
              textAlign: 'center',
              fontWeight: 600
            }}>
              {error}
            </Box>
          )}

          {/* Total Pembayaran Card */}
          <Box style={{
            background: 'rgba(255, 248, 220, 0.95)',
            borderRadius: '15px',
            padding: '18px 25px',
            marginBottom: '20px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            border: '1px solid rgba(210, 180, 140, 0.6)',
            width: '100%',
            maxWidth: '340px',
            position: 'relative',
            marginTop: '20px'
          }}>
            <Text style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#8B4513',
              textAlign: 'left',
              marginBottom: '5px',
              fontFamily: '"Segoe UI", Arial, sans-serif'
            }}>
              Total Pembayaran
            </Text>

            <Text style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#8B4513',
              textAlign: 'left',
              fontFamily: '"Segoe UI", Arial Black, sans-serif'
            }}>
              IDR {parseInt(topUpAmount || '0').toLocaleString('id-ID')}
            </Text>

            {/* Top Up Amount dibawah IDR */}
            <Text style={{
              fontSize: '16px',
              fontWeight: 900,
              color: '#8B4513',
              textAlign: 'left',
              marginTop: '0px',
              fontFamily: '"Segoe UI", Arial Black, sans-serif'
            }}>
              {formatTopUpValue(topUpValue)}
            </Text>

            {/* Transaction ID */}
            {(transactionId || existingTransactionId) && (
              <Text style={{
                fontSize: '10px',
                color: '#666',
                fontWeight: 500,
                marginTop: '5px'
              }}>
                Transaction ID: {transactionId || existingTransactionId}
              </Text>
            )}

            {/* Countdown Timer */}
            <Text style={{
              fontSize: '11px',
              color: countdown < 60 ? '#FF4444' : '#FF69B4',
              fontWeight: 600,
              position: 'absolute',
              bottom: '12px',
              right: '20px',
              animation: countdown < 60 ? 'blink 1s infinite' : 'none'
            }}>
              ⏰ {formatTime(countdown)}
            </Text>
          </Box>

          {/* QRIS Card */}
          <Box style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            marginBottom: '20px'
          }}>
            {(qrCodeUrl || existingQrCodeUrl) ? (
              <Box style={{
                position: 'relative',
                width: '100%',
                maxWidth: '340px'
              }}>
                <img
                  src="/img/papanqris.png"
                  alt="QRIS Frame"
                  style={{
                    width: '100%',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                
                <Box style={{
                  position: 'absolute',
                  top: '60%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  background: 'white',
                  padding: '0px',
                  borderRadius: '2px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={qrCodeUrl || existingQrCodeUrl}
                    alt="QRIS Code"
                    style={{
                      width: '190px',
                      height: '190px',
                      objectFit: 'contain',
                      display: 'block',
                      margin: 0,
                      padding: 0
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <img
                src="/img/papanqris.png"
                alt="QRIS Frame with Cat"
                style={{
                  width: '100%',
                  height: 'auto',
                  position: 'relative',
                  zIndex: 2
                }}
              />
            )}
          </Box>

          {/* Payment Methods Card */}
          <Box style={{
            position: 'relative',
            width: '100%',
            maxWidth: '340px',
            marginBottom: '20px'
          }}>
            <img
              src="/img/papanbayar.png"
              alt="Payment Methods"
              style={{
                width: '100%',
                height: 'auto'
              }}
            />
          </Box>

          {/* Dropdown Cara Bayar per Bank */}
          <Box style={{
            width: '100%',
            maxWidth: '340px',
            marginBottom: '20px'
          }}>
            <Select
              placeholder="Lihat Cara Bayar"
              value={selectedPaymentMethod}
              onChange={(value: string | null) => setSelectedPaymentMethod(value || '')}
              data={paymentMethods.map(method => ({ value: method.value, label: method.label }))}
              style={{
                width: '100%'
              }}
              styles={{
                input: {
                  backgroundColor: '#FFFFFF',
                  border: '3px solid #7CB342',
                  borderRadius: '12px',
                  padding: '15px 20px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#333',
                  minHeight: '50px'
                },
                dropdown: {
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #7CB342',
                  borderRadius: '8px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  zIndex: 9999
                },
                option: {
                  padding: '15px 20px',
                  fontSize: '16px',
                  fontWeight: 500,
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  '&[data-selected]': {
                    backgroundColor: '#7CB342 !important',
                    color: 'white !important'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(124, 179, 66, 0.15) !important'
                  }
                }
              }}
            />
          </Box>

          {/* Instruksi Cara Bayar */}
          {selectedMethod && (
            <Box style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              border: '2px solid #7CB342',
              width: '100%',
              maxWidth: '340px'
            }}>
              <Text style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#7CB342',
                textAlign: 'center',
                marginBottom: '15px',
                fontFamily: '"Segoe UI", Arial, sans-serif'
              }}>
                Cara Bayar dengan {selectedMethod.label}
              </Text>

              <Box style={{ textAlign: 'left' }}>
                {selectedMethod.instructions.map((instruction, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: '13px',
                      color: '#333',
                      marginBottom: '8px',
                      lineHeight: '1.4',
                      fontFamily: '"Segoe UI", Arial, sans-serif'
                    }}
                  >
                    {instruction}
                  </Text>
                ))}
              </Box>
            </Box>
          )}

          {/* Back Button */}
          <Button
            onClick={() => navigate('/')}
            style={{
              borderRadius: '10px',
              height: '35px',
              fontWeight: 500,
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.6)',
              background: 'rgba(255,255,255,0.8)',
              color: '#666',
              backdropFilter: 'blur(10px)',
              padding: '0 20px'
            }}
          >
            Kembali
          </Button>
        </div>
      </Box>

      {/* CSS Animations */}
      <style>{`
        @keyframes floatCloud1 {
          0% { transform: translateX(-120px); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateX(calc(100vw + 120px)); opacity: 0.3; }
        }
        
        @keyframes floatCloud2 {
          0% { transform: translateX(calc(100vw + 60px)); opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { transform: translateX(-60px); opacity: 0.2; }
        }
        
        @keyframes bubble1 {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
        }
        
        @keyframes bubble2 {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-40px) scale(1.3); opacity: 0.8; }
          100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </Box>
  );
}