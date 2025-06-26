// components/Header.tsx
import { Box, Text } from '@mantine/core';

export default function Header() {
  return (
    <Box style={{ 
      textAlign: 'center', 
      padding: '20px 15px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '0 0 20px 20px',
      margin: '0 0 20px 0'
    }}>
      
      {/* Fox Character */}
      <Box style={{
        width: '100px',
        height: '100px',
        background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
        borderRadius: '50%',
        margin: '0 auto 15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '50px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        border: '3px solid rgba(255,255,255,0.3)',
        position: 'relative'
      }}>
        {/* Ganti dengan gambar karakter asli jika ada */}
        🦊
        
        {/* Efek sparkle */}
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '10px',
          fontSize: '20px',
          animation: 'sparkle 2s infinite'
        }}>
          ✨
        </div>
      </Box>
      
      {/* Logo "Cuan" */}
      <Text style={{
        fontSize: '36px',
        fontWeight: 900,
        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        fontFamily: 'Arial Black, sans-serif',
        letterSpacing: '2px',
        marginBottom: '10px'
      }}>
        Cuan
      </Text>
      
      {/* Tagline */}
      <Text style={{
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        letterSpacing: '0.5px',
        lineHeight: 1.3,
        maxWidth: '280px',
        margin: '0 auto'
      }}>
        BELI DI SINI PASTI UNTUNG BERKALI-KALI LIPAT 🔥
      </Text>

      {/* Decorative elements */}
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '10px'
      }}>
        <span style={{ fontSize: '16px', animation: 'bounce 2s infinite' }}>💰</span>
        <span style={{ fontSize: '16px', animation: 'bounce 2s infinite 0.2s' }}>💎</span>
        <span style={{ fontSize: '16px', animation: 'bounce 2s infinite 0.4s' }}>🎮</span>
      </Box>

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </Box>
  );
}

// Alternative Version - Jika ingin tetap menggunakan gambar judul.jpg
export function HeaderWithImage() {
  return (
    <Box style={{ 
      position: 'relative',
      padding: '15px',
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '0 0 20px 20px',
      margin: '0 0 20px 0'
    }}>
      
      {/* Background image container */}
      <Box style={{
        position: 'relative',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
      }}>
        <img
          src="/src/img/judul.jpg"
          alt="Judul"
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'block',
            filter: 'brightness(1.1) contrast(1.1)'
          }}
        />
        
        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,107,53,0.3), rgba(247,147,30,0.3))',
          pointerEvents: 'none'
        }} />
      </Box>
      
      {/* Floating tagline */}
      <Text style={{
        position: 'absolute',
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#ffffff',
        background: 'rgba(0,0,0,0.7)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 600,
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'center',
        maxWidth: '90%',
        lineHeight: 1.2
      }}>
        BELI DI SINI PASTI UNTUNG BERKALI-KALI LIPAT 🔥
      </Text>
    </Box>
  );
}