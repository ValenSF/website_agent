import { Box, Text } from '@mantine/core';

interface TopUpItemProps {
  image: string;
  amount_id: number;
  amount: string;
  topUpAmount: string; // Add this prop
  description: string;
  price: string;
  isValidated: boolean;
  onImageClick: (amount_id: number, amount: string, topUpAmount: string) => void; // Update signature
}

export default function TopUpItem({ 
  image, 
  amount_id,
  amount,
  topUpAmount, // Add this prop
  description, 
  price,
  isValidated, 
  onImageClick 
}: TopUpItemProps) {

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isValidated) return;
    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.25)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isValidated) return;
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
  };
  
  return (
    <Box
      style={{
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '15px', // Slightly reduced
        padding: '15px 12px', // Slightly reduced
        textAlign: 'center',
        border: '3px solid rgba(255,255,255,0.4)',
        backdropFilter: 'blur(15px)',
        cursor: isValidated ? 'pointer' : 'not-allowed',
        opacity: isValidated ? 1 : 0.5,
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight: '200px', // Slightly reduced
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}
      onClick={() => isValidated && onImageClick(amount_id, amount, topUpAmount)} // Pass both values
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      
      {/* Icon Container dengan Frame - Slightly smaller */}
      <Box style={{
        background: 'linear-gradient(145deg, #8B4513, #A0522D)',
        borderRadius: '12px', // Slightly reduced
        padding: '12px', // Slightly reduced
        margin: '0 auto 12px',
        width: '85px', // Reduced dari 100px
        height: '85px', // Reduced dari 100px
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
        border: '2px solid #DAA520', // Slightly thinner
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sparkle effects - Slightly smaller */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '3px',
          height: '3px',
          background: '#FFD700',
          borderRadius: '50%',
          animation: 'sparkle 2s infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '12px',
          width: '2px',
          height: '2px',
          background: '#FFA500',
          borderRadius: '50%',
          animation: 'sparkle 2s infinite 0.5s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '15px',
          width: '4px',
          height: '4px',
          background: '#FFD700',
          borderRadius: '50%',
          animation: 'sparkle 2s infinite 1s'
        }} />
        
        {/* Coin Icon - Slightly smaller */}
        <img
          src={image}
          alt="Coin"
          style={{
            width: '50px', // Reduced dari 60px
            height: '50px', // Reduced dari 60px
            objectFit: 'contain',
            position: 'relative',
            zIndex: 1
          }}
        />
      </Box>

      {/* Text Content */}
      <Box>
        <Text style={{
          color: '#fff',
          fontSize: '13px', // Slightly reduced
          fontWeight: 700,
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          marginBottom: '4px',
          letterSpacing: '0.5px'
        }}>
          {description}
        </Text>
        <Text style={{
          color: '#fff',
          fontSize: '11px', // Slightly reduced
          opacity: 0.9,
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          fontWeight: 600
        }}>
          {price}
        </Text>
      </Box>

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </Box>
  );
}