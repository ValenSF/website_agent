import { Box, Text, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function QrisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown
  
  const { topUpAmount, neoId, whatsappNumber } = location.state || {};

  useEffect(() => {
    if (!topUpAmount || !neoId || !whatsappNumber) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [topUpAmount, neoId, whatsappNumber, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSuccessPayment = () => {
    navigate('/success', { 
      state: { 
        amount: topUpAmount, 
        neoId, 
        whatsappNumber,
        transactionId: `TXN${Date.now()}`
      } 
    });
  };

  return (
    <Box style={{ 
      background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #20B2AA 70%, #008B8B 100%)',
      minHeight: '100vh', 
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
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

      {/* Main Content Container dengan Background Image */}
      <Box style={{
        margin: '0 auto',
        minHeight: '100vh',
        maxWidth: 400,
        position: 'relative',
        zIndex: 2,
        backgroundImage: 'url(/src/img/background.jpg)', // Background image di container
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}>
        
        {/* Content Overlay untuk readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Content Wrapper */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          padding: '20px 15px',
          minHeight: '100vh'
        }}>
          
          {/* Header with Fox Character */}
          <Box style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            padding: '15px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
              borderRadius: '50%',
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              🦊
            </div>
            
            <Text style={{
              fontSize: '24px',
              fontWeight: 900,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Arial Black, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              Cuan
            </Text>
          </Box>

          {/* Payment Info Card */}
          <Box style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,215,0,0.5)'
          }}>
            <Text style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#333',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              Total Pembayaran
            </Text>
            
            <Text style={{
              fontSize: '28px',
              fontWeight: 900,
              color: '#FF6B35',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              IDR {parseInt(topUpAmount || '0').toLocaleString('id-ID')}
            </Text>

            {/* Countdown Timer */}
            <Box style={{
              background: 'linear-gradient(45deg, #FFE4B5, #F0E68C)',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              marginBottom: '10px',
              border: '2px solid #DAA520'
            }}>
              <Text style={{ 
                fontSize: '14px', 
                color: '#8B4513', 
                fontWeight: 700,
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}>
                ⏰ Selesaikan pembayaran dalam: {formatTime(countdown)}
              </Text>
            </Box>
          </Box>

          {/* QRIS Code Card */}
          <Box style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '25px',
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,215,0,0.6)'
          }}>
            <Text style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#333',
              marginBottom: '20px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              QRIS
            </Text>

            {/* QR Code Container dengan Golden Frame */}
            <Box style={{
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              borderRadius: '15px',
              padding: '15px',
              margin: '0 auto 20px',
              maxWidth: '280px',
              boxShadow: '0 8px 25px rgba(255,165,0,0.4)',
              border: '3px solid #B8860B'
            }}>
              <Box style={{
                background: '#fff',
                borderRadius: '10px',
                padding: '15px',
                margin: '0 auto',
                display: 'inline-block',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {/* QR Code - Replace dengan QR code asli */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  background: 'repeating-linear-gradient(45deg, #000 0px, #000 4px, #fff 4px, #fff 8px)',
                  backgroundSize: '8px 8px',
                  position: 'relative',
                  border: '2px solid #333'
                }}>
                  {/* QR Corner Markers */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '30px',
                    height: '30px',
                    border: '3px solid #000',
                    background: '#fff'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      background: '#000',
                      margin: '4px'
                    }}></div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '30px',
                    height: '30px',
                    border: '3px solid #000',
                    background: '#fff'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      background: '#000',
                      margin: '4px'
                    }}></div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    width: '30px',
                    height: '30px',
                    border: '3px solid #000',
                    background: '#fff'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      background: '#000',
                      margin: '4px'
                    }}></div>
                  </div>
                </div>
              </Box>
              
              {/* Transaction ID */}
              <Text style={{
                fontSize: '12px',
                color: '#8B4513',
                marginTop: '10px',
                fontWeight: 700,
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}>
                Nomor: {neoId}#{Date.now().toString().slice(-6)}
              </Text>
            </Box>

            {/* Payment Methods */}
            <Box style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              marginBottom: '15px'
            }}>
              {['DANA', 'OVO', 'GoPay', 'ShopeePay'].map((method) => (
                <div key={method} style={{
                  background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
                  padding: '8px 4px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#495057',
                  border: '1px solid #dee2e6',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {method}
                </div>
              ))}
            </Box>

            {/* Bank Logos */}
            <Box style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px'
            }}>
              {['BCA', 'Mandiri', 'BNI', 'BRI'].map((bank) => (
                <div key={bank} style={{
                  background: 'linear-gradient(45deg, #fff, #f8f9fa)',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#333',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {bank}
                </div>
              ))}
            </Box>
          </Box>

          {/* Instructions */}
          <Box style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '15px',
            padding: '15px',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <Text style={{
              fontSize: '14px',
              color: '#555',
              textAlign: 'center',
              lineHeight: 1.5,
              fontWeight: 500
            }}>
              📱 Silakan scan kode QR di atas menggunakan aplikasi pembayaran favorit Anda 
              (misalnya GoPay, OVO, DANA, LinkAja, Mobile Banking, dll).
            </Text>
          </Box>

          {/* Action Buttons */}
          <Box style={{ display: 'flex', gap: '12px' }}>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              style={{
                flex: 1,
                borderRadius: '12px',
                height: '45px',
                fontWeight: 600,
                border: '2px solid rgba(255,255,255,0.8)',
                background: 'rgba(255,255,255,0.9)',
                color: '#666',
                backdropFilter: 'blur(10px)'
              }}
            >
              Kembali
            </Button>
            
            <Button
              onClick={handleSuccessPayment}
              style={{
                flex: 2,
                background: 'linear-gradient(45deg, #51cf66, #40c057)',
                border: 'none',
                borderRadius: '12px',
                height: '45px',
                fontWeight: 700,
                color: 'white',
                boxShadow: '0 4px 15px rgba(81, 207, 102, 0.4)'
              }}
            >
              Sudah Bayar ✅
            </Button>
          </Box>
        </div>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
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
      `}</style>
    </Box>
  );
}