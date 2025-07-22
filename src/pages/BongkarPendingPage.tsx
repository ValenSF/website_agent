import { Box, Text, Loader, Modal, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

interface LocationState {
  transactionId?: number;
  amount?: string;
  chipAmount?: string;
  bankData?: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  neoId?: string;
  whatsappNumber?: string;
}

export default function BongkarPendingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;
  
  // Extract data from state
  const transactionId = locationState?.transactionId;
  const amount = locationState?.amount || '0';
  const chipAmount = locationState?.chipAmount || '0';
  const bankData = locationState?.bankData;
  const neoId = locationState?.neoId || '';
  const whatsappNumber = locationState?.whatsappNumber || '';
  
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const formattedChipAmount = formatChipAmount(chipAmount);

  // Format chip amount with thousands separator and "chip" suffix
  function formatChipAmount(amount: string) {
    const num = parseInt(amount || '0', 10);
    return `${num.toLocaleString('id-ID')} chip`;
  }

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

  // Function to cancel transaction
  const handleCancelTransaction = async () => {
    if (!transactionId || isCancelling) return;
    
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
      setIsPolling(false);
      
      console.log('🚫 [PENDING] Cancelling transaction ID:', transactionId);
      
      // Call cancel API with correct payload
      const response = await apiService.cancelTransaction(transactionId);
      
      if (response.status === 'success') {
        console.log('✅ [PENDING] Transaction cancelled successfully');
        
        // Navigate back to bank form with success message
        navigate('/bank-form', {
          state: {
            message: 'Transaksi berhasil dibatalkan.',
            messageType: 'success'
          }
        });
      } else {
        throw new Error(response.message || 'Gagal membatalkan transaksi');
      }
    } catch (error) {
      console.error('❌ [PENDING] Error cancelling transaction:', error);
      
      let errorMessage = 'Terjadi kesalahan saat membatalkan transaksi.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      alert(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  // Function to go back
  const handleGoBack = () => {
    // Stop polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setIsPolling(false);
    
    // Navigate back to bank form
    navigate('/');
  };

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
          
          setIsPolling(false);
          
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
          
          setIsPolling(false);
          
          // Navigate back to form with error
          navigate('/bank-form', {
            state: {
              error: 'Transaksi gagal diproses. Silakan coba lagi.'
            }
          });
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
      
      setIsPolling(false);
      
      // Navigate back with error
      navigate('/bank-form', {
        state: {
          error: 'Terjadi kesalahan saat mengecek status transaksi.'
        }
      });
    }
  };

  // Start polling when component mounts
  useEffect(() => {
    if (!transactionId) {
      navigate('/');
      return;
    }

    setIsPolling(true);
    
    // Check immediately
    checkTransactionStatus(transactionId);
    
    // Then check every 3 seconds
    const interval = setInterval(() => {
      checkTransactionStatus(transactionId);
    }, 3000);
    
    setPollingInterval(interval);
    
    // Stop polling after 5 minutes (timeout)
    const timeoutId = setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setPollingInterval(null);
        setIsPolling(false);
        
        // Navigate back with timeout error
        navigate('/bank-form', {
          state: {
            error: 'Transaksi membutuhkan waktu lebih lama dari biasanya. Silakan coba lagi nanti.'
          }
        });
      }
    }, 300000); // 5 minutes
    
    // Cleanup function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [transactionId, navigate]);

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
          minHeight: '600px'
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
            padding: '140px 40px 40px',
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            
            {/* Pending Content */}
            <Box style={{ marginTop: '0px' }}>
              {/* Pending Icon with Loader */}
              <Box style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <Loader 
                  size="xl" 
                  color="orange" 
                  style={{
                    filter: 'drop-shadow(0 8px 25px rgba(255, 165, 0, 0.5))'
                  }}
                />
              </Box>

              <Text style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '5px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                Sedang Memproses
              </Text>

              <Text style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '20px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                IDR {parseInt(amount || '0').toLocaleString('id-ID')}
              </Text>

              <Box style={{
                padding: '20px',
                marginBottom: '25px',
                textAlign: 'left',
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '15px',
                border: '2px solid rgba(255, 165, 0, 0.3)'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Bank:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>
                    {bankData?.bankName ? getBankDisplayName(bankData.bankName) : 'N/A'}
                  </Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>No. Rekening:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>
                    {bankData?.accountNumber || 'N/A'}
                  </Text>
                </div>
                <div>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Nama Pemilik:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>
                    {bankData?.accountHolderName || 'N/A'}
                  </Text>
                </div>
              </Box>

              <Box style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '25px'
              }}>
                <span style={{ 
                  fontSize: '28px', 
                  animation: 'pendingPulse 2s infinite',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>⏳</span>
                <span style={{ 
                  fontSize: '28px', 
                  animation: 'pendingPulse 2s infinite 0.3s',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>💰</span>
                <span style={{ 
                  fontSize: '28px', 
                  animation: 'pendingPulse 2s infinite 0.6s',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>🏦</span>
              </Box>

              <Text style={{
                fontSize: '16px',
                color: '#8B4513',
                fontWeight: 700,
                lineHeight: 1.4,
                marginBottom: '5px',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}>
                Transaksi {formattedChipAmount} sedang diproses
              </Text>
              
              <Text style={{
                fontSize: '14px',
                color: '#FF8C00',
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: '15px',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}>
                Mohon tunggu, ini membutuhkan waktu beberapa saat...
              </Text>

              <Box style={{
                padding: '15px',
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 165, 0, 0.3)',
                marginBottom: '20px'
              }}>
                <Text style={{
                  fontSize: '12px',
                  color: '#8B4513',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  textAlign: 'center'
                }}>
                  Jangan tutup halaman ini. Sistem akan otomatis memperbarui status transaksi Anda.
                </Text>
              </Box>

              <Box style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
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

              {/* Action Buttons */}
              <Box style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                marginTop: '20px'
              }}>
                <button 
                  onClick={handleGoBack}
                  disabled={isCancelling}
                  style={{
                    background: 'linear-gradient(145deg, #6C757D, #5A6268)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: isCancelling ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(108, 117, 125, 0.4)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    opacity: isCancelling ? 0.6 : 1
                  }}
                >
                  Kembali
                </button>
                
                <button 
                  onClick={handleCancelTransaction}
                  disabled={isCancelling}
                  style={{
                    background: 'linear-gradient(145deg, #DC3545, #C82333)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    cursor: isCancelling ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    opacity: isCancelling ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isCancelling && <Loader size="xs" color="white" />}
                  {isCancelling ? 'Membatalkan...' : 'Batal Transaksi'}
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

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
        @keyframes pendingPulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
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
      `}</style>
    </Box>
  );
}