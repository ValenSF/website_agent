// pages/FailedPage.tsx
import { Box, Text, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function FailedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    reason, 
    message, 
    amount, 
    topUpValue, 
    neoId, 
    whatsappNumber, 
    transactionId 
  } = location.state || {};

  useEffect(() => {
    if (!reason || !message) {
      navigate('/');
    }
  }, [reason, message, navigate]);

  const getFailedIcon = (reason: string) => {
    switch (reason) {
      case 'timeout':
        return '⏰';
      case 'cancelled':
        return '❌';
      case 'expired':
        return '⌛';
      case 'failed':
        return '💥';
      case 'denied':
        return '🚫';
      case 'network_error':
        return '📶';
      case 'transaction_failed':
        return '💳';
      default:
        return '❌';
    }
  };

  const getFailedColor = (reason: string) => {
    switch (reason) {
      case 'timeout':
      case 'expired':
        return '#FF9800'; // Orange
      case 'cancelled':
        return '#9E9E9E'; // Grey
      case 'network_error':
        return '#2196F3'; // Blue
      default:
        return '#F44336'; // Red
    }
  };

  const getActionButtonText = (reason: string) => {
    switch (reason) {
      case 'timeout':
      case 'expired':
        return 'Coba Lagi';
      case 'network_error':
        return 'Coba Lagi';
      default:
        return 'Mulai Transaksi Baru';
    }
  };

  const handleRetry = () => {
    if (reason === 'timeout' || reason === 'expired' || reason === 'network_error') {
      // For timeout/expired/network errors, go back to QRIS page with same data
      navigate('/qris', {
        state: {
          topUpAmount: amount,
          topUpValue: topUpValue,
          neoId,
          whatsappNumber
        }
      });
    } else {
      // For other failures, start fresh
      navigate('/');
    }
  };

  return (
    <Box style={{ 
      background: `linear-gradient(180deg, ${getFailedColor(reason)} 0%, ${getFailedColor(reason)}CC 30%, ${getFailedColor(reason)}99 70%, ${getFailedColor(reason)}66 100%)`,
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
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '40px',
        animation: 'floatSad 25s infinite linear',
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
        animation: 'floatSad 30s infinite linear reverse',
        zIndex: 0
      }} />

      {/* Failed Effect Particles */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '15%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '50%',
        animation: 'fallDown 3s infinite ease-in-out',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: '3px',
        height: '3px',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50%',
        animation: 'fallDown 4s infinite ease-in-out 1s',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '25%',
        width: '5px',
        height: '5px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'fallDown 3.5s infinite ease-in-out 2s',
        zIndex: 0
      }} />

      {/* Bottom Wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100px',
        background: `linear-gradient(to top, ${getFailedColor(reason)}DD 0%, ${getFailedColor(reason)}AA 50%, transparent 100%)`,
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
          
          {/* Cat Character - Sad Cat */}
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
              {/* Cat Image with sad animation */}
              <img
                src="/img/cat.png"
                alt="Sad Cat Character"
                style={{
                  width: '250px',
                  height: '120px',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3)) grayscale(30%)',
                  animation: 'sadBob 4s ease-in-out infinite'
                }}
              />
              
              {/* Sad effects around cat */}
              <div style={{
                position: 'absolute',
                top: '20%',
                right: '15%',
                fontSize: '16px',
                animation: 'sadDrop 3s infinite',
                zIndex: 2
              }}>💧</div>
              
              <div style={{
                position: 'absolute',
                top: '25%',
                left: '15%',
                fontSize: '14px',
                animation: 'sadDrop 3s infinite 1s',
                zIndex: 2
              }}>💧</div>
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
              zIndex: 1,
              filter: 'brightness(0.9) saturate(0.8)'
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
              zIndex: 2,
              filter: 'brightness(0.9) saturate(0.8)'
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
            
            {/* Failed Content */}
            <Box>
              
              {/* Failed Icon */}
              <Box style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                animation: 'failedShake 0.5s ease-in-out 3',
                background: `${getFailedColor(reason)}22`,
                borderRadius: '50%',
                border: `3px solid ${getFailedColor(reason)}`
              }}>
                {getFailedIcon(reason)}
              </Box>

              {/* Failed Text */}
              <Text style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '5px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                Pembayaran {reason === 'cancelled' ? 'Dibatalkan' : reason === 'timeout' ? 'Timeout' : 'Gagal'}
              </Text>

              {amount && (
                <Text style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#8B4513',
                  marginBottom: '20px',
                  fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                  textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
                }}>
                  IDR {parseInt(amount || '0').toLocaleString('id-ID')}
                </Text>
              )}

              {/* Error Message */}
              <Text style={{
                fontSize: '16px',
                color: '#8B4513',
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: '25px',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.8)',
                padding: '15px',
                borderRadius: '10px',
                border: `2px solid ${getFailedColor(reason)}`,
                boxShadow: `0 4px 15px ${getFailedColor(reason)}33`
              }}>
                {message}
              </Text>

              {/* Transaction Details */}
              {transactionId && (
                <Box style={{
                  padding: '20px',
                  marginBottom: '25px',
                  textAlign: 'left',
                  background: 'rgba(139, 69, 19, 0.1)',
                  borderRadius: '15px',
                  border: '2px solid rgba(139, 69, 19, 0.3)'
                }}>
                  {neoId && (
                    <div style={{ marginBottom: '10px' }}>
                      <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Neo ID:</Text>
                      <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>{neoId}</Text>
                    </div>
                  )}
                  {whatsappNumber && (
                    <div style={{ marginBottom: '10px' }}>
                      <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>WhatsApp:</Text>
                      <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>{whatsappNumber}</Text>
                    </div>
                  )}
                  <div style={{ marginBottom: '10px' }}>
                    <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Transaction ID:</Text>
                    <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>{transactionId}</Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Status:</Text>
                    <Text style={{ fontSize: '14px', fontWeight: 700, color: getFailedColor(reason) }}>{reason}</Text>
                  </div>
                </Box>
              )}

              {/* Reason-specific suggestions */}
              <Box style={{
                padding: '15px',
                marginBottom: '25px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '10px',
                border: `1px solid ${getFailedColor(reason)}55`
              }}>
                <Text style={{
                  fontSize: '14px',
                  color: '#666',
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  {reason === 'timeout' || reason === 'expired' 
                    ? '💡 Saran: Pastikan koneksi internet stabil dan lakukan pembayaran lebih cepat.'
                    : reason === 'network_error'
                    ? '💡 Saran: Periksa koneksi internet Anda dan coba lagi.'
                    : reason === 'cancelled'
                    ? '💡 Anda dapat mencoba transaksi baru kapan saja.'
                    : '💡 Saran: Periksa saldo e-wallet atau hubungi customer service bank Anda.'
                  }
                </Text>
              </Box>

              {/* Action Buttons */}
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                width: '100%'
              }}>
                {/* Retry/New Transaction Button */}
                <button
                  onClick={handleRetry}
                  style={{
                    background: `linear-gradient(135deg, ${getFailedColor(reason)} 0%, ${getFailedColor(reason)}DD 50%, ${getFailedColor(reason)}BB 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '15px 20px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 6px 20px ${getFailedColor(reason)}44`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${getFailedColor(reason)}66`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${getFailedColor(reason)}44`;
                  }}
                >
                  {getActionButtonText(reason)}
                </button>

                {/* Back to Home Button */}
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: `2px solid ${getFailedColor(reason)}`,
                    borderRadius: '12px',
                    padding: '12px 20px',
                    color: getFailedColor(reason),
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = getFailedColor(reason);
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                    e.currentTarget.style.color = getFailedColor(reason);
                  }}
                >
                  Kembali ke Beranda
                </button>

                {/* Contact Support Button (for certain failure types) */}
                {(reason === 'failed' || reason === 'denied') && (
                  <button
                    onClick={() => {
                      // You can implement contact support functionality here
                      // For now, it will show an alert
                      alert('Hubungi customer service di WhatsApp: +62xxx-xxxx-xxxx');
                    }}
                    style={{
                      background: 'rgba(33, 150, 243, 0.1)',
                      border: '2px solid #2196F3',
                      borderRadius: '12px',
                      padding: '10px 15px',
                      color: '#2196F3',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#2196F3';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(33, 150, 243, 0.1)';
                      e.currentTarget.style.color = '#2196F3';
                    }}
                  >
                    📞 Hubungi Customer Service
                  </button>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CSS Animations */}
      <style>{`
        @keyframes sadBob {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-5px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-3px); }
        }
        
        @keyframes sadDrop {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 0.3; transform: translateY(30px) scale(0.5); }
          100% { opacity: 0; transform: translateY(40px) scale(0); }
        }
        
        @keyframes failedShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes fallDown {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { opacity: 0; transform: translateY(100vh); }
        }
        
        @keyframes floatSad {
          0% { transform: translateX(-100px); opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { transform: translateX(calc(100vw + 100px)); opacity: 0.1; }
        }
      `}</style>
    </Box>
  );
}