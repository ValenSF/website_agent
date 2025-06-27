// pages/SuccessPage.js (Updated dengan Board Layout)
import { Box, Text, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, topUpValue, neoId, whatsappNumber, transactionId } = location.state || {};

  useEffect(() => {
    if (!amount || !topUpValue || !neoId) {
      navigate('/');
    }
  }, [amount, topUpValue, neoId, navigate]);

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
        backgroundImage: 'url(/src/img/background.jpg)',
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
            top: '-20px', // Above the board
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5 // Highest z-index
          }}>
            <Box style={{
              width: '140px',
              height: '140px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Shine background */}
              <img
                src="/src/img/shine.png"
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
              
              {/* Cat Image */}
              <img
                src="/src/img/cat.png"
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
              
              {/* Sparkles around cat */}
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
            src="/src/img/papan.png"
            alt="Board Background"
            style={{
              position: 'absolute',
              top: '150px', // Moved down from 0
              left: 0,
              width: '100%',
              height: 'calc(100% - 120px)', // Adjust height
              objectFit: 'cover',
              zIndex: 1
            }}
          />
          
          {/* Board Top (Header) - Moved down */}
          <img
            src="/src/img/papanatas.png"
            alt="Board Top"
            style={{
              position: 'absolute',
              top: '100px', // Moved down from 0
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
            padding: '140px 40px 40px', // Increased top padding for cat space
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            
            {/* Success Content */}
            <Box style={{ marginTop: '0px' }}> {/* Reset margin since cat is separate */}
              
              {/* Success Animation - Ganti dengan cekhijau.png */}
              <Box style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'bounce 1s ease-in-out infinite alternate'
              }}>
                <img
                  src="/src/img/cekhijau.png"
                  alt="Success Check"
                  style={{
                    width: '140px',
                    height: '140px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 25px rgba(81, 207, 102, 0.5))'
                  }}
                />
              </Box>

              {/* Success Text */}
              <Text style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#8B4513',
                marginBottom: '5px',
                fontFamily: '"Klavika Bold", "Klavika", Arial Black, sans-serif',
                textShadow: '1px 1px 3px rgba(255,255,255,0.8)'
              }}>
                Pembayaran Sukses
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
                <div>
                  <Text style={{ fontSize: '12px', color: '#8B4513', fontWeight: 600 }}>Transaction ID:</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 700, color: '#8B4513' }}>{transactionId}</Text>
                </div>
              </Box>

              {/* Celebration Icons */}
              <Box style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '25px'
              }}>
                <span style={{ 
                  fontSize: '28px', 
                  animation: 'bounce 2s infinite',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>🎉</span>
                <span style={{ 
                  fontSize: '28px', 
                  animation: 'bounce 2s infinite 0.3s',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>💰</span>
                <span style={{ 
                  fontSize: '28px', 
                  animation: 'bounce 2s infinite 0.6s',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                }}>🎮</span>
              </Box>

              {/* Success Message */}
              <Text style={{
                fontSize: '16px',
                color: '#8B4513',
                fontWeight: 700,
                lineHeight: 1.4,
                marginBottom: '5px',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}>
                Kamu mendapatkan {topUpValue}M
              </Text>
              
              <Text style={{
                fontSize: '16px',
                color: '#8B4513',
                fontWeight: 700,
                lineHeight: 1.4,
                marginBottom: '30px',
                textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
              }}>
                Segera cek Aplikasi Neo Party mu
              </Text>

              {/* Back to Home Button - Ganti dengan kembali.png */}
              <Box style={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                  }}
                >
                  <img
                    src="/src/img/kembali.png"
                    alt="Kembali"
                    style={{
                      width: '120px',
                      height: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 6px 20px rgba(139, 69, 19, 0.4))'
                    }}
                  />
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
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
      `}</style>
    </Box>
  );
}