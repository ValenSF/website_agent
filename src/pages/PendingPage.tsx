// pages/PendingPage.tsx
import { Box, Text, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService';

export default function PendingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [autoCheckCount, setAutoCheckCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  
  const { 
    amount, 
    topUpValue, 
    neoId, 
    whatsappNumber, 
    transactionId,
    status,
    message,
    qrCodeUrl
  } = location.state || {};

  useEffect(() => {
    if (!amount || !topUpValue || !neoId || !transactionId) {
      navigate('/');
      return;
    }

    // Auto-check status every 10 seconds for up to 30 attempts (5 minutes)
    const autoCheckInterval = setInterval(async () => {
      if (autoCheckCount >= 30) {
        clearInterval(autoCheckInterval);
        // After 5 minutes, navigate to timeout
        navigate('/failed', {
          state: {
            reason: 'timeout',
            message: 'Pembayaran terlalu lama diproses, silakan coba lagi',
            amount,
            topUpValue,
            neoId,
            whatsappNumber,
            transactionId
          }
        });
        return;
      }

      setIsChecking(true);
      try {
        const response = await apiService.checkDepositStatus(parseInt(transactionId));
        
        if (response.status === 'success' && response.data) {
          const currentStatus = response.data.status.toLowerCase();
          
          if (currentStatus === 'completed' || currentStatus === 'success' || currentStatus === 'paid') {
            clearInterval(autoCheckInterval);
            navigate('/success', {
              state: {
                amount,
                topUpValue,
                neoId,
                whatsappNumber,
                transactionId,
                paymentTime: new Date().toISOString()
              }
            });
          } else if (currentStatus === 'failed' || currentStatus === 'cancelled' || currentStatus === 'expired') {
            clearInterval(autoCheckInterval);
            navigate('/failed', {
              state: {
                reason: currentStatus,
                message: getFailedMessage(currentStatus),
                amount,
                topUpValue,
                neoId,
                whatsappNumber,
                transactionId
              }
            });
          }
        }
      } catch (error) {
        console.error('Auto-check error:', error);
      } finally {
        setIsChecking(false);
        setAutoCheckCount(prev => prev + 1);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(autoCheckInterval);
  }, [autoCheckCount, amount, topUpValue, neoId, whatsappNumber, transactionId, navigate]);

  const getFailedMessage = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'failed':
        return 'Pembayaran gagal diproses';
      case 'cancelled':
        return 'Pembayaran dibatalkan';
      case 'expired':
        return 'Waktu pembayaran telah habis';
      default:
        return 'Pembayaran tidak berhasil';
    }
  };

  const manualCheckStatus = async () => {
    setIsChecking(true);
    try {
      const response = await apiService.checkDepositStatus(parseInt(transactionId));
      
      if (response.status === 'success' && response.data) {
        const currentStatus = response.data.status.toLowerCase();
        
        if (currentStatus === 'completed' || currentStatus === 'success' || currentStatus === 'paid') {
          navigate('/success', {
            state: {
              amount,
              topUpValue,
              neoId,
              whatsappNumber,
              transactionId,
              paymentTime: new Date().toISOString()
            }
          });
        } else if (currentStatus === 'failed' || currentStatus === 'cancelled' || currentStatus === 'expired') {
          navigate('/failed', {
            state: {
              reason: currentStatus,
              message: getFailedMessage(currentStatus),
              amount,
              topUpValue,
              neoId,
              whatsappNumber,
              transactionId
            }
          });
        }
      }
    } catch (error) {
      console.error('Manual check error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Box style={{ 
      background: 'linear-gradient(180deg, #FFA726 0%, #FF9800 30%, #F57C00 70%, #E65100 100%)',
      minHeight: '100vh',
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '-8%',
        width: '100px',
        height: '35px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '40px',
        animation: 'floatSlow 20s infinite linear',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '-10%',
        width: '80px',
        height: '30px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '35px',
        animation: 'floatSlow 25s infinite linear reverse',
        zIndex: 0
      }} />

      {/* Pending Animation Circles */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '10%',
        width: '8px',
        height: '8px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'pendingPulse 2s infinite ease-in-out',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '50%',
        animation: 'pendingPulse 2s infinite ease-in-out 0.5s',
        zIndex: 0
      }} />

      {/* Bottom Wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100px',
        background: 'linear-gradient(to top, #D84315 0%, rgba(216,67,21,0.8) 50%, transparent 100%)',
        clipPath: 'polygon(0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 50%, 100% 100%, 0% 100%)',
        zIndex: 0
      }} />

      {/* Main Content Container */}
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
          
          {/* Cat Character */}
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
              {/* Cat Image with waiting animation */}
              <img
                src="/img/cat.png"
                alt="Cat Character"
                style={{
                  width: '250px',
                  height: '120px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
                  animation: 'waitingBob 3s ease-in-out infinite'
                }}
              />
              
              {/* Loading dots around cat */}
              <div style={{
                position: 'absolute',
                top: '30%',
                right: '10%',
                fontSize: '12px',
                animation: 'loadingDot1 1.5s infinite',
                zIndex: 2
              }}>⏳</div>
              
              <div style={{
                position: 'absolute',
                bottom: '30%',
                left: '10%',
                fontSize: '12px',
                animation: 'loadingDot2 1.5s infinite 0.5s',
                zIndex: 2
              }}>⏳</div>
              
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                fontSize: '12px',
                animation: 'loadingDot3 1.5s infinite 1s',
                zIndex: 2
              }}>⏳</div>
            </Box>
          </Box>
          
          {/* Board Background */}
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
          
          {/* Board Top */}
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
            <Box>
              
              {/* Pending Animation - Loading Spinner */}
              <Box style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'spin 2s linear infinite'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid rgba(255,165,0,0.3)',
                  borderTop: '4px solid #FF9800',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </Box>

              {/* Pending Text */}
              <Text style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '5px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                Pembayaran Sedang Diproses
              </Text>

              <Text style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '20px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                IDR {parseInt(amount || '0').toLocaleString('id-ID')}
              </Text>

              {/* Status Message */}
              <Text style={{
                fontSize: '16px',
                color: '#8B4513',
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: '25px',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.7)',
                padding: '15px',
                borderRadius: '10px',
                border: '2px solid rgba(255,165,0,0.5)'
              }}>
                {message || 'Pembayaran Anda sedang diproses. Mohon tunggu beberapa saat...'}
              </Text>

              {/* Transaction Details */}
              <Box style={{
                padding: '20px',
                marginBottom: '25px',
                textAlign: 'left',
                background: 'rgba(139, 69, 19, 0.1)',
                borderRadius: '15px',
                border: '2px solid rgba(139, 69, 19, 0.3)'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Neo ID:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>{neoId}</Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>WhatsApp:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>{whatsappNumber}</Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Transaction ID:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>{transactionId}</Text>
                </div>
                <div>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Status:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#FF9800' }}>{status || 'Pending'}</Text>
                </div>
              </Box>

              {/* Auto-check indicator */}
              <Box style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginBottom: '20px',
                padding: '10px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '10px',
                border: '1px solid rgba(255,165,0,0.3)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isChecking ? '#4CAF50' : '#FF9800',
                  animation: isChecking ? 'pulse 1s infinite' : 'none'
                }} />
                <Text style={{
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: 600
                }}>
                  {isChecking ? 'Sedang mengecek status...' : `Auto-check aktif (${autoCheckCount}/30)`}
                </Text>
              </Box>

              {/* Action Buttons */}
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                width: '100%'
              }}>
                {/* Manual Check Button */}
                <button
                  onClick={manualCheckStatus}
                  disabled={isChecking}
                  style={{
                    background: isChecking
                      ? 'linear-gradient(135deg, #FFA726 0%, #FF9800 50%, #F57C00 100%)'
                      : 'linear-gradient(135deg, #FF9800 0%, #F57C00 50%, #E65100 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: isChecking ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                    opacity: isChecking ? 0.7 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!isChecking) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 152, 0, 0.6)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isChecking) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.4)';
                    }
                  }}
                >
                  {isChecking ? 'Mengecek Status...' : 'Cek Status Sekarang'}
                </button>

                {/* Back to Home Button */}
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: '2px solid #FF9800',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    color: '#FF9800',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#FF9800';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.color = '#FF9800';
                  }}
                >
                  Kembali ke Beranda
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes waitingBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes loadingDot1 {
          0%, 66%, 100% { opacity: 0.3; }
          33% { opacity: 1; }
        }
        
        @keyframes loadingDot2 {
          0%, 66%, 100% { opacity: 0.3; }
          33% { opacity: 1; }
        }
        
        @keyframes loadingDot3 {
          0%, 66%, 100% { opacity: 0.3; }
          33% { opacity: 1; }
        }
        
        @keyframes pendingPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        
        @keyframes floatSlow {
          0% { transform: translateX(-100px); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateX(calc(100vw + 100px)); opacity: 0.2; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
}