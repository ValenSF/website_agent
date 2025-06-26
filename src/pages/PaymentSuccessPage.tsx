// pages/SuccessPage.js (Fixed dengan Background Transparan)
import { Box, Text, Button } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, neoId, whatsappNumber, transactionId } = location.state || {};

  useEffect(() => {
    if (!amount || !neoId) {
      navigate('/');
    }
  }, [amount, neoId, navigate]);

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

      {/* Main Content Container dengan Background Image Langsung */}
      <Box style={{
        margin: '0 auto',
        minHeight: '100vh',
        maxWidth: 400,
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 15px',
        backgroundImage: 'url(/src/img/background.jpg)', // Background langsung di container
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>

        {/* Content langsung tanpa card transparan */}
        <Box style={{
          width: '100%',
          maxWidth: 350,
          padding: '30px 20px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          
          {/* Success Header dengan Fox */}
          <Box style={{
            marginBottom: '20px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
              borderRadius: '50%',
              margin: '0 auto 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: '0 8px 20px rgba(255,107,53,0.4)',
              border: '3px solid rgba(255,255,255,0.8)'
            }}>
              🦊
            </div>
            
            <Text style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#FFD700', // Solid gold color untuk kontras
              fontFamily: 'Arial Black, sans-serif',
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)' // Dark shadow untuk kontras
            }}>
              Cuan
            </Text>
          </Box>

          {/* Success Animation */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #51cf66, #40c057)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            animation: 'bounce 1s ease-in-out infinite alternate',
            boxShadow: '0 8px 25px rgba(81, 207, 102, 0.5)',
            border: '4px solid rgba(255,255,255,0.9)'
          }}>
            ✅
          </div>

          {/* Success Header */}
          <Text style={{
            fontSize: '24px',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            Pembayaran Sukses
          </Text>

          <Text style={{
            fontSize: '32px',
            fontWeight: 900,
            color: '#51cf66',
            marginBottom: '20px',
            textShadow: '3px 3px 6px rgba(0,0,0,0.8)'
          }}>
            IDR {parseInt(amount || '0').toLocaleString('id-ID')}
          </Text>

          {/* Transaction Details */}
          <Box style={{
            background: 'rgba(255,255,255,0.25)', // Transparan tapi readable
            borderRadius: '15px',
            padding: '15px',
            marginBottom: '25px',
            textAlign: 'left',
            border: '2px solid rgba(255,255,255,0.4)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(15px)'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <Text style={{ fontSize: '12px', color: '#fff', fontWeight: 600, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Neo ID:</Text>
              <Text style={{ fontSize: '14px', fontWeight: 700, color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{neoId}</Text>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <Text style={{ fontSize: '12px', color: '#fff', fontWeight: 600, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>WhatsApp:</Text>
              <Text style={{ fontSize: '14px', fontWeight: 700, color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{whatsappNumber}</Text>
            </div>
            <div>
              <Text style={{ fontSize: '12px', color: '#fff', fontWeight: 600, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Transaction ID:</Text>
              <Text style={{ fontSize: '14px', fontWeight: 700, color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>{transactionId}</Text>
            </div>
          </Box>

          {/* Decorative Elements */}
          <Box style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '25px'
          }}>
            <span style={{ 
              fontSize: '24px', 
              animation: 'sparkle 2s infinite',
              background: 'rgba(255,215,0,0.3)',
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
              border: '2px solid rgba(255,215,0,0.5)'
            }}>🎉</span>
            <span style={{ 
              fontSize: '24px', 
              animation: 'sparkle 2s infinite 0.5s',
              background: 'rgba(255,165,0,0.3)',
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 4px 12px rgba(255,165,0,0.4)',
              border: '2px solid rgba(255,165,0,0.5)'
            }}>💰</span>
            <span style={{ 
              fontSize: '24px', 
              animation: 'sparkle 2s infinite 1s',
              background: 'rgba(76,205,196,0.3)',
              borderRadius: '50%',
              padding: '8px',
              boxShadow: '0 4px 12px rgba(76,205,196,0.4)',
              border: '2px solid rgba(76,205,196,0.5)'
            }}>🎮</span>
          </Box>

          {/* Success Message */}
          <Box style={{
            background: 'rgba(212,237,218,0.3)', // Lebih transparan
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '20px',
            border: '2px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(10px)'
          }}>
            <Text style={{
              fontSize: '14px',
              color: '#fff',
              fontWeight: 600,
              lineHeight: 1.4,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              🎮 Top up berhasil! Selamat bermain dan raih kemenangan! 🏆
            </Text>
          </Box>

          {/* Back to Home Button */}
          <Button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              background: 'linear-gradient(45deg, #339af0, #228be6)',
              border: 'none',
              borderRadius: '15px',
              height: '50px',
              fontSize: '16px',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 6px 20px rgba(51, 154, 240, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(51, 154, 240, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(51, 154, 240, 0.4)';
            }}
          >
            🏠 Kembali ke Pilihan Top Up
          </Button>
        </Box>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-10px) scale(1.05); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0.8; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
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