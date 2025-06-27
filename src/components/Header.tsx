import { Box, Text } from '@mantine/core';

export default function Header() {
  return (
    <Box style={{ 
      textAlign: 'center', 
      padding: '15px 10px',
      background: 'transparent',
      backdropFilter: 'blur(10px)',
      borderRadius: '0 0 20px 20px',
      margin: '0 auto 20px auto',
      maxWidth: 400, // Sama dengan QrisPage
      width: '100%'
    }}>
      
      {/* Cat Character - Adjusted size */}
      <Box style={{
        width: '100%',
        maxWidth: '400px', // Consistent dengan QrisPage
        height: '300px', // Reduced dari 350px
        background: 'transparent',
        margin: '0 auto 0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '50px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Shine background - Adjusted */}
        <img
          src="/src/img/shine.png"
          alt="Shine"
          style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '380px', // Reduced dari 450px
            height: '320px', // Reduced dari 400px
            objectFit: 'contain',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
        <img
          src="/src/img/cat.png"
          alt="Cat Character"
          style={{
            width: '240px', // Reduced dari 280px
            height: '240px', // Reduced dari 280px
            objectFit: 'contain',
            borderRadius: '50%',
            display: 'block',
            position: 'relative',
            zIndex: 1
          }}
        />
        {/* Efek sparkle */}
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '25%',
          fontSize: '20px', // Reduced dari 24px
          animation: 'sparkle 2s infinite',
          zIndex: 2
        }}>
          ✨
        </div>
        
        <div style={{
          position: 'absolute',
          top: '70px',
          left: '20%',
          fontSize: '18px', // Reduced dari 20px
          animation: 'sparkle 2s infinite 0.5s',
          zIndex: 2
        }}>
          ✨
        </div>
        
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '30%',
          fontSize: '14px', // Reduced dari 16px
          animation: 'sparkle 2s infinite 1s',
          zIndex: 2
        }}>
          ✨
        </div>
      </Box>
      
      {/* Tagline dengan Klavika Font */}
      <Box style={{ marginTop: '-20px' }}>
        <Text style={{
          fontFamily: '"Klavika Bold", "Klavika", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#ffffff',
          fontSize: '22px', // Slightly reduced
          fontWeight: 700,
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          letterSpacing: '1px',
          lineHeight: 1.2,
          maxWidth: '380px', // Consistent dengan container
          margin: '0 auto',
          textAlign: 'center'
        }}>
          BELI DI SINI PASTI UNTUNG BERKALI-KALI LIPAT 🔥
        </Text>
      </Box>

      {/* Decorative elements dengan Klavika */}
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '15px'
      }}>
        <span style={{ 
          fontSize: '20px',
          animation: 'bounce 2s infinite',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }}>💰</span>
        <span style={{ 
          fontSize: '20px',
          animation: 'bounce 2s infinite 0.2s',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }}>💎</span>
        <span style={{ 
          fontSize: '20px',
          animation: 'bounce 2s infinite 0.4s',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
        }}>🎮</span>
      </Box>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </Box>
  );
}