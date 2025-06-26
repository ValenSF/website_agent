// App.tsx
import { Box } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ErrorAlert from './components/ErrorAlert';
import TopUpGrid from './components/TopUpGrid';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QrisPage from './pages/QrisPage';
import { SuccessPage } from './pages/SuccessPage';

export default function App() {
  const [neoId, setNeoId] = useState('');
  const [whatsappNumber, setWhatsapp] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleValidation = () => {
    if (neoId.trim() === '' || whatsappNumber.trim() === '') {
      setShowError(true);
      setIsValidated(false);
      setTimeout(() => setShowError(false), 3000);
    } else {
      setShowError(false);
      setIsValidated(true);
    }
  };

  const handleImageClick = (topUpAmount) => {
    if (!isValidated) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    navigate('/qris', { state: { topUpAmount, neoId, whatsappNumber } });
  };

  return (
    <Box style={{ 
      background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #20B2AA 70%, #008B8B 100%)',
      minHeight: '100vh', 
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Full Ocean Experience - Animated Elements di area luar */}
      
      {/* Animated Clouds */}
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
        top: '20%',
        right: '-15%',
        width: '80px',
        height: '30px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '40px',
        animation: 'floatCloud2 25s infinite linear',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '35%',
        left: '-8%',
        width: '60px',
        height: '25px',
        background: 'rgba(255,255,255,0.35)',
        borderRadius: '30px',
        animation: 'floatCloud3 30s infinite linear',
        zIndex: 0
      }} />

      {/* Floating Bubbles */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '5%',
        width: '8px',
        height: '8px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'bubble1 8s infinite ease-in-out',
        zIndex: 0
      }} />
      
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
        width: '6px',
        height: '6px',
        background: 'rgba(255,255,255,0.5)',
        borderRadius: '50%',
        animation: 'bubble2 10s infinite ease-in-out',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '70%',
        left: '10%',
        width: '4px',
        height: '4px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '50%',
        animation: 'bubble3 6s infinite ease-in-out',
        zIndex: 0
      }} />

      <div style={{
        position: 'absolute',
        top: '40%',
        right: '20%',
        width: '5px',
        height: '5px',
        background: 'rgba(255,255,255,0.6)',
        borderRadius: '50%',
        animation: 'bubble4 9s infinite ease-in-out',
        zIndex: 0
      }} />

      {/* Water Waves Effect */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '120px',
        background: 'linear-gradient(to top, #F4A460 0%, #DEB887 40%, transparent 100%)',
        clipPath: 'polygon(0 60%, 15% 50%, 30% 60%, 45% 45%, 60% 55%, 75% 40%, 90% 50%, 100% 45%, 100% 100%, 0% 100%)',
        zIndex: 0,
        animation: 'waveMove 12s infinite ease-in-out'
      }} />

      {/* Additional Wave Layer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        background: 'linear-gradient(to top, #CD853F 0%, rgba(205,133,63,0.8) 60%, transparent 100%)',
        clipPath: 'polygon(0 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 50%, 100% 100%, 0% 100%)',
        zIndex: 1,
        animation: 'waveMove2 15s infinite ease-in-out reverse'
      }} />

      {/* Sparkle Effects */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '15%',
        fontSize: '12px',
        animation: 'sparkle 3s infinite ease-in-out',
        zIndex: 0
      }}>✨</div>

      <div style={{
        position: 'absolute',
        top: '60%',
        right: '25%',
        fontSize: '10px',
        animation: 'sparkle 4s infinite ease-in-out 1s',
        zIndex: 0
      }}>✨</div>

      <div style={{
        position: 'absolute',
        top: '45%',
        left: '8%',
        fontSize: '8px',
        animation: 'sparkle 5s infinite ease-in-out 2s',
        zIndex: 0
      }}>✨</div>

      {/* Fish Swimming Effect */}
      <div style={{
        position: 'absolute',
        top: '55%',
        left: '-5%',
        fontSize: '16px',
        animation: 'swimFish 25s infinite linear',
        zIndex: 0
      }}>🐠</div>

      <div style={{
        position: 'absolute',
        top: '75%',
        right: '-8%',
        fontSize: '14px',
        animation: 'swimFish2 30s infinite linear reverse',
        zIndex: 0
      }}>🐟</div>

      {/* Main Content Container dengan Background Image */}
      <Box
        style={{
          margin: '0 auto',
          minHeight: '100vh',
          maxWidth: 600,
          overflowX: 'hidden',
          backgroundImage: 'url(/src/img/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingBottom: 66,
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 0 50px rgba(0,0,0,0.2)' // Subtle shadow untuk memisahkan dari background
        }}
      >
        {/* Optional: Subtle overlay untuk readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.03)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Content wrapper */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Header />
          
          <InputSection
            neoId={neoId}
            setNeoId={setNeoId}
            whatsappNumber={whatsappNumber}
            setWhatsapp={setWhatsapp}
            isValidated={isValidated}
            onValidation={handleValidation}
          />

          <ErrorAlert showError={showError} />

          <TopUpGrid
            isValidated={isValidated}
            onImageClick={handleImageClick}
          />
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
          0% { transform: translateX(calc(100vw + 80px)); opacity: 0.2; }
          50% { opacity: 0.5; }
          100% { transform: translateX(-80px); opacity: 0.2; }
        }

        @keyframes floatCloud3 {
          0% { transform: translateX(-60px); opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { transform: translateX(calc(100vw + 60px)); opacity: 0.4; }
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
        
        @keyframes bubble3 {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.9; }
          100% { transform: translateY(-50px) scale(0.7); opacity: 0; }
        }

        @keyframes bubble4 {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-35px) scale(1.2); opacity: 0.7; }
          100% { transform: translateY(-70px) scale(0.8); opacity: 0; }
        }

        @keyframes waveMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }

        @keyframes waveMove2 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-15px); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes swimFish {
          0% { transform: translateX(-50px) scaleX(1); }
          25% { transform: translateX(25vw) scaleX(1); }
          50% { transform: translateX(50vw) scaleX(-1); }
          75% { transform: translateX(75vw) scaleX(-1); }
          100% { transform: translateX(calc(100vw + 50px)) scaleX(1); }
        }

        @keyframes swimFish2 {
          0% { transform: translateX(calc(100vw + 50px)) scaleX(-1); }
          25% { transform: translateX(75vw) scaleX(-1); }
          50% { transform: translateX(50vw) scaleX(1); }
          75% { transform: translateX(25vw) scaleX(1); }
          100% { transform: translateX(-50px) scaleX(-1); }
        }

        @media (max-width: 768px) {
          /* Reduce animations on mobile for performance */
          @keyframes floatCloud1, @keyframes floatCloud2, @keyframes floatCloud3 {
            0% { transform: translateX(-60px); opacity: 0.2; }
            100% { transform: translateX(calc(100vw + 60px)); opacity: 0.2; }
          }
        }
      `}</style>
    </Box>
  );
}